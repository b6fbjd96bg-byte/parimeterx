import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Clock, AlertTriangle, CheckCircle, Loader2, RefreshCw, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ScanReportPDF from './ScanReportPDF';

interface Scan {
  id: string;
  target_url: string;
  status: string;
  progress: number;
  created_at: string;
  scan_type: string;
  completed_at?: string;
}

interface Vulnerability {
  id: string;
  severity: string;
  title: string;
  description: string | null;
  location: string | null;
  cve_id?: string | null;
  cvss_score?: number | null;
  recommendation?: string | null;
  status: string;
}

interface RecentScansProps {
  refreshKey?: number;
}

const RecentScans = ({ refreshKey }: RecentScansProps) => {
  const { user } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [scanVulnerabilities, setScanVulnerabilities] = useState<Vulnerability[]>([]);
  const [loadingVulns, setLoadingVulns] = useState(false);

  const fetchScans = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setScans(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScans();
    
    // Set up realtime subscription for scan updates
    const channel = supabase
      .channel('scans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scans',
        },
        () => {
          fetchScans();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshKey]);

  const viewScanDetails = async (scan: Scan) => {
    setSelectedScan(scan);
    setLoadingVulns(true);
    
    const { data } = await supabase
      .from('vulnerabilities')
      .select('id, severity, title')
      .eq('scan_id', scan.id)
      .order('created_at', { ascending: false });
    
    setScanVulnerabilities(data || []);
    setLoadingVulns(false);
  };

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

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-green-500',
      info: 'text-blue-500',
    };
    return colors[severity] || 'text-muted-foreground';
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

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Scans</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={fetchScans}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              {scans.some(s => s.status === 'running') && (
                <Badge variant="outline" className="animate-pulse">Live</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : scans.length === 0 ? (
            <div className="text-center py-10">
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scans yet.</p>
              <p className="text-sm text-muted-foreground">Click "New Scan" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan, index) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => viewScanDetails(scan)}
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{scan.target_url}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(scan.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {scan.status === 'running' && (
                      <span className="text-xs text-muted-foreground">{scan.progress}%</span>
                    )}
                    {getStatusIcon(scan.status)}
                    <Badge variant={getStatusBadge(scan.status)}>
                      {scan.status}
                    </Badge>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedScan} onOpenChange={() => setSelectedScan(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Scan Details
            </DialogTitle>
          </DialogHeader>
          {selectedScan && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Target URL</p>
                <p className="text-sm text-muted-foreground break-all">{selectedScan.target_url}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Status</p>
                  <Badge variant={getStatusBadge(selectedScan.status)}>
                    {selectedScan.status}
                  </Badge>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Scan Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{selectedScan.scan_type}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Vulnerabilities Found</p>
                {loadingVulns ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : scanVulnerabilities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No vulnerabilities detected</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {scanVulnerabilities.map((vuln) => (
                      <div key={vuln.id} className="flex items-center gap-2 text-sm">
                        <span className={`font-medium uppercase ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity}
                        </span>
                        <span className="text-muted-foreground">{vuln.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Started: {formatDate(selectedScan.created_at)}</p>
                {selectedScan.completed_at && (
                  <p>Completed: {formatDate(selectedScan.completed_at)}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecentScans;
