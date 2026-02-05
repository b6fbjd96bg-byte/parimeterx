import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, ShieldX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import type { AppRole } from '@/types/platform';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  requireRole?: boolean;
  fallback?: ReactNode;
}

const RoleGuard = ({ children, allowedRoles, requireRole = true, fallback }: RoleGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  const loading = authLoading || roleLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If role is required and user has no role
  if (requireRole && !role) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold">Access Pending</h2>
          <p className="text-muted-foreground">
            Your account has been created but you haven't been assigned a role yet. 
            Please wait for an administrator to assign you access to the platform.
          </p>
        </div>
      </div>
    );
  }

  // Check if user's role is in allowed roles
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this section. 
            This area is restricted to {allowedRoles.join(', ')} users only.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
