import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import type { Program, ProgramAsset, SeveritySLA, ProgramPentester } from '@/types/platform';

export const usePrograms = () => {
  const { user } = useAuth();
  const { role, isAdmin } = useUserRole();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('programs')
        .select(`
          *,
          program_assets (*),
          severity_slas (*),
          program_pentesters (*)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPrograms(data as unknown as Program[] || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const createProgram = async (programData: Partial<Program>) => {
    if (!user || !isAdmin) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('programs')
      .insert({
        name: programData.name!,
        description: programData.description,
        client_id: programData.client_id!,
        status: programData.status || 'draft',
        start_date: programData.start_date,
        end_date: programData.end_date,
        rules_of_engagement: programData.rules_of_engagement,
        testing_guidelines: programData.testing_guidelines,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchPrograms();
    return data as unknown as Program;
  };

  const updateProgram = async (id: string, updates: Partial<Program>) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('programs')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchPrograms();
  };

  const deleteProgram = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchPrograms();
  };

  // Asset management
  const addAsset = async (asset: Omit<ProgramAsset, 'id' | 'created_at'>) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('program_assets')
      .insert(asset);

    if (error) throw error;
    await fetchPrograms();
  };

  const removeAsset = async (assetId: string) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('program_assets')
      .delete()
      .eq('id', assetId);

    if (error) throw error;
    await fetchPrograms();
  };

  // SLA management
  const setSLA = async (sla: Omit<SeveritySLA, 'id' | 'created_at'>) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('severity_slas')
      .upsert(sla, { onConflict: 'program_id,severity' });

    if (error) throw error;
    await fetchPrograms();
  };

  // Pentester assignment
  const assignPentester = async (programId: string, pentesterId: string) => {
    if (!user || !isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('program_pentesters')
      .insert({
        program_id: programId,
        pentester_id: pentesterId,
        assigned_by: user.id,
      });

    if (error) throw error;
    await fetchPrograms();
  };

  const unassignPentester = async (programId: string, pentesterId: string) => {
    if (!isAdmin) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('program_pentesters')
      .delete()
      .eq('program_id', programId)
      .eq('pentester_id', pentesterId);

    if (error) throw error;
    await fetchPrograms();
  };

  return {
    programs,
    loading,
    error,
    refetch: fetchPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    addAsset,
    removeAsset,
    setSLA,
    assignPentester,
    unassignPentester,
  };
};
