import { Target } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const RedTeamOperations = () => {
  return (
    <ServicePageLayout
      icon={<Target className="h-8 w-8 text-primary" />}
      title="Red Team Operations"
      subtitle="Adversary Simulation"
      description="Our red team engagements replicate advanced adversary behavior to evaluate your organization's detection, response, and resilience capabilities. Through realistic attack simulations, we test people, processes, and technology to uncover gaps in monitoring, incident response, and security controls."
      features={[
        "Full-scope adversary simulation campaigns",
        "Advanced persistent threat (APT) emulation",
        "Social engineering and physical security testing",
        "Bypass of security controls and detection systems",
        "Command and control (C2) infrastructure setup",
        "Data exfiltration and objective completion testing",
        "Purple team collaboration with your security team",
        "Tabletop exercises and attack scenario planning",
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
    />
  );
};

export default RedTeamOperations;
