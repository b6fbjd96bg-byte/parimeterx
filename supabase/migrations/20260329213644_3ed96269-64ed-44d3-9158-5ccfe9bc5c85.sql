
-- 1. Fix invitation token exposure: replace the permissive "anyone can read" policy
-- with one that only allows authenticated users to look up by token
DROP POLICY IF EXISTS "Anyone can read valid invitation by token" ON public.invitations;

CREATE POLICY "Authenticated users can read invitation by token"
ON public.invitations
FOR SELECT
TO authenticated
USING (
  token IS NOT NULL
  AND expires_at > now()
  AND accepted_at IS NULL
);

-- 2. Fix audit logs: remove the permissive INSERT policy for all authenticated users
-- The log_audit_event SECURITY DEFINER function handles inserts
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

-- 3. Tighten storage policies on report-attachments
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can upload attachments to their reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view attachments for accessible programs" ON storage.objects;

-- Recreate with path-based ownership checks
CREATE POLICY "Users can upload attachments to their own path"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'report-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own attachments or admin"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'report-attachments'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
  )
);
