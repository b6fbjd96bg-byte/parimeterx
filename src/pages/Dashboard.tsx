import { useState, useEffect } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Target, Activity, Bell } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AnimatedBackground from '@/components/dashboard/AnimatedBackground';
import StatsCard from '@/components/dashboard/StatsCard';
import ScannerAnimation from '@/components/dashboard/ScannerAnimation';
import VulnerabilityChart from '@/components/dashboard/VulnerabilityChart';
import RecentScans from '@/components/dashboard/RecentScans';
import VulnerabilityList from '@/components/dashboard/VulnerabilityList';
import LiveThreatFeed from '@/components/dashboard/LiveThreatFeed';
import NewScanModal from '@/components/dashboard/NewScanModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchScanCount = async () => {
      const { count } = await supabase
        .from('scans')
        .select('*', { count: 'exact', head: true });
      setScanCount(count || 0);
    };

    fetchScanCount();
  }, [user, refreshKey]);

  // Simulated scan animation
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

  const startDemoScan = () => {
    setScanProgress(0);
    setIsScanning(true);
  };

  const handleScanCreated = () => {
    setRefreshKey((prev) => prev + 1);
    startDemoScan();
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <DashboardSidebar />

      <main className="ml-64 p-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time vulnerability monitoring and threat detection
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                3
              </span>
            </Button>
            <NewScanModal onScanCreated={handleScanCreated} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Scans"
            value={scanCount || 47}
            icon={<Search className="w-5 h-5" />}
            trend={12}
            color="primary"
            delay={0}
          />
          <StatsCard
            title="Vulnerabilities Found"
            value={241}
            icon={<AlertTriangle className="w-5 h-5" />}
            trend={-8}
            color="destructive"
            delay={100}
          />
          <StatsCard
            title="Issues Resolved"
            value={189}
            icon={<CheckCircle className="w-5 h-5" />}
            trend={24}
            color="success"
            delay={200}
          />
          <StatsCard
            title="Active Targets"
            value={12}
            icon={<Target className="w-5 h-5" />}
            color="warning"
            delay={300}
          />
        </div>

        {/* Scanner and Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
                    <p className="text-2xl font-bold text-primary">{Math.round(scanProgress)}%</p>
                  </div>
                ) : scanProgress === 100 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-500">Scan completed!</p>
                    <Button variant="outline" onClick={startDemoScan}>Run Again</Button>
                  </div>
                ) : (
                  <Button variant="cyber" onClick={startDemoScan}>
                    <Shield className="w-4 h-4 mr-2" />
                    Start Demo Scan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <VulnerabilityChart />
          </div>
        </div>

        {/* Recent Scans and Threat Feed Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentScans key={refreshKey} />
          <LiveThreatFeed />
        </div>

        {/* Vulnerability List */}
        <VulnerabilityList />
      </main>
    </div>
  );
};

export default Dashboard;
