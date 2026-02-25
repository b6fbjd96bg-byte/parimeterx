import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const ProtectorsLogin = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Role-based redirect after login
  useEffect(() => {
    if (!loginAttempted || roleLoading || !user) return;

    if (role === 'pentester' || role === 'client' || role === 'admin') {
      navigate('/platform');
    } else if (!role) {
      toast({
        title: 'Access Pending',
        description: 'Your account has not been assigned a role yet. Please contact your administrator.',
        variant: 'destructive',
      });
      signOut();
      setLoginAttempted(false);
    }
  }, [role, roleLoading, user, loginAttempted, navigate, toast, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const { error } = await signIn(formData.email, formData.password);
    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setLoginAttempted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AnimatedBackground />
      
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm relative z-10">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-9 h-9 text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Protectors Portal</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Sign in with credentials provided by your administrator
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@parameterx.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              variant="cyber"
              size="lg"
              className="w-full"
              disabled={loading || (loginAttempted && roleLoading)}
            >
              {loading || (loginAttempted && roleLoading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectorsLogin;
