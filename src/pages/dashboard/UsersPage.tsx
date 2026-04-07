import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Search, Users, Coins, Plus, Minus, Loader2, Mail, Calendar, BarChart3,
  UserPlus, Trash2, Key, MoreVertical, UserCheck, UserX, Eye, EyeOff, RefreshCw,
  ChevronDown, AlertTriangle
} from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AppRole } from '@/types/platform';

interface FullUser {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  credits_remaining: number;
  total_credits_purchased: number;
  total_scans_used: number;
  role: AppRole | null;
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  pentester: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  client: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const AdminUsersPage = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<FullUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resetPwModalOpen, setResetPwModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<FullUser | null>(null);

  // Credit adjust
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustDescription, setAdjustDescription] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // Create user
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<AppRole | ''>('');
  const [isCreating, setIsCreating] = useState(false);

  // Reset password
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPw, setShowResetPw] = useState(false);
  const [resettingPw, setResettingPw] = useState(false);

  // Role assign
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [assigningRole, setAssigningRole] = useState(false);

  // Delete
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch profiles, credits, roles in parallel
      const [profilesRes, creditsRes, rolesRes, authUsersRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name, created_at'),
        supabase.from('user_credits').select('user_id, credits_remaining, total_credits_purchased, total_scans_used'),
        supabase.from('user_roles').select('user_id, role'),
        supabase.functions.invoke('manage-users', { body: { action: 'list' } }),
      ]);

      const profiles = profilesRes.data || [];
      const credits = creditsRes.data || [];
      const roles = rolesRes.data || [];
      const authUsers = authUsersRes.data?.users || [];

      const creditsMap = new Map(credits.map(c => [c.user_id, c]));
      const rolesMap = new Map(roles.map(r => [r.user_id, r.role]));
      const authMap = new Map(authUsers.map((u: any) => [u.id, u]));

      const merged: FullUser[] = profiles.map(p => {
        const c = creditsMap.get(p.user_id);
        const auth = authMap.get(p.user_id);
        return {
          user_id: p.user_id,
          email: auth?.email || 'Unknown',
          full_name: p.full_name,
          created_at: p.created_at,
          last_sign_in_at: auth?.last_sign_in_at || null,
          credits_remaining: c?.credits_remaining ?? 0,
          total_credits_purchased: c?.total_credits_purchased ?? 0,
          total_scans_used: c?.total_scans_used ?? 0,
          role: (rolesMap.get(p.user_id) as AppRole) || null,
        };
      });

      // Sort: admins first, then by created_at desc
      merged.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (b.role === 'admin' && a.role !== 'admin') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(merged);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  // --- Handlers ---

  const handleAdjustCredits = async () => {
    if (!selectedUser || !adjustAmount) return;
    setAdjusting(true);
    const amount = parseInt(adjustAmount);
    if (isNaN(amount) || amount === 0) {
      toast({ title: 'Invalid amount', variant: 'destructive' });
      setAdjusting(false);
      return;
    }
    const { data, error } = await supabase.rpc('admin_adjust_credits', {
      _target_user_id: selectedUser.user_id,
      _amount: amount,
      _description: adjustDescription || `Admin adjustment: ${amount > 0 ? '+' : ''}${amount} credits`,
    });
    if (error || !data) {
      toast({ title: 'Failed to adjust credits', description: error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Credits adjusted', description: `${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(amount)} credits` });
      closeAllModals();
      fetchUsers();
    }
    setAdjusting(false);
  };

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) return;
    setIsCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'create_user', email: newEmail, password: newPassword, full_name: newFullName || newEmail, role: newRole || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: 'User Created', description: `${newEmail} has been created` });
      closeAllModals();
      setTimeout(() => fetchUsers(), 1000);
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to create user', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !resetPassword) return;
    setResettingPw(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'reset_password', user_id: selectedUser.user_id, password: resetPassword },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: 'Password Reset', description: `Password updated for ${selectedUser.email}` });
      closeAllModals();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to reset password', variant: 'destructive' });
    } finally {
      setResettingPw(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setAssigningRole(true);
    try {
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', selectedUser.user_id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase.from('user_roles').update({ role: selectedRole }).eq('user_id', selectedUser.user_id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_roles').insert({ user_id: selectedUser.user_id, role: selectedRole });
        if (error) throw error;
      }
      toast({ title: 'Role Updated', description: `${selectedUser.email} is now ${selectedRole}` });
      closeAllModals();
      fetchUsers();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to assign role', variant: 'destructive' });
    } finally {
      setAssigningRole(false);
    }
  };

  const handleRemoveRole = async (u: FullUser) => {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', u.user_id);
      if (error) throw error;
      toast({ title: 'Role Removed', description: `Removed role from ${u.email}` });
      fetchUsers();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'delete_user', user_id: selectedUser.user_id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: 'User Deleted', description: `${selectedUser.email} has been permanently deleted` });
      closeAllModals();
      setTimeout(() => fetchUsers(), 500);
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete user', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const closeAllModals = () => {
    setAdjustModalOpen(false);
    setCreateModalOpen(false);
    setResetPwModalOpen(false);
    setRoleModalOpen(false);
    setDeleteConfirmOpen(false);
    setSelectedUser(null);
    setAdjustAmount('');
    setAdjustDescription('');
    setNewEmail('');
    setNewPassword('');
    setNewFullName('');
    setNewRole('');
    setResetPassword('');
    setShowResetPw(false);
    setSelectedRole('');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter || (roleFilter === 'none' && !u.role);
    return matchesSearch && matchesRole;
  });

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const totalCredits = users.reduce((s, u) => s + u.credits_remaining, 0);
  const totalScans = users.reduce((s, u) => s + u.total_scans_used, 0);
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">Full admin control — users, credits, roles, and accounts</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateModalOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Create User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: 'Total Users', value: users.length, color: 'text-primary', bg: 'bg-primary/20' },
            { icon: Shield, label: 'Admins', value: adminCount, color: 'text-red-400', bg: 'bg-red-500/20' },
            { icon: Coins, label: 'Total Credits', value: totalCredits, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
            { icon: BarChart3, label: 'Total Scans', value: totalScans, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          ].map(s => (
            <Card key={s.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", s.bg)}>
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="pentester">Pentesters</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="none">No Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Registered Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-center">Credits</TableHead>
                      <TableHead className="text-center">Scans</TableHead>
                      <TableHead className="text-center">Purchased</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(u => (
                      <TableRow key={u.user_id} className="group hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-primary">
                                {(u.full_name || u.email)?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{u.full_name || 'No Name'}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {u.role ? (
                            <Badge className={cn('border capitalize text-xs', ROLE_COLORS[u.role])}>
                              {u.role}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-xs">
                              None
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={cn('text-xs', 
                            u.credits_remaining > 2 ? 'border-primary/30 text-primary' : 
                            u.credits_remaining > 0 ? 'border-yellow-500/30 text-yellow-400' : 
                            'border-destructive/30 text-destructive'
                          )}>
                            <Coins className="w-3 h-3 mr-1" />
                            {u.credits_remaining}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">{u.total_scans_used}</TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">{u.total_credits_purchased}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {u.last_sign_in_at
                            ? formatDistanceToNow(new Date(u.last_sign_in_at), { addSuffix: true })
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(u.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => { setSelectedUser(u); setAdjustModalOpen(true); }}>
                                <Coins className="w-4 h-4 mr-2" />
                                Adjust Credits
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedUser(u); setRoleModalOpen(true); }}>
                                <UserCheck className="w-4 h-4 mr-2" />
                                {u.role ? 'Change Role' : 'Assign Role'}
                              </DropdownMenuItem>
                              {u.role && (
                                <DropdownMenuItem onClick={() => handleRemoveRole(u)} className="text-yellow-400 focus:text-yellow-400">
                                  <UserX className="w-4 h-4 mr-2" />
                                  Remove Role
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => { setSelectedUser(u); setResetPwModalOpen(true); }}>
                                <Key className="w-4 h-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              {u.user_id !== user?.id && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => { setSelectedUser(u); setDeleteConfirmOpen(true); }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ========= MODALS ========= */}

        {/* Adjust Credits */}
        <Dialog open={adjustModalOpen} onOpenChange={(o) => { if (!o) closeAllModals(); else setAdjustModalOpen(true); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Coins className="w-5 h-5 text-primary" /> Adjust Credits</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 mt-2">
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-sm">{selectedUser.full_name || selectedUser.email}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current balance: <span className="text-primary font-semibold">{selectedUser.credits_remaining}</span> credits
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Amount (positive to add, negative to remove)</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setAdjustAmount(p => String((parseInt(p) || 0) - 1))}><Minus className="w-4 h-4" /></Button>
                    <Input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} placeholder="e.g., 10 or -5" className="text-center" />
                    <Button type="button" variant="outline" size="sm" onClick={() => setAdjustAmount(p => String((parseInt(p) || 0) + 1))}><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason (optional)</Label>
                  <Textarea value={adjustDescription} onChange={e => setAdjustDescription(e.target.value)} placeholder="Reason for credit adjustment..." rows={2} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeAllModals}>Cancel</Button>
                  <Button variant="cyber" disabled={adjusting || !adjustAmount || parseInt(adjustAmount) === 0} onClick={handleAdjustCredits}>
                    {adjusting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Confirm
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create User */}
        <Dialog open={createModalOpen} onOpenChange={(o) => { if (!o) closeAllModals(); else setCreateModalOpen(true); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Create New User</DialogTitle>
              <DialogDescription>Create a new account with email and password.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" value={newFullName} onChange={e => setNewFullName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" placeholder="user@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label>Password *</Label>
                <Input type="password" placeholder="Min 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label>Role (optional)</Label>
                <Select value={newRole} onValueChange={v => setNewRole(v as AppRole)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select a role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="pentester">Pentester</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeAllModals}>Cancel</Button>
              <Button onClick={handleCreateUser} disabled={!newEmail || !newPassword || isCreating}>
                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password */}
        <Dialog open={resetPwModalOpen} onOpenChange={(o) => { if (!o) closeAllModals(); else setResetPwModalOpen(true); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> Reset Password</DialogTitle>
              <DialogDescription>Set a new password for {selectedUser?.email}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showResetPw ? 'text' : 'password'}
                    value={resetPassword}
                    onChange={e => setResetPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowResetPw(!showResetPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showResetPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeAllModals}>Cancel</Button>
              <Button onClick={handleResetPassword} disabled={!resetPassword || resetPassword.length < 6 || resettingPw}>
                {resettingPw ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting...</> : 'Reset Password'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign/Change Role */}
        <Dialog open={roleModalOpen} onOpenChange={(o) => { if (!o) closeAllModals(); else setRoleModalOpen(true); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5 text-primary" /> {selectedUser?.role ? 'Change Role' : 'Assign Role'}</DialogTitle>
              <DialogDescription>Select a role for {selectedUser?.email}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={v => setSelectedRole(v as AppRole)}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="pentester">Pentester</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
              {selectedUser?.role && (
                <p className="text-xs text-muted-foreground mt-2">Current role: <span className="capitalize font-medium">{selectedUser.role}</span></p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeAllModals}>Cancel</Button>
              <Button onClick={handleAssignRole} disabled={!selectedRole || assigningRole}>
                {assigningRole ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : 'Save Role'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteConfirmOpen} onOpenChange={(o) => { if (!o) closeAllModals(); else setDeleteConfirmOpen(true); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Delete User</DialogTitle>
              <DialogDescription>
                This will permanently delete <strong>{selectedUser?.email}</strong> and all associated data (profile, credits, roles). This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={closeAllModals}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting}>
                {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting...</> : 'Delete Permanently'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminUsersPage;
