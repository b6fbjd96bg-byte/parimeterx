import { Target } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const RedTeamOperations = () => {
  return (
    <ServicePageLayout
      icon={<Target className="h-8 w-8 text-primary" />}
      title="Red Team Operations"
      subtitle="Adversary Simulation"
      description="Our red team engagements replicate advanced adversary behavior to evaluate your organization's detection, response, and resilience capabilities. Through realistic attack simulations aligned with MITRE ATT&CK framework, we test people, processes, and technology to uncover gaps in monitoring, incident response, and security controls."
      features={[
        "Full-scope adversary simulation campaigns",
        "Advanced persistent threat (APT) emulation",
        "Phishing and social engineering attacks",
        "Initial access and lateral movement simulation",
        "Privilege escalation testing",
        "Data exfiltration simulation",
        "MITRE ATT&CK aligned methodologies",
        "Purple team collaboration with your security team",
      ]}
      benefits={[
        "Test your security team's real-world detection capabilities",
        "Identify gaps in incident response procedures",
        "Validate security investments and control effectiveness",
        "Train staff through realistic attack scenarios",
        "Understand how attackers would target your organization",
        "Improve overall security resilience and preparedness",
      ]}
      ctaText="Plan Red Team Exercise"
      accentColor="red"
    />
  );
};

export default RedTeamOperations;
