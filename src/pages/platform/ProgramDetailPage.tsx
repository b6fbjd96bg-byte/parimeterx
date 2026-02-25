import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Globe, Server, Smartphone, Code, Shield,
  Users, Clock, Calendar, FileText, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import PlatformLayout from '@/components/platform/PlatformLayout';
import RoleGuard from '@/components/platform/RoleGuard';
import { usePrograms } from '@/hooks/usePrograms';
import { useUsers } from '@/hooks/useUsers';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { Program, ProgramAsset, SeveritySLA, AssetType, VulnerabilitySeverity } from '@/types/platform';

const ASSET_TYPE_ICONS: Record<string, typeof Globe> = {
  domain: Globe,
  subdomain: Globe,
  ip_address: Server,
  ip_range: Server,
  api: Code,
  mobile_app: Smartphone,
  other: Shield,
};

const AddAssetDialog = ({ programId, onAdded }: { programId: string; onAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addAsset } = usePrograms();
  const { toast } = useToast();
  const [form, setForm] = useState({ asset_type: '' as string, asset_value: '', notes: '', is_in_scope: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.asset_type || !form.asset_value) {
      toast({ title: 'Error', description: 'Asset type and value are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addAsset({ program_id: programId, asset_type: form.asset_type as AssetType, asset_value: form.asset_value, notes: form.notes || null, is_in_scope: form.is_in_scope });
      toast({ title: 'Success', description: 'Asset added successfully' });
      setOpen(false);
      setForm({ asset_type: '', asset_value: '', notes: '', is_in_scope: true });
      onAdded();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to add asset', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cyber" size="sm"><Plus className="w-4 h-4 mr-1" />Add Asset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Asset to Scope</DialogTitle>
          <DialogDescription>Define a new asset for this security program.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Asset Type *</Label>
            <Select value={form.asset_type} onValueChange={(v) => setForm({ ...form, asset_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {(['domain', 'subdomain', 'ip_address', 'ip_range', 'api', 'mobile_app', 'other'] as AssetType[]).map((t) => (
                  <SelectItem key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Asset Value *</Label>
            <Input value={form.asset_value} onChange={(e) => setForm({ ...form, asset_value: e.target.value })} placeholder="e.g., app.acmecorp.com" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." rows={2} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_in_scope} onCheckedChange={(v) => setForm({ ...form, is_in_scope: v })} />
            <Label>In Scope</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="cyber" disabled={loading}>{loading ? 'Adding...' : 'Add Asset'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AssignPentesterDialog = ({ programId, assignedIds, onAssigned }: { programId: string; assignedIds: string[]; onAssigned: () => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const { assignPentester } = usePrograms();
  const { users } = useUsers('pentester');
  const { toast } = useToast();

  const available = users.filter(u => !assignedIds.includes(u.user_id));

  const handleAssign = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      await assignPentester(programId, selectedId);
      toast({ title: 'Success', description: 'Pentester assigned successfully' });
      setOpen(false);
      setSelectedId('');
      onAssigned();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to assign pentester', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cyber" size="sm"><Plus className="w-4 h-4 mr-1" />Assign Pentester</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Pentester</DialogTitle>
          <DialogDescription>Select a pentester to assign to this program.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger><SelectValue placeholder="Select pentester" /></SelectTrigger>
            <SelectContent>
              {available.length === 0 ? (
                <SelectItem value="none" disabled>No available pentesters</SelectItem>
              ) : (
                available.map((p) => (
                  <SelectItem key={p.user_id} value={p.user_id}>{p.full_name || p.user_id}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="cyber" onClick={handleAssign} disabled={loading || !selectedId}>{loading ? 'Assigning...' : 'Assign'}</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProgramDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { removeAsset, unassignPentester, setSLA } = usePrograms();
  const { toast } = useToast();

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgram = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select(`*, program_assets (*), severity_slas (*), program_pentesters (*)`)
        .eq('id', id)
        .single();
      if (error) throw error;
      setProgram(data as unknown as Program);
    } catch {
      toast({ title: 'Error', description: 'Failed to load program', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => { fetchProgram(); }, [fetchProgram]);

  const handleRemoveAsset = async (assetId: string) => {
    try {
      await removeAsset(assetId);
      toast({ title: 'Asset removed' });
      fetchProgram();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    }
  };

  const handleUnassign = async (pentesterId: string) => {
    try {
      await unassignPentester(id!, pentesterId);
      toast({ title: 'Pentester unassigned' });
      fetchProgram();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    }
  };

  const handleSetSLA = async (severity: VulnerabilitySeverity, responseHours: number, resolutionDays: number) => {
    try {
      await setSLA({ program_id: id!, severity, response_hours: responseHours, resolution_days: resolutionDays });
      toast({ title: 'SLA updated' });
      fetchProgram();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <RoleGuard>
        <PlatformLayout title="Loading..." subtitle="">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </PlatformLayout>
      </RoleGuard>
    );
  }

  if (!program) {
    return (
      <RoleGuard>
        <PlatformLayout title="Program Not Found" subtitle="">
          <Button variant="outline" onClick={() => navigate('/platform/programs')}><ArrowLeft className="w-4 h-4 mr-2" />Back to Programs</Button>
        </PlatformLayout>
      </RoleGuard>
    );
  }

  const assets = (program as any).program_assets as ProgramAsset[] || [];
  const pentesters = (program as any).program_pentesters as any[] || [];
  const slas = (program as any).severity_slas as SeveritySLA[] || [];

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <RoleGuard>
      <PlatformLayout
        title={program.name}
        subtitle={program.description || 'No description'}
        actions={
          <Button variant="outline" onClick={() => navigate('/platform/programs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
        }
      >
        {/* Status & Info Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge className={cn('text-sm border px-3 py-1', statusColors[program.status])}>{program.status}</Badge>
          {program.start_date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />{new Date(program.start_date).toLocaleDateString()} - {program.end_date ? new Date(program.end_date).toLocaleDateString() : 'Ongoing'}
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />{pentesters.length} pentester(s)
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />{assets.length} asset(s)
          </div>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="assets">Assets & Scope</TabsTrigger>
            <TabsTrigger value="pentesters">Pentesters</TabsTrigger>
            <TabsTrigger value="slas">SLAs</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Program Assets</CardTitle>
                  <CardDescription>Define the scope of the engagement</CardDescription>
                </div>
                {isAdmin && <AddAssetDialog programId={program.id} onAdded={fetchProgram} />}
              </CardHeader>
              <CardContent>
                {assets.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No assets defined yet. Add assets to define the testing scope.</p>
                ) : (
                  <div className="space-y-3">
                    {assets.map((asset) => {
                      const Icon = ASSET_TYPE_ICONS[asset.asset_type] || Shield;
                      return (
                        <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">{asset.asset_value}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{asset.asset_type.replace('_', ' ')}</span>
                                <Badge variant={asset.is_in_scope ? 'default' : 'secondary'} className="text-xs">
                                  {asset.is_in_scope ? 'In Scope' : 'Out of Scope'}
                                </Badge>
                              </div>
                              {asset.notes && <p className="text-xs text-muted-foreground mt-1">{asset.notes}</p>}
                            </div>
                          </div>
                          {isAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveAsset(asset.id)} className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pentesters Tab */}
          <TabsContent value="pentesters">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Assigned Pentesters</CardTitle>
                  <CardDescription>Manage pentester assignments for this program</CardDescription>
                </div>
                {isAdmin && (
                  <AssignPentesterDialog
                    programId={program.id}
                    assignedIds={pentesters.map((p: any) => p.pentester_id)}
                    onAssigned={fetchProgram}
                  />
                )}
              </CardHeader>
              <CardContent>
                {pentesters.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pentesters assigned yet.</p>
                ) : (
                  <div className="space-y-3">
                    {pentesters.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {(p.pentester_id || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{p.pentester_id}</p>
                            <p className="text-xs text-muted-foreground">Assigned {new Date(p.assigned_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <Button variant="ghost" size="icon" onClick={() => handleUnassign(p.pentester_id)} className="text-destructive hover:text-destructive">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
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
                <CardTitle className="text-lg">Severity SLAs</CardTitle>
                <CardDescription>Define response and resolution times per severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['critical', 'high', 'medium', 'low', 'informational'] as VulnerabilitySeverity[]).map((severity) => {
                    const existing = slas.find(s => s.severity === severity);
                    return (
                      <SLARow
                        key={severity}
                        severity={severity}
                        responseHours={existing?.response_hours || 0}
                        resolutionDays={existing?.resolution_days || 0}
                        isAdmin={isAdmin}
                        onSave={(rh, rd) => handleSetSLA(severity, rh, rd)}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5" />Rules of Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{program.rules_of_engagement || 'Not defined'}</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5" />Testing Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{program.testing_guidelines || 'Not defined'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PlatformLayout>
    </RoleGuard>
  );
};

const SLARow = ({ severity, responseHours, resolutionDays, isAdmin, onSave }: {
  severity: VulnerabilitySeverity; responseHours: number; resolutionDays: number; isAdmin: boolean;
  onSave: (rh: number, rd: number) => void;
}) => {
  const [rh, setRh] = useState(responseHours);
  const [rd, setRd] = useState(resolutionDays);
  const [editing, setEditing] = useState(false);

  const severityColors: Record<string, string> = {
    critical: 'text-red-400', high: 'text-orange-400', medium: 'text-yellow-400',
    low: 'text-blue-400', informational: 'text-gray-400',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
      <div className="flex items-center gap-3 min-w-[120px]">
        <AlertTriangle className={cn('w-4 h-4', severityColors[severity])} />
        <span className={cn('font-medium capitalize', severityColors[severity])}>{severity}</span>
      </div>
      {editing ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Input type="number" value={rh} onChange={(e) => setRh(Number(e.target.value))} className="w-20 h-8" />
            <span className="text-xs text-muted-foreground">hrs</span>
          </div>
          <div className="flex items-center gap-1">
            <Input type="number" value={rd} onChange={(e) => setRd(Number(e.target.value))} className="w-20 h-8" />
            <span className="text-xs text-muted-foreground">days</span>
          </div>
          <Button size="sm" variant="cyber" onClick={() => { onSave(rh, rd); setEditing(false); }}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="text-sm"><Clock className="w-3 h-3 inline mr-1" />Response: <span className="font-medium">{responseHours || '–'}h</span></div>
          <div className="text-sm"><CheckCircle className="w-3 h-3 inline mr-1" />Resolution: <span className="font-medium">{resolutionDays || '–'}d</span></div>
          {isAdmin && <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>}
        </div>
      )}
    </div>
  );
};

export default ProgramDetailPage;
