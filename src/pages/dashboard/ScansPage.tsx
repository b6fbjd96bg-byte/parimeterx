import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Globe, Clock, AlertTriangle, CheckCircle, Loader2, RefreshCw, 
  Search, Filter, Trash2, Play, Pause, Eye, Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import NewScanModal from '@/components/dashboard/NewScanModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ScanReportPDF from '@/components/dashboard/ScanReportPDF';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Scan {
  id: string;
  target_url: string;
  status: string;
  progress: number;
  created_at: string;
  scan_type: string;
  completed_at?: string;
  started_at?: string;
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

const ScansPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [scanVulnerabilities, setScanVulnerabilities] = useState<Vulnerability[]>([]);
  const [loadingVulns, setLoadingVulns] = useState(false);

  const fetchScans = async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setScans(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScans();
    
    const channel = supabase
      .channel('scans-page-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scans' },
        () => fetchScans()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, statusFilter]);

  const viewScanDetails = async (scan: Scan) => {
    setSelectedScan(scan);
    setLoadingVulns(true);
    
    const { data } = await supabase
      .from('vulnerabilities')
      .select('*')
      .eq('scan_id', scan.id)
      .order('created_at', { ascending: false });
    
    setScanVulnerabilities(data as Vulnerability[] || []);
    setLoadingVulns(false);
  };

  const deleteScan = async (scanId: string) => {
    const { error } = await supabase.from('scans').delete().eq('id', scanId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete scan', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Scan has been deleted' });
      fetchScans();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const filteredScans = scans.filter(scan => 
    scan.target_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: scans.length,
    running: scans.filter(s => s.status === 'running').length,
    completed: scans.filter(s => s.status === 'completed').length,
    failed: scans.filter(s => s.status === 'failed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Scans</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all your security scans</p>
          </div>
          <NewScanModal onScanCreated={fetchScans} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Globe className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Running</p>
                  <p className="text-2xl font-bold text-primary">{stats.running}</p>
                </div>
                <Loader2 className={`w-8 h-8 text-primary opacity-50 ${stats.running > 0 ? 'animate-spin' : ''}`} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by target URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchScans}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scans Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Scans</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredScans.length === 0 ? (
              <div className="text-center py-10">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No scans found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target URL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScans.map((scan) => (
                    <TableRow key={scan.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="truncate max-w-xs">{scan.target_url}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{scan.scan_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(scan.status)}
                          <Badge variant={getStatusBadge(scan.status)}>{scan.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${scan.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{scan.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(scan.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => viewScanDetails(scan)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Scan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this scan? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteScan(scan.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Scan Details Dialog */}
        <Dialog open={!!selectedScan} onOpenChange={() => setSelectedScan(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Scan Details
                </span>
                {selectedScan && selectedScan.status === 'completed' && (
                  <ScanReportPDF scan={selectedScan} vulnerabilities={scanVulnerabilities} />
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedScan && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Target URL</p>
                  <p className="text-sm text-muted-foreground break-all">{selectedScan.target_url}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Status</p>
                    <Badge variant={getStatusBadge(selectedScan.status)}>{selectedScan.status}</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Scan Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedScan.scan_type}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Progress</p>
                    <p className="text-sm text-muted-foreground">{selectedScan.progress}%</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-2">Vulnerabilities Found ({scanVulnerabilities.length})</p>
                  {loadingVulns ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : scanVulnerabilities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No vulnerabilities detected</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {scanVulnerabilities.map((vuln) => (
                        <div key={vuln.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                          <div className="flex items-center gap-2">
                            <Badge variant={vuln.severity === 'critical' ? 'destructive' : 'outline'} className="uppercase text-xs">
                              {vuln.severity}
                            </Badge>
                            <span className="text-sm">{vuln.title}</span>
                          </div>
                          {vuln.cvss_score && (
                            <span className="text-xs font-mono text-muted-foreground">CVSS: {vuln.cvss_score}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ScansPage;
