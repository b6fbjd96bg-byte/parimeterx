import { Brain, Shield, Lock, Award, FileCheck, Search, Target, BarChart3, FileText, Wrench, RefreshCw } from "lucide-react";
import DetailedServicePageLayout from "@/components/DetailedServicePageLayout";
import AISecurityAnimation from "@/components/animations/AISecurityAnimation";

const AISecurityAssessment = () => {
  return (
    <DetailedServicePageLayout
      heroAnimation={<AISecurityAnimation />}
      icon={<Brain className="h-8 w-8 text-[hsl(var(--color-purple-blockchain))]" />}
      title="Secure Your AI Systems Against Novel Attacks"
      subtitle="AI Security Assessment"
      tagline="Large Language Models and AI systems introduce entirely new attack surfaces—from prompt injection to model manipulation and data poisoning."
      description="Our AI Security Assessment service identifies critical vulnerabilities in production LLMs, machine learning models, and AI-powered applications that expose novel attack paths traditional security testing doesn't cover."
      trustIndicators={[
        { icon: Shield, label: "OWASP LLM Top 10" },
        { icon: Lock, label: "NIST AI RMF" },
        { icon: Award, label: "AI Security Expert" },
        { icon: FileCheck, label: "ML Security Research" },
      ]}
      approachTitle="AI-Native Security Testing"
      approachDescription="We understand AI systems deeply—from model architecture to prompt engineering to the unique ways AI applications can be manipulated. Our assessments cover threats specific to AI that traditional security testing completely misses."
      whatWeTestTitle="What We Assess"
      whatWeTestDescription="Comprehensive AI security testing covering models, applications, and the AI development lifecycle."
      coreTestingAreas={[
        "Prompt injection and jailbreaking attacks",
        "Data poisoning and training manipulation",
        "Model extraction and intellectual property theft",
        "Adversarial input and evasion techniques",
        "RAG and knowledge base security",
        "AI agent and tool use vulnerabilities",
        "Sensitive data leakage through outputs",
        "Supply chain security for AI/ML pipelines"
      ]}
      coreTestingNote="Our AI security assessments are customized for your specific models, use cases, and risk tolerance."
      processTitle="Our AI Assessment Process"
      processDescription="Purpose-built methodology for AI and ML security."
      processSteps={[
        {
          icon: Search,
          title: "AI System Analysis",
          description: "We understand your AI architecture and security context.",
          details: [
            "Model architecture and capability assessment",
            "Data flow and training pipeline analysis",
            "Integration and API surface mapping",
            "AI-specific threat modeling"
          ],
          result: "Complete understanding of your AI attack surface."
        },
        {
          icon: Target,
          title: "Prompt & Input Attacks",
          description: "We test for prompt injection and input manipulation.",
          details: [
            "Direct and indirect prompt injection testing",
            "Jailbreaking and guardrail bypass",
            "System prompt extraction attempts",
            "Context manipulation and confusion attacks"
          ],
          result: "Validated prompt security and guardrail effectiveness."
        },
        {
          icon: BarChart3,
          title: "Model & Data Security",
          description: "We assess model security and data protection.",
          details: [
            "Model extraction and cloning attempts",
            "Training data inference attacks",
            "Sensitive data leakage testing",
            "RAG and knowledge base manipulation"
          ],
          result: "Understanding of model and data exposure risks."
        },
        {
          icon: FileText,
          title: "AI Security Reporting",
          description: "Clear findings with AI-specific remediation guidance.",
          details: [
            "Prompt engineering security recommendations",
            "Guardrail improvement guidance",
            "Model hardening strategies",
            "AI security architecture advice"
          ],
          result: "Actionable roadmap for AI security improvement."
        },
        {
          icon: Wrench,
          title: "Guardrail Validation",
          description: "We verify that AI security controls are effective.",
          details: [
            "Updated guardrail testing",
            "Prompt filtering validation",
            "Output sanitization verification"
          ],
          result: "Confirmed AI security improvements."
        },
        {
          icon: RefreshCw,
          title: "Continuous AI Security",
          description: "Ongoing guidance as AI threats evolve.",
          details: [
            "Emerging threat monitoring",
            "Security review for model updates",
            "AI security training for teams"
          ],
          result: "Sustained AI security as threats and models evolve."
        },
      ]}
      deliverables={[
        "Comprehensive AI security report",
        "Prompt injection vulnerability findings",
        "Model security analysis",
        "Data leakage assessment",
        "Guardrail improvement recommendations",
        "AI security architecture guidance"
      ]}
      deliverablesNote="AI-native security findings for cutting-edge AI applications."
      whyTrustUs={[
        "Deep expertise in LLMs, ML models, and AI security research",
        "Understanding of emerging AI threats and attack techniques",
        "Experience securing AI applications across industries",
        "Commitment to advancing the field of AI security"
      ]}
      stats={[
        { value: "100+", label: "AI Systems Assessed" },
        { value: "50+", label: "LLMs Tested" },
        { value: "24/7", label: "AI Expert Support" },
        { value: "95%", label: "Client Satisfaction" }
      ]}
      ctaTitle="Secure Your AI Before Attackers Exploit It"
      ctaDescription="AI systems face novel threats that traditional security can't detect. Protect your AI investment with specialized security testing."
      ctaButtonText="Start AI Assessment"
      accentColor="purple"
    />
  );
};

export default AISecurityAssessment;
