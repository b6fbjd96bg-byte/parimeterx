import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Scan {
  id: string;
  target_url: string;
  status: string;
  progress: number;
  created_at: string;
  scan_type: string;
}

const RecentScans = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchScans = async () => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setScans(data);
      }
      setLoading(false);
    };

    fetchScans();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      running: 'secondary',
      failed: 'destructive',
      pending: 'outline',
    };
    return variants[status] || 'outline';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Demo data for visual effect
  const demoScans: Scan[] = [
    { id: '1', target_url: 'https://example.com', status: 'completed', progress: 100, created_at: new Date().toISOString(), scan_type: 'full' },
    { id: '2', target_url: 'https://api.myapp.io', status: 'running', progress: 67, created_at: new Date(Date.now() - 3600000).toISOString(), scan_type: 'quick' },
    { id: '3', target_url: 'https://staging.test.com', status: 'pending', progress: 0, created_at: new Date(Date.now() - 7200000).toISOString(), scan_type: 'full' },
  ];

  const displayScans = scans.length > 0 ? scans : demoScans;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Scans</span>
          <Badge variant="outline" className="animate-pulse">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {displayScans.map((scan, index) => (
              <div
                key={scan.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{scan.target_url}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(scan.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(scan.status)}
                  <Badge variant={getStatusBadge(scan.status)}>
                    {scan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentScans;
