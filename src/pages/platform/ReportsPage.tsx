import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PlatformLayout from '@/components/platform/PlatformLayout';
import RoleGuard from '@/components/platform/RoleGuard';
import { usePrograms } from '@/hooks/usePrograms';
import { useVulnerabilityReports } from '@/hooks/useVulnerabilityReports';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { SEVERITY_COLORS } from '@/types/platform';
import { cn } from '@/lib/utils';

const ReportsPage = () => {
  const { programs } = usePrograms();
  const { reports } = useVulnerabilityReports();
  const { toast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState<string>('all');

  const filteredReports = selectedProgram === 'all' 
    ? reports 
    : reports.filter(r => r.program_id === selectedProgram);

  const generatePDFReport = (type: 'executive' | 'technical') => {
    const program = programs.find(p => p.id === selectedProgram);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(10, 10, 15);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(0, 255, 136);
    doc.setFontSize(24);
    doc.text('ParameterX Security Report', 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(type === 'executive' ? 'Executive Summary' : 'Technical Report', 20, 35);

    // Report Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let yPos = 55;

    doc.text(`Program: ${program?.name || 'All Programs'}`, 20, yPos);
    yPos += 8;
    doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, 20, yPos);
    yPos += 8;
    doc.text(`Total Findings: ${filteredReports.length}`, 20, yPos);
    yPos += 15;

    // Summary Statistics
    const severityCounts = {
      critical: filteredReports.filter(r => r.severity === 'critical').length,
      high: filteredReports.filter(r => r.severity === 'high').length,
      medium: filteredReports.filter(r => r.severity === 'medium').length,
      low: filteredReports.filter(r => r.severity === 'low').length,
      informational: filteredReports.filter(r => r.severity === 'informational').length,
    };

    doc.setFontSize(14);
    doc.text('Severity Distribution', 20, yPos);
    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      head: [['Severity', 'Count', 'Percentage']],
      body: Object.entries(severityCounts).map(([severity, count]) => [
        severity.charAt(0).toUpperCase() + severity.slice(1),
        count.toString(),
        `${((count / (filteredReports.length || 1)) * 100).toFixed(1)}%`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 255, 136], textColor: [0, 0, 0] },
      styles: { fontSize: 10 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    if (type === 'technical') {
      // Detailed Findings
      doc.addPage();
      yPos = 20;
      doc.setFontSize(14);
      doc.text('Detailed Findings', 20, yPos);
      yPos += 10;

      filteredReports.forEach((report, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${report.title}`, 20, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Severity: ${report.severity.toUpperCase()} | Status: ${report.status.replace('_', ' ').toUpperCase()}`, 25, yPos);
        yPos += 6;

        if (report.cwe_id) {
          doc.text(`CWE: ${report.cwe_id}`, 25, yPos);
          yPos += 6;
        }

        if (report.affected_endpoint) {
          doc.text(`Endpoint: ${report.affected_endpoint}`, 25, yPos);
          yPos += 6;
        }

        if (report.impact) {
          doc.text(`Impact: ${report.impact.slice(0, 100)}${report.impact.length > 100 ? '...' : ''}`, 25, yPos);
          yPos += 6;
        }

        if (report.remediation) {
          doc.text(`Remediation: ${report.remediation.slice(0, 100)}${report.remediation.length > 100 ? '...' : ''}`, 25, yPos);
          yPos += 6;
        }

        yPos += 10;
      });
    } else {
      // Executive Summary
      doc.addPage();
      yPos = 20;
      doc.setFontSize(14);
      doc.text('Executive Summary', 20, yPos);
      yPos += 15;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      const resolvedCount = filteredReports.filter(r => r.status === 'resolved').length;
      const openCount = filteredReports.filter(r => !['resolved', 'rejected', 'duplicate'].includes(r.status)).length;
      const criticalHighOpen = filteredReports.filter(r => 
        ['critical', 'high'].includes(r.severity) && 
        !['resolved', 'rejected', 'duplicate'].includes(r.status)
      ).length;

      const summaryText = `
This security assessment identified a total of ${filteredReports.length} vulnerabilities. 
Of these, ${severityCounts.critical} are rated as Critical severity, ${severityCounts.high} as High, 
${severityCounts.medium} as Medium, ${severityCounts.low} as Low, and ${severityCounts.informational} as Informational.

Current Status:
- Resolved: ${resolvedCount} findings
- Open: ${openCount} findings
- Critical/High Open: ${criticalHighOpen} findings requiring immediate attention

${criticalHighOpen > 0 
  ? 'IMMEDIATE ACTION REQUIRED: There are critical and/or high severity vulnerabilities that remain unresolved. These should be prioritized for remediation.'
  : 'No critical or high severity vulnerabilities are currently open.'}
      `.trim();

      const lines = doc.splitTextToSize(summaryText, pageWidth - 40);
      doc.text(lines, 20, yPos);
    }

    // Save
    const fileName = `security-report-${type}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
    toast({ title: 'Success', description: `${type === 'executive' ? 'Executive' : 'Technical'} report downloaded` });
  };

  return (
    <RoleGuard>
      <PlatformLayout
        title="Reports"
        subtitle="Generate and download security reports"
      >
        {/* Filters */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by program:</span>
              </div>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="w-full sm:w-60">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Executive Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                High-level summary suitable for management and stakeholders. Includes severity distribution, 
                status overview, and key recommendations.
              </p>
              <Button 
                onClick={() => generatePDFReport('executive')}
                disabled={filteredReports.length === 0}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Executive Report
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Technical Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed technical report with full vulnerability descriptions, affected endpoints, 
                CWE classifications, and remediation guidance.
              </p>
              <Button 
                onClick={() => generatePDFReport('technical')}
                disabled={filteredReports.length === 0}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Technical Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Report Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {(['critical', 'high', 'medium', 'low', 'informational'] as const).map((severity) => {
                const count = filteredReports.filter(r => r.severity === severity).length;
                return (
                  <div 
                    key={severity}
                    className={cn(
                      "p-4 rounded-lg border text-center",
                      SEVERITY_COLORS[severity]
                    )}
                  >
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs capitalize">{severity}</p>
                  </div>
                );
              })}
            </div>

            {filteredReports.length === 0 && (
              <p className="text-center text-muted-foreground mt-6">
                No vulnerabilities found for the selected program.
              </p>
            )}
          </CardContent>
        </Card>
      </PlatformLayout>
    </RoleGuard>
  );
};

export default ReportsPage;
