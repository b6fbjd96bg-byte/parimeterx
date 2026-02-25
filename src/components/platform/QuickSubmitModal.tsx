import { useState, useRef } from 'react';
import { Bug, Upload, X, ChevronRight, ChevronLeft, Check, FileText, Image, Video, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVulnerabilityReports } from '@/hooks/useVulnerabilityReports';
import { useToast } from '@/hooks/use-toast';
import { CWE_CATEGORIES, OWASP_CATEGORIES, VulnerabilitySeverity, SEVERITY_COLORS } from '@/types/platform';
import { cn } from '@/lib/utils';

interface QuickSubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string;
  programName: string;
}

const SEVERITY_TEMPLATES: Record<string, { cwe: string; owasp: string; impact: string }> = {
  'XSS': { cwe: 'CWE-79', owasp: 'A03', impact: 'An attacker can execute arbitrary JavaScript in the context of a victim user\'s browser session, potentially stealing cookies, session tokens, or performing actions on behalf of the user.' },
  'SQL Injection': { cwe: 'CWE-89', owasp: 'A03', impact: 'An attacker can manipulate database queries to read, modify, or delete data, potentially gaining full control over the database.' },
  'SSRF': { cwe: 'CWE-918', owasp: 'A10', impact: 'An attacker can make the server perform requests to internal resources, potentially accessing sensitive internal services.' },
  'IDOR': { cwe: 'CWE-639', owasp: 'A01', impact: 'An attacker can access or modify resources belonging to other users by manipulating object references.' },
  'Auth Bypass': { cwe: 'CWE-287', owasp: 'A07', impact: 'An attacker can bypass authentication mechanisms to gain unauthorized access to the application.' },
  'File Upload': { cwe: 'CWE-434', owasp: 'A05', impact: 'An attacker can upload malicious files which may lead to remote code execution on the server.' },
};

const QuickSubmitModal = ({ open, onOpenChange, programId, programName }: QuickSubmitModalProps) => {
  const { createReport, uploadAttachment } = useVulnerabilityReports();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    severity: '' as VulnerabilitySeverity | '',
    cwe_id: '',
    owasp_category: '',
    affected_endpoint: '',
    steps_to_reproduce: '',
    proof_of_concept: '',
    impact: '',
    remediation: '',
    cvss_score: '',
  });

  const applyTemplate = (templateName: string) => {
    const tmpl = SEVERITY_TEMPLATES[templateName];
    if (tmpl) {
      setFormData(prev => ({
        ...prev,
        cwe_id: tmpl.cwe,
        owasp_category: tmpl.owasp,
        impact: tmpl.impact,
        title: prev.title || templateName,
      }));
      toast({ title: 'Template Applied', description: `${templateName} template auto-filled` });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.severity) {
      toast({ title: 'Missing Fields', description: 'Title and severity are required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const report = await createReport({
        program_id: programId,
        title: formData.title,
        severity: formData.severity as VulnerabilitySeverity,
        cwe_id: formData.cwe_id || null,
        owasp_category: formData.owasp_category || null,
        affected_endpoint: formData.affected_endpoint || null,
        steps_to_reproduce: formData.steps_to_reproduce || null,
        proof_of_concept: formData.proof_of_concept || null,
        impact: formData.impact || null,
        remediation: formData.remediation || null,
        cvss_score: formData.cvss_score ? parseFloat(formData.cvss_score) : null,
      });

      for (const file of files) {
        try { await uploadAttachment(report.id, file); } catch (err) { console.error('Upload failed:', err); }
      }

      toast({ title: '✅ Submitted!', description: 'Vulnerability report submitted successfully' });
      resetForm();
      onOpenChange(false);
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to submit', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFiles([]);
    setFormData({ title: '', severity: '' as VulnerabilitySeverity | '', cwe_id: '', owasp_category: '', affected_endpoint: '', steps_to_reproduce: '', proof_of_concept: '', impact: '', remediation: '', cvss_score: '' });
  };

  const severities: VulnerabilitySeverity[] = ['critical', 'high', 'medium', 'low', 'informational'];

  const canProceedStep1 = formData.title && formData.severity;
  const canProceedStep2 = formData.steps_to_reproduce;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-primary" />
            Submit Finding — {programName}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-all',
                step === s ? 'bg-primary text-primary-foreground border-primary' :
                step > s ? 'bg-primary/20 text-primary border-primary/30' :
                'bg-muted text-muted-foreground border-border'
              )}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={cn('text-xs hidden sm:block', step >= s ? 'text-foreground' : 'text-muted-foreground')}>
                {s === 1 ? 'Basic Info' : s === 2 ? 'Details' : 'Review'}
              </span>
              {s < 3 && <div className={cn('flex-1 h-px', step > s ? 'bg-primary' : 'bg-border')} />}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Quick Templates */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Quick Templates</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(SEVERITY_TEMPLATES).map((name) => (
                  <Button key={name} type="button" variant="outline" size="sm" onClick={() => applyTemplate(name)} className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />{name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Stored XSS in User Profile"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Severity *</Label>
                <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v as VulnerabilitySeverity })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {severities.map((s) => (
                      <SelectItem key={s} value={s}>
                        <span className="capitalize">{s}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>CVSS Score</Label>
                <Input type="number" step="0.1" min="0" max="10" value={formData.cvss_score} onChange={(e) => setFormData({ ...formData, cvss_score: e.target.value })} placeholder="0-10" className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CWE ID</Label>
                <Select value={formData.cwe_id} onValueChange={(v) => setFormData({ ...formData, cwe_id: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select CWE" /></SelectTrigger>
                  <SelectContent>
                    {CWE_CATEGORIES.map((cwe) => (
                      <SelectItem key={cwe.id} value={cwe.id}>{cwe.id} - {cwe.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>OWASP</Label>
                <Select value={formData.owasp_category} onValueChange={(v) => setFormData({ ...formData, owasp_category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {OWASP_CATEGORIES.map((o) => (
                      <SelectItem key={o.id} value={o.id}>{o.id} - {o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Affected Endpoint</Label>
              <Input value={formData.affected_endpoint} onChange={(e) => setFormData({ ...formData, affected_endpoint: e.target.value })} placeholder="/api/v1/users/profile" className="mt-1" />
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Steps to Reproduce *</Label>
              <Textarea
                value={formData.steps_to_reproduce}
                onChange={(e) => setFormData({ ...formData, steps_to_reproduce: e.target.value })}
                placeholder={"1. Navigate to...\n2. Enter payload...\n3. Observe..."}
                rows={5}
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <Label>Proof of Concept</Label>
              <Textarea value={formData.proof_of_concept} onChange={(e) => setFormData({ ...formData, proof_of_concept: e.target.value })} placeholder="Technical details, payloads..." rows={4} className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <Label>Impact</Label>
              <Textarea value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: e.target.value })} placeholder="Describe the impact..." rows={3} className="mt-1" />
            </div>
            <div>
              <Label>Remediation</Label>
              <Textarea value={formData.remediation} onChange={(e) => setFormData({ ...formData, remediation: e.target.value })} placeholder="Suggested fix..." rows={3} className="mt-1" />
            </div>

            {/* File Upload */}
            <div>
              <Label>Attachments</Label>
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,application/pdf,text/plain" onChange={handleFileSelect} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors mt-1">
                <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Click to upload</p>
              </button>
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                      <div className="flex items-center gap-2 truncate">{getFileIcon(file.type)}<span className="truncate">{file.name}</span></div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(i)} className="shrink-0 h-6 w-6"><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{formData.title}</span>
                {formData.severity && (
                  <Badge className={cn('border capitalize', SEVERITY_COLORS[formData.severity as keyof typeof SEVERITY_COLORS])}>
                    {formData.severity}
                  </Badge>
                )}
              </div>
              {formData.cvss_score && <div className="text-xs text-muted-foreground">CVSS: {formData.cvss_score}</div>}
              {formData.affected_endpoint && <div className="text-xs font-mono text-muted-foreground">{formData.affected_endpoint}</div>}
              {formData.cwe_id && <div className="text-xs text-muted-foreground">CWE: {formData.cwe_id} | OWASP: {formData.owasp_category || 'N/A'}</div>}
              {formData.steps_to_reproduce && (
                <div>
                  <span className="text-xs font-medium">Steps:</span>
                  <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-4">{formData.steps_to_reproduce}</pre>
                </div>
              )}
              {formData.impact && (
                <div>
                  <span className="text-xs font-medium">Impact:</span>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{formData.impact}</p>
                </div>
              )}
              {files.length > 0 && <div className="text-xs text-muted-foreground">{files.length} attachment(s)</div>}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Review carefully. The report will be submitted to {programName}.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" />Back
            </Button>
          ) : <div />}
          
          {step < 3 ? (
            <Button
              variant="cyber"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
            >
              Next<ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="cyber" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Finding'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSubmitModal;
