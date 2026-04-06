import { useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Shield, Zap, Target, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const urlSchema = z.string().min(1, 'URL is required');

interface NewScanModalProps {
  onScanCreated: () => void;
}

const NewScanModal = ({ onScanCreated }: NewScanModalProps) => {
  const { user } = useAuth();
  const { creditsRemaining, hasCredits, deductCredit } = useCredits();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState('full');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      urlSchema.parse(targetUrl);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com or example.com)');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a scan');
      return;
    }

    if (!hasCredits) {
      setError('No scan credits remaining. Please purchase more credits to continue scanning.');
      return;
    }

    setLoading(true);

    // Deduct credit first
    const credited = await deductCredit();
    if (!credited) {
      setError('Failed to deduct scan credit. You may be out of credits.');
      setLoading(false);
      return;
    }

    // Normalize URL
    let normalizedUrl = targetUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Create the scan record
    const { data: scanData, error: dbError } = await supabase.from('scans').insert({
      user_id: user.id,
      target_url: normalizedUrl,
      scan_type: scanType,
      status: 'pending',
      progress: 0,
    }).select().single();

    if (dbError || !scanData) {
      setError('Failed to create scan. Please try again.');
      setLoading(false);
      return;
    }

    toast({
      title: 'Scan Created',
      description: `Starting vulnerability scan... (${creditsRemaining - 1} credits remaining)`,
    });

    setOpen(false);
    setTargetUrl('');
    setScanType('full');
    onScanCreated();

    // Trigger the edge function
    const { data: session } = await supabase.auth.getSession();
    
    try {
      const response = await supabase.functions.invoke('scan-vulnerabilities', {
        body: { scanId: scanData.id, targetUrl: normalizedUrl },
        headers: { Authorization: `Bearer ${session?.session?.access_token}` },
      });

      if (response.error) {
        console.error('Scan error:', response.error);
        toast({ title: 'Scan Error', description: 'The scan encountered an error.', variant: 'destructive' });
      } else {
        toast({
          title: 'Scan Completed',
          description: `Found ${response.data?.vulnerabilities || 0} potential vulnerabilities.`,
        });
        onScanCreated();
      }
    } catch (err) {
      console.error('Edge function error:', err);
    }

    setLoading(false);
  };

  const scanTypes = [
    { value: 'quick', label: 'Quick Scan', icon: Zap, description: 'Fast scan for common vulnerabilities' },
    { value: 'full', label: 'Full Scan', icon: Shield, description: 'Comprehensive security assessment' },
    { value: 'targeted', label: 'Targeted Scan', icon: Target, description: 'Focus on specific vulnerability types' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cyber" className="gap-2">
          <Plus className="w-4 h-4" />
          New Scan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Create New Vulnerability Scan
          </DialogTitle>
        </DialogHeader>

        {/* Credit Balance */}
        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
          hasCredits 
            ? 'bg-primary/5 border-primary/20' 
            : 'bg-destructive/5 border-destructive/20'
        }`}>
          <Coins className={`w-4 h-4 ${hasCredits ? 'text-primary' : 'text-destructive'}`} />
          <span className="text-sm">
            {hasCredits ? (
              <>You have <Badge variant="outline" className="mx-1 text-primary border-primary/30">{creditsRemaining}</Badge> scan credits remaining</>
            ) : (
              <span className="text-destructive font-medium">No credits remaining — purchase more to scan</span>
            )}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div className="space-y-2">
            <Label htmlFor="target">Target URL</Label>
            <Input
              id="target"
              type="text"
              placeholder="example.com or https://example.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-muted/50"
              disabled={!hasCredits}
            />
          </div>

          <div className="space-y-2">
            <Label>Scan Type</Label>
            <div className="grid gap-3">
              {scanTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setScanType(type.value)}
                  disabled={!hasCredits}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    scanType === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  } ${!hasCredits ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <type.icon className={`w-5 h-5 ${scanType === type.value ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive animate-fade-in">{error}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="cyber" disabled={loading || !hasCredits} className="flex-1">
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning...</>
              ) : !hasCredits ? (
                'No Credits'
              ) : (
                'Start Scan (1 Credit)'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewScanModal;
