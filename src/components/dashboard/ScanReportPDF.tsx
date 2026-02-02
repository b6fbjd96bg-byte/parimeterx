import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Vulnerability {
  id: string;
  severity: string;
  title: string;
  description: string | null;
  location: string | null;
  cve_id?: string | null;
  cvss_score?: number | null;
  recommendation?: string | null;
  status: string;
}

interface Scan {
  id: string;
  target_url: string;
  status: string;
  created_at: string;
  completed_at?: string;
  scan_type: string;
}

interface ScanReportPDFProps {
  scan: Scan;
  vulnerabilities: Vulnerability[];
}

const ScanReportPDF = ({ scan, vulnerabilities }: ScanReportPDFProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const getSeverityColor = (severity: string): [number, number, number] => {
    switch (severity) {
      case 'critical': return [220, 38, 38];
      case 'high': return [234, 88, 12];
      case 'medium': return [202, 138, 4];
      case 'low': return [22, 163, 74];
      default: return [59, 130, 246];
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Header with logo placeholder
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('BreachAware', 20, 30);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Security Vulnerability Report', 20, 40);

      yPos = 65;

      // Report metadata
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      
      doc.text(`Report Generated: ${reportDate}`, 20, yPos);
      yPos += 8;
      doc.text(`Target URL: ${scan.target_url}`, 20, yPos);
      yPos += 8;
      doc.text(`Scan Type: ${scan.scan_type.charAt(0).toUpperCase() + scan.scan_type.slice(1)}`, 20, yPos);
      yPos += 8;
      doc.text(`Scan Status: ${scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}`, 20, yPos);
      yPos += 15;

      // Executive Summary
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Executive Summary', 20, yPos);
      yPos += 10;

      // Severity counts
      const severityCounts = {
        critical: vulnerabilities.filter(v => v.severity === 'critical').length,
        high: vulnerabilities.filter(v => v.severity === 'high').length,
        medium: vulnerabilities.filter(v => v.severity === 'medium').length,
        low: vulnerabilities.filter(v => v.severity === 'low').length,
        info: vulnerabilities.filter(v => v.severity === 'info').length,
      };

      // Summary boxes
      const boxWidth = 35;
      const boxHeight = 25;
      const startX = 20;
      const severities = ['critical', 'high', 'medium', 'low', 'info'] as const;
      
      severities.forEach((severity, index) => {
        const x = startX + (index * (boxWidth + 5));
        const color = getSeverityColor(severity);
        
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(x, yPos, boxWidth, boxHeight, 3, 3, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(String(severityCounts[severity]), x + boxWidth / 2, yPos + 12, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(severity.toUpperCase(), x + boxWidth / 2, yPos + 20, { align: 'center' });
      });

      yPos += boxHeight + 15;

      // Total vulnerabilities
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Vulnerabilities Found: ${vulnerabilities.length}`, 20, yPos);
      doc.text(`Open Issues: ${vulnerabilities.filter(v => v.status === 'open').length}`, 120, yPos);
      doc.text(`Fixed Issues: ${vulnerabilities.filter(v => v.status === 'fixed').length}`, 170, yPos);
      yPos += 15;

      // Vulnerability Details Table
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Vulnerability Details', 20, yPos);
      yPos += 5;

      if (vulnerabilities.length > 0) {
        const tableData = vulnerabilities.map(vuln => [
          vuln.severity.toUpperCase(),
          vuln.title,
          vuln.cvss_score?.toFixed(1) || 'N/A',
          vuln.status.toUpperCase(),
          vuln.location?.substring(0, 30) || 'N/A',
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Severity', 'Title', 'CVSS', 'Status', 'Location']],
          body: tableData,
          theme: 'striped',
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 60 },
            2: { cellWidth: 20 },
            3: { cellWidth: 25 },
            4: { cellWidth: 50 },
          },
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
              const severity = data.cell.text[0]?.toLowerCase();
              if (severity) {
                const color = getSeverityColor(severity);
                doc.setTextColor(color[0], color[1], color[2]);
              }
            }
          },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Detailed Findings (new page if needed)
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Detailed Findings', 20, yPos);
      yPos += 10;

      vulnerabilities.forEach((vuln, index) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        // Finding header
        const color = getSeverityColor(vuln.severity);
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(20, yPos, 3, 25, 'F');

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${vuln.title}`, 28, yPos + 5);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Severity: ${vuln.severity.toUpperCase()} | CVSS: ${vuln.cvss_score || 'N/A'}${vuln.cve_id ? ` | ${vuln.cve_id}` : ''}`, 28, yPos + 12);

        yPos += 20;

        if (vuln.description) {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(9);
          const descLines = doc.splitTextToSize(vuln.description, pageWidth - 50);
          doc.text(descLines, 28, yPos);
          yPos += descLines.length * 5 + 5;
        }

        if (vuln.recommendation) {
          doc.setTextColor(22, 163, 74);
          doc.setFont('helvetica', 'bold');
          doc.text('Recommendation:', 28, yPos);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          const recLines = doc.splitTextToSize(vuln.recommendation, pageWidth - 50);
          doc.text(recLines, 28, yPos + 5);
          yPos += recLines.length * 5 + 10;
        }

        yPos += 5;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `BreachAware Security Report - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      const fileName = `security-report-${scan.target_url.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: 'Report Generated',
        description: 'Your security report has been downloaded.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={generatePDF}
      disabled={generating || vulnerabilities.length === 0}
    >
      {generating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          Export PDF
        </>
      )}
    </Button>
  );
};

export default ScanReportPDF;
