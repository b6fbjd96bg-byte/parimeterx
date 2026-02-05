import { useState, useEffect } from 'react';
import { 
  Shield, 
  Bug, 
  FolderOpen, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import PlatformLayout from '@/components/platform/PlatformLayout';
import RoleGuard from '@/components/platform/RoleGuard';
import { usePrograms } from '@/hooks/usePrograms';
import { useVulnerabilityReports } from '@/hooks/useVulnerabilityReports';
import { useUserRole } from '@/hooks/useUserRole';
import { useUsers } from '@/hooks/useUsers';
import { SEVERITY_COLORS, STATUS_COLORS } from '@/types/platform';
import { cn } from '@/lib/utils';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'primary' 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  trend?: number;
  color?: 'primary' | 'destructive' | 'success' | 'warning';
}) => {
  const colorClasses = {
    primary: 'bg-primary/20 text-primary',
    destructive: 'bg-destructive/20 text-destructive',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn('p-3 rounded-lg', colorClasses[color])}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center text-xs font-medium', trend > 0 ? 'text-green-400' : 'text-red-400')}>
              <TrendingUp className={cn('w-3 h-3 mr-1', trend < 0 && 'rotate-180')} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const PlatformDashboard = () => {
  const { role, isAdmin, isPentester, isClient } = useUserRole();
  const { programs, loading: programsLoading } = usePrograms();
  const { reports, loading: reportsLoading } = useVulnerabilityReports();
  const { users, loading: usersLoading } = useUsers();

  // Calculate statistics
  const activePrograms = programs.filter(p => p.status === 'active').length;
  const criticalVulns = reports.filter(r => r.severity === 'critical' && r.status !== 'resolved').length;
  const highVulns = reports.filter(r => r.severity === 'high' && r.status !== 'resolved').length;
  const resolvedVulns = reports.filter(r => r.status === 'resolved').length;
  const pendingVulns = reports.filter(r => !['resolved', 'rejected', 'duplicate'].includes(r.status)).length;

  const severityDistribution = {
    critical: reports.filter(r => r.severity === 'critical').length,
    high: reports.filter(r => r.severity === 'high').length,
    medium: reports.filter(r => r.severity === 'medium').length,
    low: reports.filter(r => r.severity === 'low').length,
    informational: reports.filter(r => r.severity === 'informational').length,
  };

  const statusDistribution = {
    new: reports.filter(r => r.status === 'new').length,
    triaged: reports.filter(r => r.status === 'triaged').length,
    accepted: reports.filter(r => r.status === 'accepted').length,
    in_progress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  };

  const totalVulns = reports.length || 1; // Avoid division by zero

  return (
    <RoleGuard>
      <PlatformLayout
        title={`Welcome back${isAdmin ? ', Admin' : isPentester ? ', Pentester' : isClient ? '' : ''}`}
        subtitle={
          isAdmin 
            ? 'Overview of your security programs and vulnerability management'
            : isPentester
            ? 'Your assigned programs and pending submissions'
            : 'Your security program status and findings'
        }
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Programs"
            value={activePrograms}
            icon={<FolderOpen className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Total Vulnerabilities"
            value={reports.length}
            icon={<Bug className="w-5 h-5" />}
            color="warning"
          />
          <StatCard
            title="Critical/High Open"
            value={criticalVulns + highVulns}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="destructive"
          />
          <StatCard
            title="Resolved"
            value={resolvedVulns}
            icon={<CheckCircle className="w-5 h-5" />}
            color="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Severity Distribution */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Severity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(severityDistribution).map(([severity, count]) => (
                <div key={severity} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium border capitalize',
                      SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS]
                    )}>
                      {severity}
                    </span>
                    <span className="text-muted-foreground">{count} ({Math.round((count / totalVulns) * 100)}%)</span>
                  </div>
                  <Progress value={(count / totalVulns) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status Overview */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium border capitalize',
                    STATUS_COLORS[status as keyof typeof STATUS_COLORS]
                  )}>
                    {status.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Programs */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Recent Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {programs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {isAdmin 
                  ? 'No programs created yet. Create your first security program to get started.'
                  : 'No programs assigned to you yet.'}
              </p>
            ) : (
              <div className="space-y-4">
                {programs.slice(0, 5).map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all"
                  >
                    <div>
                      <h4 className="font-medium">{program.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {program.description?.slice(0, 100) || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-medium capitalize',
                        program.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        program.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
                        program.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}>
                        {program.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PlatformLayout>
    </RoleGuard>
  );
};

export default PlatformDashboard;
