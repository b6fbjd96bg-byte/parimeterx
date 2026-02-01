import { useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Shield, Zap, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const urlSchema = z.string().min(1, 'URL is required');

interface NewScanModalProps {
  onScanCreated: () => void;
}

const NewScanModal = ({ onScanCreated }: NewScanModalProps) => {
  const { user } = useAuth();
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

    setLoading(true);

    // Normalize URL
    let normalizedUrl = targetUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Create the scan record first
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
      description: 'Starting vulnerability scan...',
    });

    setOpen(false);
    setTargetUrl('');
    setScanType('full');
    onScanCreated();

    // Trigger the edge function to perform the scan
    const { data: session } = await supabase.auth.getSession();
    
    try {
      const response = await supabase.functions.invoke('scan-vulnerabilities', {
        body: {
          scanId: scanData.id,
          targetUrl: normalizedUrl,
        },
        headers: {
          Authorization: `Bearer ${session?.session?.access_token}`,
        },
      });

      if (response.error) {
        console.error('Scan error:', response.error);
        toast({
          title: 'Scan Error',
          description: 'The scan encountered an error. Please try again.',
          variant: 'destructive',
        });
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
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target URL</Label>
            <Input
              id="target"
              type="text"
              placeholder="example.com or https://example.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Enter the website URL to scan for security vulnerabilities
            </p>
          </div>

          <div className="space-y-2">
            <Label>Scan Type</Label>
            <div className="grid gap-3">
              {scanTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setScanType(type.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    scanType === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
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

          {error && (
            <p className="text-sm text-destructive animate-fade-in">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="cyber" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                'Start Scan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewScanModal;
