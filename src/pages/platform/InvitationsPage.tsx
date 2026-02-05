import { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Copy,
  Trash2,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useInvitations } from '@/hooks/useInvitations';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import type { AppRole, Invitation } from '@/types/platform';

const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  pentester: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  client: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const CreateInvitationDialog = ({ onCreated }: { onCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createInvitation } = useInvitations();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppRole | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const invitation = await createInvitation(email, role);
      const inviteUrl = `${window.location.origin}/auth/invite?token=${invitation.token}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(inviteUrl);
      
      toast({ 
        title: 'Invitation Created', 
        description: 'Invitation link copied to clipboard. Share it with the user.' 
      });
      setOpen(false);
      setEmail('');
      setRole('');
      onCreated();
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: err instanceof Error ? err.message : 'Failed to create invitation', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cyber">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new user. They'll receive a link to create their account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as AppRole)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pentester">Pentester</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cyber" disabled={loading}>
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InvitationsPage = () => {
  const { invitations, loading, revokeInvitation, refetch } = useInvitations();
  const { toast } = useToast();

  const handleCopyLink = async (token: string) => {
    const inviteUrl = `${window.location.origin}/auth/invite?token=${token}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast({ title: 'Copied', description: 'Invitation link copied to clipboard' });
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;

    try {
      await revokeInvitation(id);
      toast({ title: 'Success', description: 'Invitation revoked' });
      refetch();
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: err instanceof Error ? err.message : 'Failed to revoke invitation', 
        variant: 'destructive' 
      });
    }
  };

  const getStatus = (invitation: Invitation) => {
    if (invitation.accepted_at) {
      return { label: 'Accepted', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle };
    }
    if (isPast(new Date(invitation.expires_at))) {
      return { label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle };
    }
    return { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock };
  };

  const pendingCount = invitations.filter(i => !i.accepted_at && !isPast(new Date(i.expires_at))).length;
  const acceptedCount = invitations.filter(i => i.accepted_at).length;
  const expiredCount = invitations.filter(i => !i.accepted_at && isPast(new Date(i.expires_at))).length;

  return (
    <RoleGuard allowedRoles={['admin']}>
      <PlatformLayout
        title="Invitations"
        subtitle="Invite new users to the platform"
        actions={<CreateInvitationDialog onCreated={refetch} />}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{acceptedCount}</p>
                  <p className="text-xs text-muted-foreground">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{expiredCount}</p>
                  <p className="text-xs text-muted-foreground">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invitations Table */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              All Invitations ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Invitations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Invite pentesters and clients to join the platform.
                </p>
                <CreateInvitationDialog onCreated={refetch} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => {
                      const status = getStatus(invitation);
                      const StatusIcon = status.icon;
                      
                      return (
                        <TableRow key={invitation.id} className="group hover:bg-muted/30">
                          <TableCell className="font-medium">{invitation.email}</TableCell>
                          <TableCell>
                            <Badge className={cn('border capitalize', ROLE_COLORS[invitation.role])}>
                              {invitation.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('border', status.color)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!invitation.accepted_at && !isPast(new Date(invitation.expires_at)) && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleCopyLink(invitation.token)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleRevoke(invitation.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
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

export default InvitationsPage;
