
-- Create user_credits table
CREATE TABLE public.user_credits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  credits_remaining integer NOT NULL DEFAULT 5,
  total_credits_purchased integer NOT NULL DEFAULT 0,
  total_scans_used integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all credits"
  ON public.user_credits FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all credits"
  ON public.user_credits FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert credits"
  ON public.user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create credit_transactions table
CREATE TABLE public.credit_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL DEFAULT 'scan_deduction',
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.credit_transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can insert transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Function to auto-create credits row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_remaining)
  VALUES (NEW.id, 5);
  
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 5, 'free_signup', 'Welcome bonus: 5 free scans');
  
  RETURN NEW;
END;
$$;

-- Trigger on auth.users for auto credit creation
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- Function to deduct credit on scan
CREATE OR REPLACE FUNCTION public.deduct_scan_credit(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _remaining integer;
BEGIN
  SELECT credits_remaining INTO _remaining
  FROM public.user_credits
  WHERE user_id = _user_id
  FOR UPDATE;
  
  IF _remaining IS NULL OR _remaining <= 0 THEN
    RETURN false;
  END IF;
  
  UPDATE public.user_credits
  SET credits_remaining = credits_remaining - 1,
      total_scans_used = total_scans_used + 1,
      updated_at = now()
  WHERE user_id = _user_id;
  
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (_user_id, -1, 'scan_deduction', 'Scan credit used');
  
  RETURN true;
END;
$$;

-- Function for admin to adjust credits
CREATE OR REPLACE FUNCTION public.admin_adjust_credits(_target_user_id uuid, _amount integer, _description text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN false;
  END IF;
  
  UPDATE public.user_credits
  SET credits_remaining = credits_remaining + _amount,
      total_credits_purchased = CASE WHEN _amount > 0 THEN total_credits_purchased + _amount ELSE total_credits_purchased END,
      updated_at = now()
  WHERE user_id = _target_user_id;
  
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (_target_user_id, _amount, 'admin_adjustment', _description);
  
  RETURN true;
END;
$$;

-- Seed credits for existing users who don't have them yet
INSERT INTO public.user_credits (user_id, credits_remaining)
SELECT id, 5 FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_credits);
