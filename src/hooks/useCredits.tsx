import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserCredits {
  credits_remaining: number;
  total_credits_purchased: number;
  total_scans_used: number;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining, total_credits_purchased, total_scans_used')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setCredits(data);
    } else if (!data) {
      // Create credits row if missing (for existing users)
      const { data: newData } = await supabase
        .from('user_credits')
        .insert({ user_id: user.id, credits_remaining: 5, total_credits_purchased: 0, total_scans_used: 0 })
        .select('credits_remaining, total_credits_purchased, total_scans_used')
        .single();
      if (newData) setCredits(newData);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-credits-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_credits',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchCredits();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchCredits]);

  const deductCredit = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const { data, error } = await supabase.rpc('deduct_scan_credit', { _user_id: user.id });
    if (error || !data) return false;
    await fetchCredits();
    return true;
  }, [user, fetchCredits]);

  return {
    credits,
    loading,
    creditsRemaining: credits?.credits_remaining ?? 0,
    totalScansUsed: credits?.total_scans_used ?? 0,
    totalCreditsPurchased: credits?.total_credits_purchased ?? 0,
    hasCredits: (credits?.credits_remaining ?? 0) > 0,
    deductCredit,
    refetch: fetchCredits,
  };
};
