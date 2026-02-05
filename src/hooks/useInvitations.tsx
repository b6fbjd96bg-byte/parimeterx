import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import type { Invitation, AppRole } from '@/types/platform';

export const useInvitations = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    if (!user || !isAdmin) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInvitations(data as Invitation[] || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const createInvitation = async (email: string, role: AppRole) => {
    if (!user || !isAdmin) {
      throw new Error('Unauthorized');
    }

    // Generate a secure token
    const token = crypto.randomUUID() + '-' + crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        email: email.toLowerCase().trim(),
        role,
        token,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchInvitations();
    return data as Invitation;
  };

  const revokeInvitation = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchInvitations();
  };

  const getInvitationByToken = async (token: string) => {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    return data as Invitation | null;
  };

  const acceptInvitation = async (token: string) => {
    if (!user) throw new Error('Must be logged in to accept invitation');

    // Get the invitation
    const invitation = await getInvitationByToken(token);
    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    // Mark invitation as accepted
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id);

    if (updateError) throw updateError;

    // This will be handled by a trigger or the admin manually assigns the role
    // For now, we'll need the admin to verify and assign the role
    
    return invitation;
  };

  return {
    invitations,
    loading,
    error,
    refetch: fetchInvitations,
    createInvitation,
    revokeInvitation,
    getInvitationByToken,
    acceptInvitation,
  };
};
