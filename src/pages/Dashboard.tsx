import { useState, useEffect, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Target, Activity, Wifi, WifiOff } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import StatsCard from '@/components/dashboard/StatsCard';
import ScannerAnimation from '@/components/dashboard/ScannerAnimation';
import VulnerabilityChart from '@/components/dashboard/VulnerabilityChart';
import RecentScans from '@/components/dashboard/RecentScans';
import VulnerabilityList from '@/components/dashboard/VulnerabilityList';
import NewScanModal from '@/components/dashboard/NewScanModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [vulnCount, setVulnCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLive, setIsLive] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    const [scansRes, vulnsRes, resolvedRes, targetsRes] = await Promise.all([
      supabase.from('scans').select('*', { count: 'exact', head: true }),
      supabase.from('vulnerabilities').select('*', { count: 'exact', head: true }),
      supabase.from('vulnerabilities').select('*', { count: 'exact', head: true }).eq('status', 'fixed'),
      supabase.from('scans').select('target_url'),
    ]);

    setScanCount(scansRes.count || 0);
    setVulnCount(vulnsRes.count || 0);
    setResolvedCount(resolvedRes.count || 0);
    const uniqueTargets = new Set(targetsRes.data?.map(t => t.target_url) || []);
    setTargetCount(uniqueTargets.size);
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Real-time subscriptions for stats
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scans' }, () => {
        fetchStats();
        setRefreshKey(prev => prev + 1);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vulnerabilities' }, () => {
        fetchStats();
        setRefreshKey(prev => prev + 1);
      })
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchStats]);

  // Scan animation
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleScanCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setScanProgress(0);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Security Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              Real-time vulnerability monitoring and threat detection
              <Badge
                variant="outline"
                className={`text-xs gap-1.5 transition-colors duration-500 ${
                  isLive
                    ? 'border-emerald-500/50 text-emerald-400'
                    : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {isLive ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                {isLive ? 'Live' : 'Connecting'}
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NewScanModal onScanCreated={handleScanCreated} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatsCard
            title="Total Scans"
            value={scanCount}
            icon={<Search className="w-5 h-5" />}
            color="primary"
            delay={0}
          />
          <StatsCard
            title="Vulnerabilities Found"
            value={vulnCount}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="destructive"
            delay={80}
          />
          <StatsCard
            title="Issues Resolved"
            value={resolvedCount}
            icon={<CheckCircle className="w-5 h-5" />}
            color="success"
            delay={160}
          />
          <StatsCard
            title="Active Targets"
            value={targetCount}
            icon={<Target className="w-5 h-5" />}
            color="warning"
            delay={240}
          />
        </div>

        {/* Scanner and Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <Card className="lg:col-span-1 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-5 h-5 text-primary" />
                Active Scan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScannerAnimation isScanning={isScanning} progress={Math.min(scanProgress, 100)} />
              <div className="mt-6 text-center">
                {isScanning ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Scanning in progress...</p>
                    <p className="text-2xl font-bold text-primary tabular-nums">{Math.round(scanProgress)}%</p>
                  </div>
                ) : scanProgress === 100 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-400">Scan completed!</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No active scan. Start a new scan above.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <VulnerabilityChart refreshKey={refreshKey} />
          </div>
        </div>

        {/* Recent Scans */}
        <div className="grid grid-cols-1 gap-5 mb-8">
          <RecentScans refreshKey={refreshKey} />
        </div>

        {/* Vulnerability List */}
        <VulnerabilityList refreshKey={refreshKey} />
      </main>
    </div>
  );
};

export default Dashboard;
