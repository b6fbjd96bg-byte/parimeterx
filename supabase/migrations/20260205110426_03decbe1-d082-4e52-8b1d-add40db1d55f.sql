-- Create role enum for the platform
CREATE TYPE public.app_role AS ENUM ('admin', 'pentester', 'client');

-- Create user_roles table (separate from profiles as per security guidelines)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- user_roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Invitations table for email-based onboarding
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role app_role NOT NULL,
    token TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES auth.users(id) NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invitations" 
ON public.invitations FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read valid invitation by token" 
ON public.invitations FOR SELECT 
USING (token IS NOT NULL AND expires_at > now() AND accepted_at IS NULL);

-- Programs (security engagements)
CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    start_date DATE,
    end_date DATE,
    rules_of_engagement TEXT,
    testing_guidelines TEXT,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Program assets (in-scope and out-of-scope)
CREATE TABLE public.program_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('domain', 'subdomain', 'ip_address', 'ip_range', 'api', 'mobile_app', 'other')),
    asset_value TEXT NOT NULL,
    is_in_scope BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.program_assets ENABLE ROW LEVEL SECURITY;

-- Severity levels and SLAs per program
CREATE TABLE public.severity_slas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'informational')),
    response_hours INTEGER NOT NULL,
    resolution_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (program_id, severity)
);

ALTER TABLE public.severity_slas ENABLE ROW LEVEL SECURITY;

-- Pentester assignments to programs
CREATE TABLE public.program_pentesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
    pentester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assigned_by UUID REFERENCES auth.users(id) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (program_id, pentester_id)
);

ALTER TABLE public.program_pentesters ENABLE ROW LEVEL SECURITY;

-- Vulnerability reports
CREATE TABLE public.vulnerability_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
    submitted_by UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'informational')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'accepted', 'in_progress', 'resolved', 'rejected', 'duplicate')),
    cwe_id TEXT,
    owasp_category TEXT,
    affected_endpoint TEXT,
    steps_to_reproduce TEXT,
    proof_of_concept TEXT,
    impact TEXT,
    remediation TEXT,
    cvss_score NUMERIC(3,1),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vulnerability_reports ENABLE ROW LEVEL SECURITY;

-- File attachments for vulnerability reports
CREATE TABLE public.report_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.vulnerability_reports(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.report_attachments ENABLE ROW LEVEL SECURITY;

-- Comments on vulnerability reports
CREATE TABLE public.report_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.vulnerability_reports(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.report_comments ENABLE ROW LEVEL SECURITY;

-- Audit logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Function to check if user has access to a program
CREATE OR REPLACE FUNCTION public.has_program_access(_user_id UUID, _program_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Admin access
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
    UNION
    -- Client owns the program
    SELECT 1 FROM public.programs WHERE id = _program_id AND client_id = _user_id
    UNION
    -- Pentester assigned to program
    SELECT 1 FROM public.program_pentesters WHERE program_id = _program_id AND pentester_id = _user_id
  )
$$;

-- Programs RLS policies
CREATE POLICY "Admins can manage all programs" 
ON public.programs FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their programs" 
ON public.programs FOR SELECT 
USING (client_id = auth.uid());

CREATE POLICY "Pentesters can view assigned programs" 
ON public.programs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.program_pentesters 
    WHERE program_id = programs.id AND pentester_id = auth.uid()
  )
);

-- Program assets policies
CREATE POLICY "Users with program access can view assets" 
ON public.program_assets FOR SELECT 
USING (public.has_program_access(auth.uid(), program_id));

CREATE POLICY "Admins can manage assets" 
ON public.program_assets FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Severity SLAs policies
CREATE POLICY "Users with program access can view SLAs" 
ON public.severity_slas FOR SELECT 
USING (public.has_program_access(auth.uid(), program_id));

CREATE POLICY "Admins can manage SLAs" 
ON public.severity_slas FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Program pentesters policies
CREATE POLICY "Users with program access can view assignments" 
ON public.program_pentesters FOR SELECT 
USING (public.has_program_access(auth.uid(), program_id));

CREATE POLICY "Admins can manage pentester assignments" 
ON public.program_pentesters FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Vulnerability reports policies
CREATE POLICY "Pentesters can create reports for assigned programs" 
ON public.vulnerability_reports FOR INSERT 
WITH CHECK (
  public.has_role(auth.uid(), 'pentester') AND
  EXISTS (
    SELECT 1 FROM public.program_pentesters 
    WHERE program_id = vulnerability_reports.program_id AND pentester_id = auth.uid()
  )
);

CREATE POLICY "Pentesters can update their own reports" 
ON public.vulnerability_reports FOR UPDATE 
USING (submitted_by = auth.uid());

CREATE POLICY "Users with program access can view reports" 
ON public.vulnerability_reports FOR SELECT 
USING (public.has_program_access(auth.uid(), program_id));

CREATE POLICY "Admins can manage all reports" 
ON public.vulnerability_reports FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Report attachments policies
CREATE POLICY "Users with report access can view attachments" 
ON public.report_attachments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.vulnerability_reports vr 
    WHERE vr.id = report_id AND public.has_program_access(auth.uid(), vr.program_id)
  )
);

CREATE POLICY "Pentesters can upload attachments to their reports" 
ON public.report_attachments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vulnerability_reports vr 
    WHERE vr.id = report_id AND vr.submitted_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage attachments" 
ON public.report_attachments FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Report comments policies
CREATE POLICY "Users with program access can view non-internal comments" 
ON public.report_comments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.vulnerability_reports vr 
    WHERE vr.id = report_id AND public.has_program_access(auth.uid(), vr.program_id)
  ) AND (NOT is_internal OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'pentester'))
);

CREATE POLICY "Authenticated users can add comments to accessible reports" 
ON public.report_comments FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.vulnerability_reports vr 
    WHERE vr.id = report_id AND public.has_program_access(auth.uid(), vr.program_id)
  )
);

CREATE POLICY "Users can update their own comments" 
ON public.report_comments FOR UPDATE 
USING (user_id = auth.uid());

-- Audit logs policies (only admins can view)
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vulnerability_reports_updated_at
BEFORE UPDATE ON public.vulnerability_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_comments_updated_at
BEFORE UPDATE ON public.report_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  _action TEXT,
  _entity_type TEXT,
  _entity_id UUID DEFAULT NULL,
  _old_values JSONB DEFAULT NULL,
  _new_values JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (auth.uid(), _action, _entity_type, _entity_id, _old_values, _new_values)
  RETURNING id INTO _log_id;
  RETURN _log_id;
END;
$$;

-- Storage bucket for report attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'report-attachments', 
  'report-attachments', 
  false,
  52428800, -- 50MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/markdown', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Storage policies
CREATE POLICY "Users can upload attachments to their reports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report-attachments' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view attachments for accessible programs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'report-attachments' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'report-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.vulnerability_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.report_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.programs;