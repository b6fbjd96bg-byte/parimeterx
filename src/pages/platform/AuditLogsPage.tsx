import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Search,
  Calendar,
  User,
  Filter
} from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import type { AuditLog } from '@/types/platform';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-500/20 text-green-400 border-green-500/30',
  update: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  delete: 'bg-red-500/20 text-red-400 border-red-500/30',
  login: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  logout: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const AuditLogsPage = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data as AuditLog[] || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      toast({ 
        title: 'Error', 
        description: 'Failed to load audit logs', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    const matchesEntity = entityFilter === 'all' || log.entity_type === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const uniqueActions = [...new Set(logs.map(l => l.action.split('_')[0]))];
  const uniqueEntities = [...new Set(logs.map(l => l.entity_type))];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <PlatformLayout
        title="Audit Logs"
        subtitle="Track all system activities and changes"
      >
        {/* Filters */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action} className="capitalize">{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {uniqueEntities.map((entity) => (
                    <SelectItem key={entity} value={entity} className="capitalize">{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Activity Log ({filteredLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Logs Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || actionFilter !== 'all' || entityFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No activity has been logged yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const actionType = log.action.split('_')[0];
                      
                      return (
                        <TableRow key={log.id} className="hover:bg-muted/30">
                          <TableCell>
                            <Badge className={ACTION_COLORS[actionType] || 'bg-gray-500/20 text-gray-400'}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">
                            {log.entity_type}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {log.entity_id || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[100px]">
                                {log.user_id?.slice(0, 8) || 'System'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

export default AuditLogsPage;
