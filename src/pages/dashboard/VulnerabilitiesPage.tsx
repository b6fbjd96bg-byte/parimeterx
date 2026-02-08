import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, AlertTriangle, Bug, ChevronDown, ChevronUp, ExternalLink, 
  Search, Filter, RefreshCw, Loader2, CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string | null;
  location: string | null;
  cve_id?: string | null;
  cvss_score?: number | null;
  recommendation?: string | null;
  status: string;
  scan_id: string;
  created_at: string;
}

const VulnerabilitiesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchVulnerabilities = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data: scans } = await supabase
      .from('scans')
      .select('id')
      .eq('user_id', user.id);
    
    if (!scans || scans.length === 0) {
      setVulnerabilities([]);
      setLoading(false);
      return;
    }
    
    const scanIds = scans.map(s => s.id);
    
    let query = supabase
      .from('vulnerabilities')
      .select('*')
      .in('scan_id', scanIds)
      .order('created_at', { ascending: false });

    if (severityFilter !== 'all') {
      query = query.eq('severity', severityFilter);
    }
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    
    if (!error) {
      setVulnerabilities(data as Vulnerability[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVulnerabilities();
  }, [user, severityFilter, statusFilter]);

  const handleMarkAsFixed = async (vulnId: string) => {
    const { error } = await supabase
      .from('vulnerabilities')
      .update({ status: 'fixed' })
      .eq('id', vulnId);
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: 'Marked as fixed' });
      fetchVulnerabilities();
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-500 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-500 border-green-500/30',
      info: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    };
    return colors[severity] || colors.info;
  };

  const filteredVulns = vulnerabilities.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: vulnerabilities.length,
    critical: vulnerabilities.filter(v => v.severity === 'critical').length,
    high: vulnerabilities.filter(v => v.severity === 'high').length,
    medium: vulnerabilities.filter(v => v.severity === 'medium').length,
    low: vulnerabilities.filter(v => v.severity === 'low').length,
    fixed: vulnerabilities.filter(v => v.status === 'fixed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vulnerabilities</h1>
            <p className="text-muted-foreground mt-1">Track and manage all detected security issues</p>
          </div>
          <Button variant="outline" onClick={fetchVulnerabilities}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-red-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-red-500">Critical</p>
              <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-orange-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-orange-500">High</p>
              <p className="text-2xl font-bold text-orange-500">{stats.high}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-yellow-500">Medium</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.medium}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-green-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-green-500">Low</p>
              <p className="text-2xl font-bold text-green-500">{stats.low}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-primary">Fixed</p>
              <p className="text-2xl font-bold text-primary">{stats.fixed}</p>
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
                  placeholder="Search vulnerabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerabilities List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              All Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredVulns.length === 0 ? (
              <div className="text-center py-10">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No vulnerabilities found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVulns.map((vuln, index) => (
                  <div
                    key={vuln.id}
                    className={`border rounded-lg overflow-hidden animate-fade-in ${
                      vuln.status === 'fixed' ? 'opacity-60 border-green-500/30' : 'border-border'
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === vuln.id ? null : vuln.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={`${getSeverityColor(vuln.severity)} border`}>
                          {vuln.severity === 'critical' || vuln.severity === 'high' ? (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          ) : (
                            <Bug className="w-3 h-3 mr-1" />
                          )}
                          <span className="uppercase">{vuln.severity}</span>
                        </Badge>
                        <div className="text-left">
                          <p className="font-medium">{vuln.title}</p>
                          <p className="text-xs text-muted-foreground">{vuln.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {vuln.status === 'fixed' && (
                          <Badge variant="outline" className="text-green-500 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Fixed
                          </Badge>
                        )}
                        {vuln.cvss_score && (
                          <span className="text-sm font-mono text-muted-foreground">
                            CVSS: {vuln.cvss_score}
                          </span>
                        )}
                        {expandedId === vuln.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {expandedId === vuln.id && (
                      <div className="px-4 pb-4 border-t border-border bg-muted/30 animate-fade-in">
                        <div className="pt-4 space-y-3">
                          {vuln.description && (
                            <div>
                              <p className="text-sm font-medium mb-1">Description</p>
                              <p className="text-sm text-muted-foreground">{vuln.description}</p>
                            </div>
                          )}
                          {vuln.recommendation && (
                            <div>
                              <p className="text-sm font-medium mb-1">Recommendation</p>
                              <p className="text-sm text-muted-foreground">{vuln.recommendation}</p>
                            </div>
                          )}
                          {vuln.cve_id && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{vuln.cve_id}</Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2"
                                onClick={() => window.open(`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${vuln.cve_id}`, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View CVE
                              </Button>
                            </div>
                          )}
                          {vuln.status !== 'fixed' && (
                            <Button size="sm" variant="outline" onClick={() => handleMarkAsFixed(vuln.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Fixed
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VulnerabilitiesPage;
