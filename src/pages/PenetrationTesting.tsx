import { Search } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const PenetrationTesting = () => {
  return (
    <ServicePageLayout
      icon={<Search className="h-8 w-8 text-primary" />}
      title="Penetration Testing"
      subtitle="Security Assessment"
      description="Our penetration testing services combine expert-led manual testing with intelligent automation to uncover real-world vulnerabilities across applications, networks, and infrastructure. We simulate attacker techniques to identify exploitable weaknesses before they can be abused, delivering clear risk ratings and actionable remediation guidance."
      features={[
        "External and internal network penetration testing",
        "Web and mobile application security testing",
        "API security assessment and testing",
        "Wireless network security evaluation",
        "Social engineering and phishing simulations",
        "Physical security testing and assessments",
        "Post-exploitation analysis and lateral movement testing",
        "Detailed technical reports with proof-of-concept exploits",
      ]}
      benefits={[
        "Identify vulnerabilities before malicious attackers do",
        "Receive prioritized remediation recommendations",
        "Validate existing security controls effectiveness",
        "Meet compliance requirements for security testing",
        "Reduce risk of data breaches and financial losses",
        "Gain confidence in your security posture",
      ]}
      ctaText="Request a Pentest"
    />
  );
};

export default PenetrationTesting;
