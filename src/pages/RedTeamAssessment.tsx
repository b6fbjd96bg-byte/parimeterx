import { Target, Shield, Lock, Award, FileCheck, Search, BarChart3, FileText, Wrench, RefreshCw, Users, Eye, Wifi, Fingerprint, Swords, Radio } from "lucide-react";
import DetailedServicePageLayout from "@/components/DetailedServicePageLayout";
import RedTeamAnimation from "@/components/animations/RedTeamAnimation";

const RedTeamAssessment = () => {
  return (
    <DetailedServicePageLayout
      heroAnimation={<RedTeamAnimation />}
      icon={<Target className="h-8 w-8 text-[hsl(var(--color-red-team))]" />}
      title="Test Your Defenses Against Real-World Attacks"
      subtitle="Red Team Assessment"
      tagline="Traditional security testing finds vulnerabilities. Red team operations reveal whether your organization can detect, respond to, and survive a determined adversary."
      description="Our Red Team Assessments simulate sophisticated, multi-stage attacks using the same tactics, techniques, and procedures (TTPs) employed by advanced persistent threats (APTs) and organized cybercrime groups."
      extendedDescription="ParameterX red team operators bring government, military, and intelligence backgrounds to every engagement. We develop custom tools and tradecraft that bypass modern security controls—giving you an honest assessment of what a motivated adversary can achieve against your organization."
      trustIndicators={[
        { icon: Shield, label: "MITRE ATT&CK" },
        { icon: Lock, label: "TIBER-EU" },
        { icon: Award, label: "CBEST Certified" },
        { icon: FileCheck, label: "PTES Framework" },
      ]}
      keyFeatures={[
        { icon: Swords, title: "Full-Spectrum Attacks", description: "We combine cyber, physical, and social engineering attacks in coordinated campaigns—just like real adversaries." },
        { icon: Eye, title: "Stealth Operations", description: "Our operators use custom tooling and advanced evasion techniques to test your detection capabilities under realistic conditions." },
        { icon: Fingerprint, title: "Custom Tradecraft", description: "We develop unique attack tools and techniques for each engagement—no off-the-shelf exploits." },
        { icon: Radio, title: "Purple Team Integration", description: "We work alongside your blue team to improve detection rules, incident response, and security controls in real-time." },
        { icon: Wifi, title: "Physical & Wireless", description: "Beyond digital attacks, we test physical security, badge cloning, wireless networks, and facility intrusion." },
        { icon: Users, title: "Social Engineering", description: "Targeted phishing, vishing, pretexting, and physical social engineering against your employees." },
      ]}
      technologies={[
        { name: "Custom C2 Framework", category: "Command & Control" },
        { name: "Cobalt Strike", category: "Command & Control" },
        { name: "Sliver", category: "Command & Control" },
        { name: "Evilginx", category: "Phishing" },
        { name: "GoPhish", category: "Phishing" },
        { name: "Proxmark3", category: "Physical Security" },
        { name: "Flipper Zero", category: "Physical Security" },
        { name: "BloodHound", category: "AD Exploitation" },
        { name: "Rubeus", category: "AD Exploitation" },
        { name: "Certify", category: "AD Exploitation" },
        { name: "Custom Implants", category: "Proprietary" },
        { name: "AI Recon Engine", category: "Proprietary" },
      ]}
      companyHighlights={[
        "95% initial access success rate across all red team engagements—we get in like real attackers do",
        "Operators with government, military, and intelligence community backgrounds lead every operation",
        "Custom-developed tools and implants that bypass leading EDR, SIEM, and XDR solutions",
        "ParameterX has conducted red team operations for critical infrastructure, financial institutions, and defense organizations",
        "Every operation includes a comprehensive purple team phase to directly improve your detection and response capabilities",
        "We maintain strict operational security—our activities are indistinguishable from real threat actors",
      ]}
      approachTitle="Adversary Simulation Excellence"
      approachDescription="We don't just test your security controls—we test your people, processes, and technology together. Our red team operates like real adversaries, combining technical exploitation with social engineering and physical intrusion techniques to achieve defined objectives."
      whatWeTestTitle="What We Target"
      whatWeTestDescription="Full-spectrum adversary simulation covering all attack vectors that real threat actors use to compromise organizations."
      coreTestingAreas={[
        "Initial access via phishing, vishing, and social engineering",
        "External network and perimeter exploitation",
        "Physical security bypass and facility intrusion",
        "Privilege escalation and domain dominance",
        "Lateral movement and network pivoting",
        "Data exfiltration and objective achievement",
        "Detection evasion and persistence techniques",
        "Blue team coordination and purple team exercises",
        "Supply chain and third-party compromise simulation",
        "Ransomware simulation (controlled, safe environment)",
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
            "Simulated data exfiltration via covert channels",
            "Business process manipulation",
            "Ransomware simulation (controlled)",
            "Demonstration of attack impact on operations"
          ],
          result: "Proof of concept showing real-world consequences."
        },
        {
          icon: FileText,
          title: "Detection & Response Analysis",
          description: "We analyze what your defenses caught—and what they missed.",
          details: [
            "Timeline of activities vs. detection events",
            "Security tool effectiveness evaluation",
            "Incident response team assessment",
            "SOC and SIEM analysis with detection gap mapping"
          ],
          result: "Comprehensive view of detection and response capabilities."
        },
        {
          icon: RefreshCw,
          title: "Purple Team Collaboration",
          description: "We work with your team to build stronger defenses together.",
          details: [
            "Joint exercises with blue team using real attack data",
            "Detection rule development and tuning",
            "Incident response playbook refinement",
            "Security control optimization and gap closure"
          ],
          result: "Measurably improved detection and response capabilities."
        },
      ]}
      deliverables={[
        "Full operation timeline and narrative",
        "Attack path documentation with evidence",
        "Detection gap analysis report",
        "MITRE ATT&CK mapping",
        "Executive risk briefing deck",
        "Purple team improvement roadmap",
        "Custom detection rules for your SIEM",
        "Incident response playbook updates",
        "90-day post-operation support",
      ]}
      deliverablesNote="Complete visibility into how adversaries would target your organization—with concrete steps to stop them."
      whyTrustUs={[
        "Operators with government and military backgrounds who understand real adversary tradecraft",
        "Custom tooling and tradecraft that evades modern EDR, XDR, and SIEM solutions",
        "Focus on realistic adversary simulation, not checkbox exercises or compliance theater",
        "Committed to improving your defenses—every operation includes a purple team phase",
        "95% initial access success rate demonstrates the realism of our operations",
        "Trusted by critical infrastructure, defense, and financial sector organizations",
      ]}
      stats={[
        { value: "150+", label: "Red Team Operations" },
        { value: "95%", label: "Initial Access Success" },
        { value: "24/7", label: "Operation Support" },
        { value: "100%", label: "Confidentiality" }
      ]}
      ctaTitle="Test Your Organization's Resilience"
      ctaDescription="Don't wait for a real breach to discover your weaknesses. ParameterX red team will show you exactly how attackers would target your organization—and help you build defenses that stop them."
      ctaButtonText="Plan Red Team Exercise"
      accentColor="red"
    />
  );
};

export default RedTeamAssessment;
