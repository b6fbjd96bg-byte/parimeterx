import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radio, AlertTriangle, Shield, Zap, Globe } from 'lucide-react';

interface ThreatEvent {
  id: number;
  type: 'attack' | 'scan' | 'block' | 'alert';
  message: string;
  source: string;
  timestamp: Date;
}

const LiveThreatFeed = () => {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  const generateEvent = (): ThreatEvent => {
    const types: Array<'attack' | 'scan' | 'block' | 'alert'> = ['attack', 'scan', 'block', 'alert'];
    const messages = {
      attack: ['SQL Injection attempt blocked', 'XSS payload detected', 'Brute force attack mitigated', 'Path traversal blocked'],
      scan: ['Port scan detected from', 'Vulnerability probe blocked from', 'Directory enumeration from'],
      block: ['Malicious IP blocked:', 'Suspicious request blocked from', 'Rate limit exceeded for'],
      alert: ['Unusual traffic pattern from', 'New CVE detected in scan', 'Certificate expiring for'],
    };
    const ips = ['192.168.1.1', '10.0.0.15', '172.16.0.50', '203.0.113.42', '198.51.100.23'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const messageArray = messages[type];
    const message = messageArray[Math.floor(Math.random() * messageArray.length)];
    const source = ips[Math.floor(Math.random() * ips.length)];

    return {
      id: Date.now() + Math.random(),
      type,
      message: `${message} ${source}`,
      source,
      timestamp: new Date(),
    };
  };

  useEffect(() => {
    // Initial events
    const initial = Array.from({ length: 5 }, generateEvent);
    setEvents(initial);

    // Add new events periodically
    if (isLive) {
      const interval = setInterval(() => {
        const newEvent = generateEvent();
        setEvents((prev) => [newEvent, ...prev].slice(0, 10));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'attack':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'scan':
        return <Globe className="w-4 h-4 text-yellow-500" />;
      case 'block':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'alert':
        return <Zap className="w-4 h-4 text-primary" />;
      default:
        return <Radio className="w-4 h-4" />;
    }
  };

  const getEventBadge = (type: string) => {
    const variants: Record<string, string> = {
      attack: 'bg-destructive/20 text-destructive border-destructive/30',
      scan: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      block: 'bg-green-500/20 text-green-500 border-green-500/30',
      alert: 'bg-primary/20 text-primary border-primary/30',
    };
    return variants[type] || '';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary" />
            Live Threat Feed
          </span>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-all ${
              isLive ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`flex items-start gap-3 p-3 rounded-lg bg-muted/30 transition-all duration-300 ${
                index === 0 ? 'animate-fade-in border-l-2 border-primary' : ''
              }`}
            >
              <div className="mt-0.5">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${getEventBadge(event.type)} border text-xs`}>
                    {event.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-sm truncate">{event.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveThreatFeed;
