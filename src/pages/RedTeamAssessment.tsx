import { Target, Shield, Lock, Award, FileCheck, Search, BarChart3, FileText, Wrench, RefreshCw, Users } from "lucide-react";
import DetailedServicePageLayout from "@/components/DetailedServicePageLayout";

const RedTeamAssessment = () => {
  return (
    <DetailedServicePageLayout
      icon={<Target className="h-8 w-8 text-[hsl(var(--color-red-team))]" />}
      title="Test Your Defenses Against Real-World Attacks"
      subtitle="Red Team Assessment"
      tagline="Traditional security testing finds vulnerabilities. Red team operations reveal whether your organization can detect, respond to, and survive a determined adversary."
      description="Our Red Team Assessments simulate sophisticated, multi-stage attacks using the same tactics, techniques, and procedures (TTPs) employed by advanced persistent threats (APTs) and organized cybercrime groups."
      trustIndicators={[
        { icon: Shield, label: "MITRE ATT&CK" },
        { icon: Lock, label: "TIBER-EU" },
        { icon: Award, label: "CBEST Certified" },
        { icon: FileCheck, label: "PTES Framework" },
      ]}
      approachTitle="Adversary Simulation Excellence"
      approachDescription="We don't just test your security controls—we test your people, processes, and technology together. Our red team operates like real adversaries, combining technical exploitation with social engineering and physical intrusion techniques."
      whatWeTestTitle="What We Target"
      whatWeTestDescription="Full-spectrum adversary simulation covering all attack vectors that real threat actors use to compromise organizations."
      coreTestingAreas={[
        "Initial access via phishing and social engineering",
        "External network and perimeter exploitation",
        "Physical security bypass and facility intrusion",
        "Privilege escalation and domain dominance",
        "Lateral movement and network pivoting",
        "Data exfiltration and objective achievement",
        "Detection evasion and persistence techniques",
        "Blue team coordination and purple team exercises"
      ]}
      coreTestingNote="Every operation is customized based on your threat model and adversary profiles relevant to your industry."
      processTitle="Our Red Team Operation Phases"
      processDescription="Structured adversary simulation following real-world attack lifecycles."
      processSteps={[
        {
          icon: Search,
          title: "Threat Intelligence & Reconnaissance",
          description: "Deep reconnaissance to understand your organization as adversaries see it.",
          details: [
            "OSINT gathering on organization, employees, and infrastructure",
            "Technical reconnaissance and attack surface enumeration",
            "Adversary profile development based on industry threats",
            "Custom attack scenario development"
          ],
          result: "A realistic adversary operation plan targeting your specific vulnerabilities."
        },
        {
          icon: Target,
          title: "Initial Access & Foothold",
          description: "We gain entry using the same methods real attackers employ.",
          details: [
            "Targeted phishing and spear-phishing campaigns",
            "Technical exploitation of external-facing systems",
            "Physical intrusion and badge cloning",
            "Supply chain and third-party compromise simulation",
            "Establishment of command and control"
          ],
          result: "Validated initial access vectors and understanding of detection gaps."
        },
        {
          icon: Users,
          title: "Escalation & Lateral Movement",
          description: "We expand access and move toward critical assets.",
          details: [
            "Privilege escalation and credential harvesting",
            "Active Directory attack chains",
            "Network segmentation bypass",
            "Crown jewel targeting and access"
          ],
          result: "Full attack path to your most critical assets."
        },
        {
          icon: BarChart3,
          title: "Objective Achievement & Exfiltration",
          description: "We demonstrate real business impact.",
          details: [
            "Simulated data exfiltration",
            "Business process manipulation",
            "Ransomware simulation (controlled)",
            "Demonstration of attack impact"
          ],
          result: "Proof of concept showing real-world consequences."
        },
        {
          icon: FileText,
          title: "Detection & Response Analysis",
          description: "We analyze what your defenses caught and missed.",
          details: [
            "Timeline of activities vs. detection events",
            "Security tool effectiveness evaluation",
            "Incident response team assessment",
            "SOC and SIEM analysis"
          ],
          result: "Comprehensive view of detection and response capabilities."
        },
        {
          icon: RefreshCw,
          title: "Purple Team Collaboration",
          description: "We work with your team to improve defenses.",
          details: [
            "Joint exercises with blue team",
            "Detection rule development",
            "Incident response playbook refinement",
            "Security control optimization"
          ],
          result: "Improved detection and response capabilities."
        },
      ]}
      deliverables={[
        "Full operation timeline and narrative",
        "Attack path documentation with evidence",
        "Detection gap analysis report",
        "MITRE ATT&CK mapping",
        "Executive risk briefing",
        "Purple team improvement roadmap"
      ]}
      deliverablesNote="Complete visibility into how adversaries would target your organization."
      whyTrustUs={[
        "Experienced operators with government and military backgrounds",
        "Custom tooling and tradecraft that evades modern defenses",
        "Focus on realistic adversary simulation, not checkbox exercises",
        "Committed to improving your defenses, not just proving they fail"
      ]}
      stats={[
        { value: "150+", label: "Red Team Operations" },
        { value: "95%", label: "Initial Access Success" },
        { value: "24/7", label: "Operation Support" },
        { value: "100%", label: "Confidentiality" }
      ]}
      ctaTitle="Test Your Organization's Resilience"
      ctaDescription="Don't wait for a real breach to discover your weaknesses. Our red team will show you exactly how attackers would target your organization."
      ctaButtonText="Plan Red Team Exercise"
      accentColor="red"
    />
  );
};

export default RedTeamAssessment;
