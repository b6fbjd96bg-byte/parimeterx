import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  Users as UsersIcon, 
  Bug, 
  Target,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PlatformLayout from '@/components/platform/PlatformLayout';
import RoleGuard from '@/components/platform/RoleGuard';
import { usePrograms } from '@/hooks/usePrograms';
import { useUsers } from '@/hooks/useUsers';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Program, ProgramStatus } from '@/types/platform';

const CreateProgramDialog = ({ onCreated }: { onCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createProgram } = usePrograms();
  const { users } = useUsers('client');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: '',
    start_date: '',
    end_date: '',
    rules_of_engagement: '',
    testing_guidelines: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.client_id) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await createProgram({
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      });
      toast({ title: 'Success', description: 'Program created successfully' });
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        client_id: '',
        start_date: '',
        end_date: '',
        rules_of_engagement: '',
        testing_guidelines: '',
      });
      onCreated();
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: err instanceof Error ? err.message : 'Failed to create program', 
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
          <Plus className="w-4 h-4 mr-2" />
          New Program
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Security Program</DialogTitle>
          <DialogDescription>
            Set up a new security engagement for a client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Q1 2024 Web Application Assessment"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {users.length === 0 ? (
                    <SelectItem value="none" disabled>No clients available</SelectItem>
                  ) : (
                    users.map((client) => (
                      <SelectItem key={client.user_id} value={client.user_id}>
                        {client.full_name || client.user_id}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the security program..."
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="rules">Rules of Engagement</Label>
              <Textarea
                id="rules"
                value={formData.rules_of_engagement}
                onChange={(e) => setFormData({ ...formData, rules_of_engagement: e.target.value })}
                placeholder="Define the rules of engagement, restrictions, and allowed testing methods..."
                rows={4}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="guidelines">Testing Guidelines</Label>
              <Textarea
                id="guidelines"
                value={formData.testing_guidelines}
                onChange={(e) => setFormData({ ...formData, testing_guidelines: e.target.value })}
                placeholder="Specific testing guidelines and requirements..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cyber" disabled={loading}>
              {loading ? 'Creating...' : 'Create Program'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProgramCard = ({ program, onUpdate }: { program: Program; onUpdate: () => void }) => {
  const { updateProgram, deleteProgram } = usePrograms();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();

  const handleStatusChange = async (status: ProgramStatus) => {
    try {
      await updateProgram(program.id, { status });
      toast({ title: 'Success', description: `Program ${status === 'active' ? 'activated' : status}` });
      onUpdate();
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: err instanceof Error ? err.message : 'Failed to update program', 
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) return;
    
    try {
      await deleteProgram(program.id);
      toast({ title: 'Success', description: 'Program deleted' });
      onUpdate();
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: err instanceof Error ? err.message : 'Failed to delete program', 
        variant: 'destructive' 
      });
    }
  };

  const statusColors: Record<ProgramStatus, string> = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <Link
            to={isAdmin ? `/platform/programs/${program.id}` : `/platform/programs/${program.id}/pentest`}
            className="hover:text-primary transition-colors"
          >
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {program.name}
            </CardTitle>
          </Link>
          <Badge className={cn('text-xs border', statusColors[program.status])}>
            {program.status}
          </Badge>
        </div>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/platform/programs/${program.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/platform/programs/${program.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {program.status === 'draft' && (
                <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </DropdownMenuItem>
              )}
              {program.status === 'active' && (
                <DropdownMenuItem onClick={() => handleStatusChange('paused')}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </DropdownMenuItem>
              )}
              {program.status === 'paused' && (
                <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {program.description || 'No description provided'}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {program.start_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(program.start_date).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4" />
            {program.pentesters?.length || 0} pentesters
          </div>
          <div className="flex items-center gap-1">
            <Bug className="w-4 h-4" />
            {program.vulnerability_count || 0} findings
          </div>
        </div>

        {!isAdmin && program.status === 'active' && (
          <div className="mt-4 flex gap-2">
            <Button variant="cyber" size="sm" asChild>
              <Link to={`/platform/programs/${program.id}/pentest`}>
                <Target className="w-4 h-4 mr-1" />View Scope
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/platform/vulnerabilities/new?program=${program.id}`}>
                <Bug className="w-4 h-4 mr-1" />Submit Finding
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProgramsPage = () => {
  const { programs, loading, refetch } = usePrograms();
  const { isAdmin } = useUserRole();

  return (
    <RoleGuard>
      <PlatformLayout
        title="Security Programs"
        subtitle="Manage your penetration testing engagements"
        actions={isAdmin && <CreateProgramDialog onCreated={refetch} />}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/80 backdrop-blur-sm border-border/50 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Programs Yet</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                {isAdmin 
                  ? 'Create your first security program to start managing penetration testing engagements.'
                  : 'No programs have been assigned to you yet.'}
              </p>
              {isAdmin && <CreateProgramDialog onCreated={refetch} />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} onUpdate={refetch} />
            ))}
          </div>
        )}
      </PlatformLayout>
    </RoleGuard>
  );
};

export default ProgramsPage;
