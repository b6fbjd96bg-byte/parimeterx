import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import type { UserProfile, UserRole, AppRole } from '@/types/platform';

interface UserWithRole extends UserProfile {
  role?: AppRole;
}

export const useUsers = (roleFilter?: AppRole | AppRole[]) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!user || !isAdmin) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          ...profile,
          role: userRole?.role as AppRole | undefined,
        };
      });

      // Filter by role if specified
      let filteredUsers = usersWithRoles;
      if (roleFilter) {
        const rolesArray = Array.isArray(roleFilter) ? roleFilter : [roleFilter];
        filteredUsers = usersWithRoles.filter((u) => u.role && rolesArray.includes(u.role));
      }

      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const assignRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) throw new Error('Unauthorized');

    // Check if user already has a role
    const { data: existing } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      // Update existing role
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;
    }

    await fetchUsers();
  };

  const removeRole = async (userId: string) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    await fetchUsers();
  };

  const getPentesters = () => users.filter((u) => u.role === 'pentester');
  const getClients = () => users.filter((u) => u.role === 'client');
  const getAdmins = () => users.filter((u) => u.role === 'admin');

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    assignRole,
    removeRole,
    getPentesters,
    getClients,
    getAdmins,
  };
};
