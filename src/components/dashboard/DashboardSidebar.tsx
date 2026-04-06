import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Shield, 
  FileText, 
  Settings, 
  LogOut,
  Target,
  Activity,
  Bell,
  User,
  Inbox,
  Coins,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DashboardSidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { creditsRemaining, loading: creditsLoading } = useCredits();
  const { isAdmin } = useUserRole();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/scans', icon: Search, label: 'Scans' },
    { path: '/dashboard/vulnerabilities', icon: Shield, label: 'Vulnerabilities' },
    { path: '/dashboard/reports', icon: FileText, label: 'Reports' },
    { path: '/dashboard/targets', icon: Target, label: 'Targets' },
    { path: '/dashboard/activity', icon: Activity, label: 'Activity' },
  ];

  const adminItems = [
    { path: '/dashboard/leads', icon: Inbox, label: 'Leads' },
    { path: '/dashboard/users', icon: Users, label: 'Users' },
  ];

  const bottomItems = [
    { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ParameterX</h1>
            <p className="text-xs text-muted-foreground">Scanner Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Credits Display */}
      <div className="px-4 pt-4 pb-2">
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
          creditsRemaining > 2
            ? 'bg-primary/5 border-primary/20'
            : creditsRemaining > 0
            ? 'bg-yellow-500/5 border-yellow-500/20'
            : 'bg-destructive/5 border-destructive/20'
        }`}>
          <Coins className={`w-4 h-4 ${
            creditsRemaining > 2 ? 'text-primary' : creditsRemaining > 0 ? 'text-yellow-400' : 'text-destructive'
          }`} />
          <span className="text-sm font-medium">
            {creditsLoading ? '...' : creditsRemaining}
          </span>
          <span className="text-xs text-muted-foreground">credits left</span>
          {creditsRemaining === 0 && (
            <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
              Empty
            </Badge>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Admin</p>
            </div>
            {adminItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-3 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">{isAdmin ? 'Admin' : 'Free Plan'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
