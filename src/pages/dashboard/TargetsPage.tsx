import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Target, Globe, Plus, Trash2, Edit2, Search, 
  RefreshCw, Loader2, CheckCircle, AlertTriangle, Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import NewScanModal from '@/components/dashboard/NewScanModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface TargetData {
  url: string;
  scansCount: number;
  lastScan: string | null;
  lastStatus: string;
  vulnerabilitiesCount: number;
}

const TargetsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTargets = async () => {
    if (!user) return;
    setLoading(true);

    const { data: scans } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!scans) {
      setTargets([]);
      setLoading(false);
      return;
    }

    // Group scans by target URL
    const targetMap = new Map<string, { scans: typeof scans; vulnCount: number }>();
    
    for (const scan of scans) {
      const existing = targetMap.get(scan.target_url);
      if (existing) {
        existing.scans.push(scan);
      } else {
        targetMap.set(scan.target_url, { scans: [scan], vulnCount: 0 });
      }
    }

    // Get vulnerability counts
    const scanIds = scans.map(s => s.id);
    const { data: vulns } = await supabase
      .from('vulnerabilities')
      .select('scan_id')
      .in('scan_id', scanIds);

    if (vulns) {
      const vulnCountByScan = new Map<string, number>();
      vulns.forEach(v => {
        vulnCountByScan.set(v.scan_id, (vulnCountByScan.get(v.scan_id) || 0) + 1);
      });

      targetMap.forEach((data, url) => {
        data.vulnCount = data.scans.reduce((sum, scan) => 
          sum + (vulnCountByScan.get(scan.id) || 0), 0
        );
      });
    }

    const targetsData: TargetData[] = [];
    targetMap.forEach((data, url) => {
      const latestScan = data.scans[0];
      targetsData.push({
        url,
        scansCount: data.scans.length,
        lastScan: latestScan?.created_at || null,
        lastStatus: latestScan?.status || 'unknown',
        vulnerabilitiesCount: data.vulnCount,
      });
    });

    setTargets(targetsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchTargets();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const filteredTargets = targets.filter(t => 
    t.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Targets</h1>
            <p className="text-muted-foreground mt-1">Manage your security scan targets</p>
          </div>
          <NewScanModal onScanCreated={fetchTargets} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Targets</p>
                  <p className="text-2xl font-bold">{targets.length}</p>
                </div>
                <Target className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold">
                    {targets.reduce((sum, t) => sum + t.scansCount, 0)}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Scans</p>
                  <p className="text-2xl font-bold text-primary">
                    {targets.filter(t => t.lastStatus === 'running').length}
                  </p>
                </div>
                <Loader2 className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Vulns</p>
                  <p className="text-2xl font-bold text-destructive">
                    {targets.reduce((sum, t) => sum + t.vulnerabilitiesCount, 0)}
                  </p>
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
                  placeholder="Search targets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchTargets}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Targets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              All Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredTargets.length === 0 ? (
              <div className="text-center py-10">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No targets found.</p>
                <p className="text-sm text-muted-foreground">Add a new scan to create a target.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target URL</TableHead>
                    <TableHead>Total Scans</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target, index) => (
                    <TableRow 
                      key={target.url} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="truncate max-w-md">{target.url}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{target.scansCount} scans</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(target.lastScan)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(target.lastStatus)}
                          <span className="capitalize text-sm">{target.lastStatus}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {target.vulnerabilitiesCount > 0 ? (
                          <Badge variant="destructive">{target.vulnerabilitiesCount}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-500 border-green-500/30">
                            Clean
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TargetsPage;
