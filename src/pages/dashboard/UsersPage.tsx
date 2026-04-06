import { useState, useEffect, useCallback } from 'react';
import { Shield, Search, Users, Coins, Plus, Minus, Loader2, Mail, Calendar, BarChart3 } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';

interface UserWithCredits {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  credits_remaining: number;
  total_credits_purchased: number;
  total_scans_used: number;
}

const AdminUsersPage = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithCredits[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithCredits | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustDescription, setAdjustDescription] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!user) return;

    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name, created_at');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      setLoading(false);
      return;
    }

    // Fetch credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('user_id, credits_remaining, total_credits_purchased, total_scans_used');

    if (creditsError) {
      console.error('Error fetching credits:', creditsError);
    }

    // Use manage-users edge function to get emails
    const { data: session } = await supabase.auth.getSession();
    let emailMap: Record<string, string> = {};

    try {
      const response = await supabase.functions.invoke('manage-users', {
        body: { action: 'list' },
        headers: { Authorization: `Bearer ${session?.session?.access_token}` },
      });
      if (response.data?.users) {
        for (const u of response.data.users) {
          emailMap[u.id] = u.email;
        }
      }
    } catch (err) {
      console.error('Error fetching user emails:', err);
    }

    const creditsMap = new Map((credits || []).map(c => [c.user_id, c]));

    const mergedUsers: UserWithCredits[] = (profiles || []).map(p => {
      const c = creditsMap.get(p.user_id);
      return {
        user_id: p.user_id,
        email: emailMap[p.user_id] || 'Unknown',
        full_name: p.full_name,
        created_at: p.created_at,
        credits_remaining: c?.credits_remaining ?? 0,
        total_credits_purchased: c?.total_credits_purchased ?? 0,
        total_scans_used: c?.total_scans_used ?? 0,
      };
    });

    setUsers(mergedUsers);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

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
      toast({ title: 'Credits adjusted', description: `${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(amount)} credits for ${selectedUser.email}` });
      setAdjustModalOpen(false);
      setAdjustAmount('');
      setAdjustDescription('');
      setSelectedUser(null);
      fetchUsers();
    }

    setAdjusting(false);
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const totalCreditsInSystem = users.reduce((s, u) => s + u.credits_remaining, 0);
  const totalScansRun = users.reduce((s, u) => s + u.total_scans_used, 0);

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all registered users and their scan credits</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCreditsInSystem}</p>
                  <p className="text-xs text-muted-foreground">Total Credits in System</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalScansRun}</p>
                  <p className="text-xs text-muted-foreground">Total Scans Run</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Registered Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Credits</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scans Used</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Purchased</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.user_id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{u.full_name || 'No Name'}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className={`${
                            u.credits_remaining > 2 ? 'border-primary/30 text-primary' : 
                            u.credits_remaining > 0 ? 'border-yellow-500/30 text-yellow-400' : 
                            'border-destructive/30 text-destructive'
                          }`}>
                            <Coins className="w-3 h-3 mr-1" />
                            {u.credits_remaining}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-muted-foreground">{u.total_scans_used}</td>
                        <td className="py-3 px-4 text-center text-sm text-muted-foreground">{u.total_credits_purchased}</td>
                        <td className="py-3 px-4 text-center text-xs text-muted-foreground">
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(u.created_at), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => {
                              setSelectedUser(u);
                              setAdjustModalOpen(true);
                            }}
                          >
                            <Coins className="w-3 h-3" />
                            Adjust
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adjust Credits Modal */}
        <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Adjust Credits
              </DialogTitle>
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAdjustAmount(prev => String((parseInt(prev) || 0) - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={adjustAmount}
                      onChange={e => setAdjustAmount(e.target.value)}
                      placeholder="e.g., 10 or -5"
                      className="text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAdjustAmount(prev => String((parseInt(prev) || 0) + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason (optional)</Label>
                  <Textarea
                    value={adjustDescription}
                    onChange={e => setAdjustDescription(e.target.value)}
                    placeholder="Reason for credit adjustment..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setAdjustModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="cyber"
                    className="flex-1"
                    disabled={adjusting || !adjustAmount || parseInt(adjustAmount) === 0}
                    onClick={handleAdjustCredits}
                  >
                    {adjusting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Confirm Adjustment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminUsersPage;
