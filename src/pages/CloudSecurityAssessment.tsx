import { Cloud } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const CloudSecurityAssessment = () => {
  return (
    <ServicePageLayout
      icon={<Cloud className="h-8 w-8 text-primary" />}
      title="Cloud Security Assessment"
      subtitle="Cloud Infrastructure"
      description="Our cloud security assessments evaluate your AWS, Azure, and GCP environments for misconfigurations, excessive permissions, insecure services, and identity access risks. We help you align your cloud infrastructure with security best practices and compliance requirements."
      features={[
        "Multi-cloud security assessment (AWS, Azure, GCP)",
        "IAM and identity access management review",
        "Network security and segmentation analysis",
        "Data storage and encryption evaluation",
        "Container and Kubernetes security testing",
        "Serverless function security assessment",
        "Logging, monitoring, and alerting review",
        "Cloud compliance and governance evaluation",
      ]}
      benefits={[
        "Identify misconfigurations before they become breaches",
        "Reduce cloud costs through proper resource management",
        "Ensure compliance with cloud security frameworks",
        "Protect sensitive data in cloud environments",
        "Optimize security across multi-cloud deployments",
        "Build a secure foundation for cloud-native applications",
      ]}
      ctaText="Assess Your Cloud"
    />
  );
};

export default CloudSecurityAssessment;
