import { useState, useEffect, useCallback } from 'react';
import { Bell, Bug, MessageSquare, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'status_change' | 'new_comment' | 'new_report';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  reportId?: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen for real-time vulnerability report changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications_vuln_reports')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'vulnerability_reports' },
        (payload) => {
          const oldStatus = (payload.old as any)?.status;
          const newStatus = (payload.new as any)?.status;
          const title = (payload.new as any)?.title;
          const id = (payload.new as any)?.id;

          if (oldStatus !== newStatus) {
            setNotifications(prev => [{
              id: `status-${id}-${Date.now()}`,
              type: 'status_change' as const,
              title: 'Status Updated',
              message: `"${title}" changed to ${newStatus?.replace('_', ' ')}`,
              timestamp: new Date().toISOString(),
              read: false,
              reportId: id,
            }, ...prev].slice(0, 50));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vulnerability_reports' },
        (payload) => {
          const title = (payload.new as any)?.title;
          const severity = (payload.new as any)?.severity;
          const id = (payload.new as any)?.id;

          setNotifications(prev => [{
            id: `new-${id}-${Date.now()}`,
            type: 'new_report' as const,
            title: 'New Finding Submitted',
            message: `${severity?.toUpperCase()}: "${title}"`,
            timestamp: new Date().toISOString(),
            read: false,
            reportId: id,
          }, ...prev].slice(0, 50));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'report_comments' },
        (payload) => {
          const reportId = (payload.new as any)?.report_id;
          const userId = (payload.new as any)?.user_id;
          if (userId !== user.id) {
            setNotifications(prev => [{
              id: `comment-${reportId}-${Date.now()}`,
              type: 'new_comment' as const,
              title: 'New Comment',
              message: 'A comment was added to one of your reports',
              timestamp: new Date().toISOString(),
              read: false,
              reportId: reportId,
            }, ...prev].slice(0, 50));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_change': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'new_report': return <Bug className="w-4 h-4 text-primary" />;
      case 'new_comment': return <MessageSquare className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <span className="text-sm font-medium">Notifications</span>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={clearAll}>
                Clear
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'p-3 flex items-start gap-3 text-sm transition-colors hover:bg-muted/50',
                    !n.read && 'bg-primary/5'
                  )}
                >
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-medium text-xs', !n.read && 'text-foreground')}>{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
