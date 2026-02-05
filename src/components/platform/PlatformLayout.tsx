import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Bug, 
  Settings, 
  LogOut, 
  UserPlus,
  FileText,
  Activity,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles?: ('admin' | 'pentester' | 'client')[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/platform', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Programs', path: '/platform/programs', icon: <FolderOpen className="w-5 h-5" /> },
  { label: 'Vulnerabilities', path: '/platform/vulnerabilities', icon: <Bug className="w-5 h-5" /> },
  { label: 'Users', path: '/platform/users', icon: <Users className="w-5 h-5" />, roles: ['admin'] },
  { label: 'Invitations', path: '/platform/invitations', icon: <UserPlus className="w-5 h-5" />, roles: ['admin'] },
  { label: 'Reports', path: '/platform/reports', icon: <FileText className="w-5 h-5" /> },
  { label: 'Audit Logs', path: '/platform/audit-logs', icon: <Activity className="w-5 h-5" />, roles: ['admin'] },
];

interface PlatformLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

const PlatformLayout = ({ children, title, subtitle, actions }: PlatformLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { role, isAdmin, isPentester, isClient } = useUserRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Admin', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (isPentester) return { label: 'Pentester', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
    if (isClient) return { label: 'Client', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    return { label: 'User', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-card/95 backdrop-blur-xl border-r border-border transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">ParameterX</h1>
                <p className="text-xs text-muted-foreground">Security Platform</p>
              </div>
            </Link>
          </div>

          {/* Role Badge */}
          <div className="px-6 py-4 border-b border-border">
            <div className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border', roleBadge.color)}>
              {roleBadge.label}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/platform' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 relative z-10">
          {/* Header */}
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                {title && <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>}
                {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlatformLayout;
