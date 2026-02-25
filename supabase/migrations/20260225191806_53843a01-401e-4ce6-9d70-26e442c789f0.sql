
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  service_interest TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
