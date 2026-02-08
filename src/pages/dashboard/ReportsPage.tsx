import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, Download, Eye, Calendar, Globe, Shield, 
  RefreshCw, Loader2, AlertTriangle, CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import ScanReportPDF from '@/components/dashboard/ScanReportPDF';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface Report {
  scan: Scan;
  vulnerabilities: Vulnerability[];
  stats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    total: number;
  };
}

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = async () => {
    if (!user) return;
    setLoading(true);

    const { data: scans } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (!scans) {
      setReports([]);
      setLoading(false);
      return;
    }

    const reportsData: Report[] = [];

    for (const scan of scans) {
      const { data: vulns } = await supabase
        .from('vulnerabilities')
        .select('*')
        .eq('scan_id', scan.id);

      const vulnerabilities = vulns as Vulnerability[] || [];
      
      reportsData.push({
        scan,
        vulnerabilities,
        stats: {
          critical: vulnerabilities.filter(v => v.severity === 'critical').length,
          high: vulnerabilities.filter(v => v.severity === 'high').length,
          medium: vulnerabilities.filter(v => v.severity === 'medium').length,
          low: vulnerabilities.filter(v => v.severity === 'low').length,
          info: vulnerabilities.filter(v => v.severity === 'info').length,
          total: vulnerabilities.length,
        }
      });
    }

    setReports(reportsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getRiskLevel = (stats: Report['stats']) => {
    if (stats.critical > 0) return { label: 'Critical', color: 'text-red-500 bg-red-500/20' };
    if (stats.high > 0) return { label: 'High', color: 'text-orange-500 bg-orange-500/20' };
    if (stats.medium > 0) return { label: 'Medium', color: 'text-yellow-500 bg-yellow-500/20' };
    if (stats.low > 0) return { label: 'Low', color: 'text-green-500 bg-green-500/20' };
    return { label: 'Clean', color: 'text-primary bg-primary/20' };
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">View and download security scan reports</p>
          </div>
          <Button variant="outline" onClick={fetchReports}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-500">
                    {reports.reduce((sum, r) => sum + r.stats.critical, 0)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Findings</p>
                  <p className="text-2xl font-bold">
                    {reports.reduce((sum, r) => sum + r.stats.total, 0)}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clean Scans</p>
                  <p className="text-2xl font-bold text-green-500">
                    {reports.filter(r => r.stats.total === 0).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed scans yet.</p>
                <p className="text-sm text-muted-foreground">Complete a scan to generate a report.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report, index) => {
                  const risk = getRiskLevel(report.stats);
                  return (
                    <div
                      key={report.scan.id}
                      className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300 animate-fade-in cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <Badge className={risk.color}>{risk.label} Risk</Badge>
                        </div>
                        <ScanReportPDF scan={report.scan} vulnerabilities={report.vulnerabilities} />
                      </div>
                      
                      <div className="mb-3">
                        <p className="font-medium truncate text-sm">{report.scan.target_url}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.scan.completed_at || report.scan.created_at)}
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-1 text-center">
                        <div className="p-1 rounded bg-red-500/10">
                          <p className="text-xs text-red-500 font-bold">{report.stats.critical}</p>
                          <p className="text-[10px] text-muted-foreground">Crit</p>
                        </div>
                        <div className="p-1 rounded bg-orange-500/10">
                          <p className="text-xs text-orange-500 font-bold">{report.stats.high}</p>
                          <p className="text-[10px] text-muted-foreground">High</p>
                        </div>
                        <div className="p-1 rounded bg-yellow-500/10">
                          <p className="text-xs text-yellow-500 font-bold">{report.stats.medium}</p>
                          <p className="text-[10px] text-muted-foreground">Med</p>
                        </div>
                        <div className="p-1 rounded bg-green-500/10">
                          <p className="text-xs text-green-500 font-bold">{report.stats.low}</p>
                          <p className="text-[10px] text-muted-foreground">Low</p>
                        </div>
                        <div className="p-1 rounded bg-blue-500/10">
                          <p className="text-xs text-blue-500 font-bold">{report.stats.info}</p>
                          <p className="text-[10px] text-muted-foreground">Info</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Detail Dialog */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Report Details
              </DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Target URL</p>
                  <p className="text-sm text-muted-foreground break-all">{selectedReport.scan.target_url}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Scan Type</p>
                    <Badge variant="outline" className="capitalize">{selectedReport.scan.scan_type}</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedReport.scan.completed_at || selectedReport.scan.created_at)}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-3">Findings Summary</p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded bg-red-500/20">
                      <p className="text-lg font-bold text-red-500">{selectedReport.stats.critical}</p>
                      <p className="text-xs text-muted-foreground">Critical</p>
                    </div>
                    <div className="p-2 rounded bg-orange-500/20">
                      <p className="text-lg font-bold text-orange-500">{selectedReport.stats.high}</p>
                      <p className="text-xs text-muted-foreground">High</p>
                    </div>
                    <div className="p-2 rounded bg-yellow-500/20">
                      <p className="text-lg font-bold text-yellow-500">{selectedReport.stats.medium}</p>
                      <p className="text-xs text-muted-foreground">Medium</p>
                    </div>
                    <div className="p-2 rounded bg-green-500/20">
                      <p className="text-lg font-bold text-green-500">{selectedReport.stats.low}</p>
                      <p className="text-xs text-muted-foreground">Low</p>
                    </div>
                    <div className="p-2 rounded bg-blue-500/20">
                      <p className="text-lg font-bold text-blue-500">{selectedReport.stats.info}</p>
                      <p className="text-xs text-muted-foreground">Info</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <ScanReportPDF scan={selectedReport.scan} vulnerabilities={selectedReport.vulnerabilities} />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ReportsPage;
