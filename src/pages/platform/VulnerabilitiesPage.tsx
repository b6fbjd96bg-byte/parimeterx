import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bug, 
  Filter, 
  Search, 
  Plus,
  ExternalLink,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PlatformLayout from '@/components/platform/PlatformLayout';
import RoleGuard from '@/components/platform/RoleGuard';
import { useVulnerabilityReports } from '@/hooks/useVulnerabilityReports';
import { useUserRole } from '@/hooks/useUserRole';
import { SEVERITY_COLORS, STATUS_COLORS, VulnerabilitySeverity, VulnerabilityStatus } from '@/types/platform';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const VulnerabilitiesPage = () => {
  const { reports, loading, updateStatus } = useVulnerabilityReports();
  const { isAdmin, isPentester } = useUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.affected_endpoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.cwe_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const severities: VulnerabilitySeverity[] = ['critical', 'high', 'medium', 'low', 'informational'];
  const statuses: VulnerabilityStatus[] = ['new', 'triaged', 'accepted', 'in_progress', 'resolved', 'rejected', 'duplicate'];

  return (
    <RoleGuard>
      <PlatformLayout
        title="Vulnerability Reports"
        subtitle="View and manage security findings"
        actions={
          isPentester && (
            <Button variant="cyber" asChild>
              <Link to="/platform/vulnerabilities/new">
                <Plus className="w-4 h-4 mr-2" />
                Submit Finding
              </Link>
            </Button>
          )
        }
      >
        {/* Filters */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, endpoint, or CWE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severities.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bug className="w-5 h-5 text-primary" />
              Findings ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <Bug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Vulnerabilities Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || severityFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No vulnerability reports have been submitted yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>CWE/OWASP</TableHead>
                      <TableHead>CVSS</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="group hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <Link 
                            to={`/platform/vulnerabilities/${report.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {report.title}
                          </Link>
                          {report.affected_endpoint && (
                            <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                              {report.affected_endpoint}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('border', SEVERITY_COLORS[report.severity])}>
                            {report.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('border', STATUS_COLORS[report.status])}>
                            {report.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div>{report.cwe_id || '-'}</div>
                          <div className="text-xs">{report.owasp_category || ''}</div>
                        </TableCell>
                        <TableCell>
                          {report.cvss_score ? (
                            <span className={cn(
                              'font-mono font-medium',
                              report.cvss_score >= 9 ? 'text-red-400' :
                              report.cvss_score >= 7 ? 'text-orange-400' :
                              report.cvss_score >= 4 ? 'text-yellow-400' :
                              'text-blue-400'
                            )}>
                              {report.cvss_score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/platform/vulnerabilities/${report.id}`}>
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </PlatformLayout>
    </RoleGuard>
  );
};

export default VulnerabilitiesPage;
