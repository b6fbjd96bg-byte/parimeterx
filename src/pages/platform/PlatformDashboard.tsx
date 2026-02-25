import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Bug, FolderOpen, Users, AlertTriangle, CheckCircle, Clock,
  TrendingUp, Activity, Plus, ExternalLink, Target, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlatformLayout from '@/components/platform/PlatformLayout';
import RoleGuard from '@/components/platform/RoleGuard';
import QuickSubmitModal from '@/components/platform/QuickSubmitModal';
import { usePrograms } from '@/hooks/usePrograms';
import { useVulnerabilityReports } from '@/hooks/useVulnerabilityReports';
import { useUserRole } from '@/hooks/useUserRole';
import { useUsers } from '@/hooks/useUsers';
import { SEVERITY_COLORS, STATUS_COLORS } from '@/types/platform';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, icon, color = 'primary' }: { 
  title: string; value: number | string; icon: React.ReactNode; color?: 'primary' | 'destructive' | 'success' | 'warning';
}) => {
  const colorClasses = {
    primary: 'bg-primary/20 text-primary',
    destructive: 'bg-destructive/20 text-destructive',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-lg', colorClasses[color])}>{icon}</div>
          <div>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PlatformDashboard = () => {
  const { role, isAdmin, isPentester, isClient } = useUserRole();
  const { programs, loading: programsLoading } = usePrograms();
  const { reports, loading: reportsLoading } = useVulnerabilityReports();
  const { users } = useUsers();

  const [quickSubmitOpen, setQuickSubmitOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<{ id: string; name: string } | null>(null);

  const activePrograms = programs.filter(p => p.status === 'active');
  const criticalVulns = reports.filter(r => r.severity === 'critical' && r.status !== 'resolved').length;
  const highVulns = reports.filter(r => r.severity === 'high' && r.status !== 'resolved').length;
  const resolvedVulns = reports.filter(r => r.status === 'resolved').length;

  const openQuickSubmit = (programId: string, programName: string) => {
    setSelectedProgram({ id: programId, name: programName });
    setQuickSubmitOpen(true);
  };

  // Get reports for a specific program
  const getProgramReports = (programId: string) => reports.filter(r => r.program_id === programId);

  const getProgramStats = (programId: string) => {
    const pr = getProgramReports(programId);
    return {
      total: pr.length,
      critical: pr.filter(r => r.severity === 'critical').length,
      high: pr.filter(r => r.severity === 'high').length,
      pending: pr.filter(r => !['resolved', 'rejected', 'duplicate'].includes(r.status)).length,
      resolved: pr.filter(r => r.status === 'resolved').length,
    };
  };

  return (
    <RoleGuard>
      <PlatformLayout
        title={`Welcome back${isAdmin ? ', Admin' : isPentester ? ', Pentester' : ''}`}
        subtitle="Your security workspace"
      >
        {/* Global Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Active Programs" value={activePrograms.length} icon={<FolderOpen className="w-5 h-5" />} color="primary" />
          <StatCard title="Total Findings" value={reports.length} icon={<Bug className="w-5 h-5" />} color="warning" />
          <StatCard title="Critical/High Open" value={criticalVulns + highVulns} icon={<AlertTriangle className="w-5 h-5" />} color="destructive" />
          <StatCard title="Resolved" value={resolvedVulns} icon={<CheckCircle className="w-5 h-5" />} color="success" />
        </div>

        {/* Tabbed Program Workspace */}
        {activePrograms.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Programs</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-4">
                {isAdmin ? 'Create your first security program to get started.' : 'No programs assigned yet.'}
              </p>
              {isAdmin && (
                <Button variant="cyber" asChild>
                  <Link to="/platform/programs"><Plus className="w-4 h-4 mr-2" />Go to Programs</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={activePrograms[0]?.id} className="space-y-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <TabsList className="bg-card/80 border border-border/50 h-auto p-1 flex-wrap">
                {activePrograms.map((program) => {
                  const stats = getProgramStats(program.id);
                  return (
                    <TabsTrigger key={program.id} value={program.id} className="text-sm gap-2 data-[state=active]:bg-primary/20">
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{program.name}</span>
                      {stats.critical > 0 && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">{stats.critical}</Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {activePrograms.map((program) => {
              const stats = getProgramStats(program.id);
              const programReports = getProgramReports(program.id);
              const recentReports = programReports.slice(0, 8);

              return (
                <TabsContent key={program.id} value={program.id} className="space-y-4 mt-0">
                  {/* Program Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{program.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{program.description || 'No description'}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {(isPentester || isAdmin) && (
                        <Button variant="cyber" size="sm" onClick={() => openQuickSubmit(program.id, program.name)}>
                          <Zap className="w-4 h-4 mr-1" />Quick Submit
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={isAdmin ? `/platform/programs/${program.id}` : isPentester ? `/platform/programs/${program.id}/pentest` : `/platform/programs/${program.id}/client`}>
                          <ExternalLink className="w-4 h-4 mr-1" />Details
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Program Mini Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="rounded-lg border border-border/50 bg-card/60 p-3 text-center">
                      <p className="text-lg font-bold">{stats.total}</p>
                      <p className="text-[11px] text-muted-foreground">Total</p>
                    </div>
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-center">
                      <p className="text-lg font-bold text-destructive">{stats.critical}</p>
                      <p className="text-[11px] text-muted-foreground">Critical</p>
                    </div>
                    <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 text-center">
                      <p className="text-lg font-bold text-orange-400">{stats.high}</p>
                      <p className="text-[11px] text-muted-foreground">High</p>
                    </div>
                    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-center">
                      <p className="text-lg font-bold text-yellow-400">{stats.pending}</p>
                      <p className="text-[11px] text-muted-foreground">Pending</p>
                    </div>
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-center">
                      <p className="text-lg font-bold text-green-400">{stats.resolved}</p>
                      <p className="text-[11px] text-muted-foreground">Resolved</p>
                    </div>
                  </div>

                  {/* Recent Findings for this program */}
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Bug className="w-4 h-4 text-primary" />
                          Recent Findings
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs" asChild>
                          <Link to={`/platform/vulnerabilities`}>View All</Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {recentReports.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          <Bug className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          No findings yet for this program
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {recentReports.map((report) => (
                            <Link
                              key={report.id}
                              to={`/platform/vulnerabilities/${report.id}`}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/30 transition-all group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Badge className={cn('text-[10px] border capitalize shrink-0', SEVERITY_COLORS[report.severity as keyof typeof SEVERITY_COLORS])}>
                                  {report.severity}
                                </Badge>
                                <span className="text-sm truncate group-hover:text-primary transition-colors">{report.title}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                <Badge className={cn('text-[10px] border capitalize', STATUS_COLORS[report.status as keyof typeof STATUS_COLORS])}>
                                  {report.status.replace('_', ' ')}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground hidden sm:block">
                                  {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        )}

        {/* All Programs (non-active) Summary */}
        {programs.filter(p => p.status !== 'active').length > 0 && (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <FolderOpen className="w-4 h-4" />
                Other Programs ({programs.filter(p => p.status !== 'active').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {programs.filter(p => p.status !== 'active').slice(0, 6).map((program) => (
                  <Link
                    key={program.id}
                    to={isAdmin ? `/platform/programs/${program.id}` : `/platform/programs`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/30 transition-all"
                  >
                    <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{program.name}</p>
                      <Badge variant="outline" className="text-[10px] capitalize mt-1">{program.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Submit Modal */}
        {selectedProgram && (
          <QuickSubmitModal
            open={quickSubmitOpen}
            onOpenChange={setQuickSubmitOpen}
            programId={selectedProgram.id}
            programName={selectedProgram.name}
          />
        )}
      </PlatformLayout>
    </RoleGuard>
  );
};

export default PlatformDashboard;
