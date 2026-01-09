import { Lock } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const ComplianceAuditing = () => {
  return (
    <ServicePageLayout
      icon={<Lock className="h-8 w-8 text-primary" />}
      title="Compliance Auditing"
      subtitle="Regulatory Compliance"
      description="We help organizations achieve and maintain compliance with industry standards such as SOC 2, HIPAA, PCI DSS, and GDPR. Our audits include detailed gap analysis, risk mapping, and practical recommendations to meet regulatory and security requirements efficiently."
      features={[
        "SOC 2 Type I and Type II readiness assessments",
        "HIPAA security and privacy compliance reviews",
        "PCI DSS compliance gap analysis and remediation",
        "GDPR data protection impact assessments",
        "ISO 27001 implementation support",
        "NIST Cybersecurity Framework alignment",
        "Third-party vendor security assessments",
        "Policy and procedure development assistance",
      ]}
      benefits={[
        "Achieve compliance certifications efficiently",
        "Avoid costly regulatory fines and penalties",
        "Build trust with customers and business partners",
        "Streamline audit preparation and documentation",
        "Identify security gaps aligned with compliance requirements",
        "Maintain continuous compliance with monitoring programs",
      ]}
      ctaText="Start Compliance Audit"
    />
  );
};

export default ComplianceAuditing;
