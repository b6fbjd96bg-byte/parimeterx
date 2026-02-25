import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  Globe,
  Server,
  Code,
  Smartphone,
  Target,
  Bug,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  TrendingDown,
  BarChart3,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import PlatformLayout from '@/components/platform/PlatformLayout';
import RoleGuard from '@/components/platform/RoleGuard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useVulnerabilityReports } from '@/hooks/useVulnerabilityReports';
import { SEVERITY_COLORS, STATUS_COLORS } from '@/types/platform';
import type { Program, ProgramAsset, SeveritySLA, VulnerabilityReport } from '@/types/platform';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const assetTypeIcons: Record<string, React.ReactNode> = {
  domain: <Globe className="w-4 h-4" />,
  subdomain: <Globe className="w-4 h-4" />,
  ip_address: <Server className="w-4 h-4" />,
  ip_range: <Server className="w-4 h-4" />,
  api: <Code className="w-4 h-4" />,
  mobile_app: <Smartphone className="w-4 h-4" />,
  other: <Target className="w-4 h-4" />,
};

const ClientProgramDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [assets, setAssets] = useState<ProgramAsset[]>([]);
  const [slas, setSlas] = useState<SeveritySLA[]>([]);
  const [loading, setLoading] = useState(true);

  const { reports } = useVulnerabilityReports({ programId: id });

  useEffect(() => {
    if (!id || !user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [programRes, assetsRes, slasRes] = await Promise.all([
          supabase.from('programs').select('*').eq('id', id).single(),
          supabase.from('program_assets').select('*').eq('program_id', id).order('is_in_scope', { ascending: false }),
          supabase.from('severity_slas').select('*').eq('program_id', id),
        ]);

        if (programRes.data) setProgram(programRes.data as unknown as Program);
        if (assetsRes.data) setAssets(assetsRes.data as unknown as ProgramAsset[]);
        if (slasRes.data) setSlas(slasRes.data as unknown as SeveritySLA[]);
      } catch (err) {
        console.error('Error fetching program details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  if (loading) {
    return (
      <RoleGuard allowedRoles={['client']}>
        <PlatformLayout title="Loading...">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/80 backdrop-blur-sm border-border/50 animate-pulse">
                <CardContent className="p-6"><div className="h-20 bg-muted rounded" /></CardContent>
              </Card>
            ))}
          </div>
        </PlatformLayout>
      </RoleGuard>
    );
  }

  if (!program) {
    return (
      <RoleGuard allowedRoles={['client']}>
        <PlatformLayout title="Program Not Found">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Shield className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Program not found</h3>
              <p className="text-muted-foreground mb-4">This program may not exist or you don't have access.</p>
              <Button variant="outline" asChild>
                <Link to="/platform/programs"><ArrowLeft className="w-4 h-4 mr-2" />Back to Programs</Link>
              </Button>
            </CardContent>
          </Card>
        </PlatformLayout>
      </RoleGuard>
    );
  }

  // Stats
  const totalFindings = reports.length;
  const criticalCount = reports.filter(r => r.severity === 'critical').length;
  const highCount = reports.filter(r => r.severity === 'high').length;
  const mediumCount = reports.filter(r => r.severity === 'medium').length;
  const lowCount = reports.filter(r => r.severity === 'low').length;
  const infoCount = reports.filter(r => r.severity === 'informational').length;

  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const inProgressCount = reports.filter(r => r.status === 'in_progress').length;
  const pendingCount = reports.filter(r => ['new', 'triaged', 'accepted'].includes(r.status)).length;
  const rejectedCount = reports.filter(r => ['rejected', 'duplicate'].includes(r.status)).length;

  const remediationRate = totalFindings > 0 ? Math.round((resolvedCount / totalFindings) * 100) : 0;
  const inScopeAssets = assets.filter(a => a.is_in_scope);
  const severityOrder = ['critical', 'high', 'medium', 'low', 'informational'];

  // Group reports by severity for the remediation tracker
  const severityGroups = severityOrder.map(sev => {
    const all = reports.filter(r => r.severity === sev);
    const resolved = all.filter(r => r.status === 'resolved');
    return { severity: sev, total: all.length, resolved: resolved.length };
  }).filter(g => g.total > 0);

  return (
    <RoleGuard allowedRoles={['client']}>
      <PlatformLayout
        title={program.name}
        subtitle={program.description || 'Security engagement overview'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/platform/programs"><ArrowLeft className="w-4 h-4 mr-2" />Back</Link>
          </Button>
        }
      >
        {/* Status Banner */}
        <Card className={cn(
          'mb-6 border',
          program.status === 'active' ? 'bg-green-500/5 border-green-500/30' :
          program.status === 'completed' ? 'bg-blue-500/5 border-blue-500/30' :
          program.status === 'paused' ? 'bg-yellow-500/5 border-yellow-500/30' :
          'bg-card/80 border-border/50'
        )}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={cn('text-xs border capitalize',
                program.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                program.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                program.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                'bg-gray-500/20 text-gray-400 border-gray-500/30'
              )}>
                {program.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {program.start_date && `Started ${new Date(program.start_date).toLocaleDateString()}`}
                {program.end_date && ` · Ends ${new Date(program.end_date).toLocaleDateString()}`}
              </span>
            </div>
            <div className="text-sm font-medium">
              {inScopeAssets.length} assets in scope
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{totalFindings}</p>
              <p className="text-xs text-muted-foreground">Total Findings</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-destructive/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{criticalCount + highCount}</p>
              <p className="text-xs text-muted-foreground">Critical + High</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{resolvedCount}</p>
              <p className="text-xs text-muted-foreground">Remediated</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{remediationRate}%</p>
              <p className="text-xs text-muted-foreground">Remediation Rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="remediation" className="space-y-6">
          <TabsList className="bg-card/80 border border-border/50">
            <TabsTrigger value="remediation">Remediation Tracker</TabsTrigger>
            <TabsTrigger value="findings">All Findings</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
            <TabsTrigger value="slas">SLAs</TabsTrigger>
          </TabsList>

          {/* Remediation Tracker */}
          <TabsContent value="remediation" className="space-y-6">
            {/* Overall Progress */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  Overall Remediation Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{resolvedCount} of {totalFindings} findings resolved</span>
                  <span className="font-medium text-primary">{remediationRate}%</span>
                </div>
                <Progress value={remediationRate} className="h-3" />

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-lg font-bold text-yellow-400">{pendingCount}</p>
                    <p className="text-xs text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{inProgressCount}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">{resolvedCount}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Per-Severity Breakdown */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Remediation by Severity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {severityGroups.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No findings yet.</p>
                ) : (
                  severityGroups.map(({ severity, total, resolved }) => {
                    const pct = Math.round((resolved / total) * 100);
                    return (
                      <div key={severity} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={cn('text-xs border capitalize', SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS])}>
                            {severity}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{resolved}/{total} resolved ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Unresolved Critical/High */}
            {reports.filter(r => ['critical', 'high'].includes(r.severity) && r.status !== 'resolved').length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Open Critical & High Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports
                      .filter(r => ['critical', 'high'].includes(r.severity) && r.status !== 'resolved')
                      .map((report) => (
                        <Link
                          key={report.id}
                          to={`/platform/vulnerabilities/${report.id}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20 hover:border-destructive/40 transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                              <Badge className={cn('text-xs border capitalize shrink-0', SEVERITY_COLORS[report.severity as keyof typeof SEVERITY_COLORS])}>
                                {report.severity}
                              </Badge>
                              <span className="text-sm font-medium truncate">{report.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <Badge className={cn('text-xs border capitalize', STATUS_COLORS[report.status as keyof typeof STATUS_COLORS])}>
                                {report.status.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Findings Tab */}
          <TabsContent value="findings" className="space-y-4">
            {reports.length === 0 ? (
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Bug className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No findings yet</h3>
                  <p className="text-muted-foreground">Vulnerability reports will appear here once testing begins.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <Link key={report.id} to={`/platform/vulnerabilities/${report.id}`} className="block">
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <Badge className={cn('text-xs border capitalize shrink-0', SEVERITY_COLORS[report.severity as keyof typeof SEVERITY_COLORS])}>
                              {report.severity}
                            </Badge>
                            <div className="min-w-0">
                              <span className="font-medium text-sm truncate block">{report.title}</span>
                              {report.affected_endpoint && (
                                <span className="text-xs text-muted-foreground truncate block">{report.affected_endpoint}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            <Badge className={cn('text-xs border capitalize', STATUS_COLORS[report.status as keyof typeof STATUS_COLORS])}>
                              {report.status.replace('_', ' ')}
                            </Badge>
                            {report.cvss_score && (
                              <span className="text-xs font-mono text-muted-foreground">
                                CVSS {report.cvss_score.toFixed(1)}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Scope Tab */}
          <TabsContent value="scope">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Assets Under Test ({inScopeAssets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inScopeAssets.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No assets defined yet.</p>
                ) : (
                  <div className="space-y-3">
                    {inScopeAssets.map((asset) => (
                      <div key={asset.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="p-2 rounded bg-primary/20 text-primary">
                          {assetTypeIcons[asset.asset_type] || <Target className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{asset.asset_value}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{asset.asset_type.replace('_', ' ')}</Badge>
                          </div>
                          {asset.notes && <p className="text-xs text-muted-foreground mt-1">{asset.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SLAs Tab */}
          <TabsContent value="slas">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Response & Resolution SLAs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slas.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No SLAs configured for this program.</p>
                ) : (
                  <div className="space-y-4">
                    {severityOrder.map((sev) => {
                      const sla = slas.find(s => s.severity === sev);
                      if (!sla) return null;
                      return (
                        <div key={sev} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                          <Badge className={cn('text-xs border capitalize', SEVERITY_COLORS[sev as keyof typeof SEVERITY_COLORS])}>
                            {sev}
                          </Badge>
                          <div className="flex items-center gap-8 text-sm">
                            <div>
                              <span className="text-muted-foreground">Response: </span>
                              <span className="font-medium">{sla.response_hours}h</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Resolution: </span>
                              <span className="font-medium">{sla.resolution_days}d</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PlatformLayout>
    </RoleGuard>
  );
};

export default ClientProgramDetailPage;
