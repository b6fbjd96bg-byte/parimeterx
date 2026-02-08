import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, Globe, Shield, FileText, AlertTriangle, CheckCircle, 
  Clock, RefreshCw, Loader2, Search, Eye, Target, Play
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';

interface ActivityItem {
  id: string;
  type: 'scan_started' | 'scan_completed' | 'scan_failed' | 'vulnerability_found' | 'vulnerability_fixed';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    severity?: string;
    target?: string;
    count?: number;
  };
}

const ActivityPage = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!user) return;
    setLoading(true);

    // Get recent scans
    const { data: scans } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get scan IDs for vulnerability lookup
    const scanIds = scans?.map(s => s.id) || [];
    
    // Get recent vulnerabilities
    const { data: vulns } = await supabase
      .from('vulnerabilities')
      .select('*')
      .in('scan_id', scanIds)
      .order('created_at', { ascending: false })
      .limit(50);

    const activityItems: ActivityItem[] = [];

    // Create activities from scans
    scans?.forEach(scan => {
      if (scan.status === 'completed' && scan.completed_at) {
        activityItems.push({
          id: `scan-complete-${scan.id}`,
          type: 'scan_completed',
          title: 'Scan Completed',
          description: `Security scan completed for ${scan.target_url}`,
          timestamp: scan.completed_at,
          metadata: { target: scan.target_url }
        });
      }
      if (scan.status === 'failed') {
        activityItems.push({
          id: `scan-failed-${scan.id}`,
          type: 'scan_failed',
          title: 'Scan Failed',
          description: `Scan failed for ${scan.target_url}`,
          timestamp: scan.created_at,
          metadata: { target: scan.target_url }
        });
      }
      if (scan.status === 'running' || scan.status === 'pending') {
        activityItems.push({
          id: `scan-started-${scan.id}`,
          type: 'scan_started',
          title: 'Scan Started',
          description: `Started security scan for ${scan.target_url}`,
          timestamp: scan.created_at,
          metadata: { target: scan.target_url }
        });
      }
    });

    // Create activities from vulnerabilities
    vulns?.forEach(vuln => {
      if (vuln.status === 'fixed') {
        activityItems.push({
          id: `vuln-fixed-${vuln.id}`,
          type: 'vulnerability_fixed',
          title: 'Vulnerability Fixed',
          description: `Marked "${vuln.title}" as fixed`,
          timestamp: vuln.created_at,
          metadata: { severity: vuln.severity }
        });
      } else {
        activityItems.push({
          id: `vuln-found-${vuln.id}`,
          type: 'vulnerability_found',
          title: 'Vulnerability Detected',
          description: vuln.title,
          timestamp: vuln.created_at,
          metadata: { severity: vuln.severity }
        });
      }
    });

    // Sort by timestamp
    activityItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setActivities(activityItems.slice(0, 30));
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();

    // Set up realtime subscription
    const channel = supabase
      .channel('activity-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scans' }, fetchActivities)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vulnerabilities' }, fetchActivities)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'scan_started': return <Play className="w-4 h-4 text-primary" />;
      case 'scan_completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scan_failed': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'vulnerability_found': return <Shield className="w-4 h-4 text-orange-500" />;
      case 'vulnerability_fixed': return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getActivityBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'scan_started': return <Badge variant="secondary">Scan</Badge>;
      case 'scan_completed': return <Badge className="bg-green-500/20 text-green-500">Completed</Badge>;
      case 'scan_failed': return <Badge variant="destructive">Failed</Badge>;
      case 'vulnerability_found': return <Badge variant="outline" className="text-orange-500 border-orange-500/30">Finding</Badge>;
      case 'vulnerability_fixed': return <Badge className="bg-green-500/20 text-green-500">Fixed</Badge>;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-500',
      high: 'bg-orange-500/20 text-orange-500',
      medium: 'bg-yellow-500/20 text-yellow-500',
      low: 'bg-green-500/20 text-green-500',
      info: 'bg-blue-500/20 text-blue-500',
    };
    return <Badge className={colors[severity] || ''}>{severity}</Badge>;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  };

  const todayActivities = activities.filter(a => {
    const actDate = new Date(a.timestamp);
    const today = new Date();
    return actDate.toDateString() === today.toDateString();
  });

  const stats = {
    total: activities.length,
    scansToday: todayActivities.filter(a => a.type.startsWith('scan')).length,
    vulnsFound: activities.filter(a => a.type === 'vulnerability_found').length,
    vulnsFixed: activities.filter(a => a.type === 'vulnerability_fixed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Activity</h1>
            <p className="text-muted-foreground mt-1">Track all security scanning activity</p>
          </div>
          <Button variant="outline" onClick={fetchActivities}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Activity className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scans Today</p>
                  <p className="text-2xl font-bold">{stats.scansToday}</p>
                </div>
                <Globe className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vulns Found</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.vulnsFound}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vulns Fixed</p>
                  <p className="text-2xl font-bold text-green-500">{stats.vulnsFixed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-10">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activity yet.</p>
                <p className="text-sm text-muted-foreground">Start a scan to see activity here.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="relative flex gap-4 animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex items-center gap-2 mb-1">
                          {getActivityBadge(activity.type)}
                          {activity.metadata?.severity && getSeverityBadge(activity.metadata.severity)}
                          <span className="text-xs text-muted-foreground ml-auto">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        {activity.metadata?.target && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-xs">{activity.metadata.target}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ActivityPage;
