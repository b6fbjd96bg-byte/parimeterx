import { Brain, Shield, Lock, Award, FileCheck, Search, Target, BarChart3, FileText, Wrench, RefreshCw, MessageSquare, Database, Bot, Sparkles, ShieldCheck } from "lucide-react";
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
      extendedDescription="ParameterX AI security researchers are at the forefront of this emerging field. We've assessed 100+ AI systems including chatbots, RAG applications, AI agents, and custom ML models—discovering vulnerabilities ranging from prompt injection to complete model extraction and data poisoning."
      trustIndicators={[
        { icon: Shield, label: "OWASP LLM Top 10" },
        { icon: Lock, label: "NIST AI RMF" },
        { icon: Award, label: "AI Security Expert" },
        { icon: FileCheck, label: "ML Security Research" },
      ]}
      keyFeatures={[
        { icon: MessageSquare, title: "Prompt Injection Testing", description: "Advanced direct and indirect prompt injection attacks including multi-turn jailbreaks and context manipulation." },
        { icon: Database, title: "RAG Security", description: "We test knowledge base poisoning, retrieval manipulation, and data leakage through RAG-augmented systems." },
        { icon: Bot, title: "AI Agent Security", description: "Testing AI agents for tool misuse, permission escalation, and unintended actions through adversarial inputs." },
        { icon: Sparkles, title: "Guardrail Bypass", description: "We systematically attempt to bypass content filters, safety guardrails, and alignment boundaries." },
        { icon: ShieldCheck, title: "Data Leakage Detection", description: "Testing for training data extraction, PII leakage, and sensitive information exposure through outputs." },
        { icon: Target, title: "Adversarial ML", description: "Model evasion, poisoning, and extraction attacks against traditional ML and deep learning models." },
      ]}
      technologies={[
        { name: "Garak", category: "LLM Testing" },
        { name: "PyRIT", category: "LLM Testing" },
        { name: "Custom Jailbreak Framework", category: "LLM Testing" },
        { name: "Adversarial Robustness Toolbox", category: "ML Security" },
        { name: "Foolbox", category: "ML Security" },
        { name: "CleverHans", category: "ML Security" },
        { name: "LangChain", category: "AI Framework Analysis" },
        { name: "LlamaIndex", category: "AI Framework Analysis" },
        { name: "Custom Red Team Bot", category: "Proprietary" },
        { name: "AI Attack Engine", category: "Proprietary" },
      ]}
      companyHighlights={[
        "100+ AI systems assessed including LLMs, RAG applications, AI agents, and custom ML models",
        "ParameterX researchers have published findings on novel AI attack vectors at security conferences",
        "We maintain an internal red team AI that continuously evolves new jailbreak and prompt injection techniques",
        "Experience securing AI systems for financial services, healthcare, legal, and enterprise SaaS companies",
        "Our assessments have prevented AI systems from leaking customer PII, financial data, and trade secrets",
        "Ongoing AI threat intelligence monitoring keeps our assessment methodology ahead of emerging attacks",
      ]}
      approachTitle="AI-Native Security Testing"
      approachDescription="We understand AI systems deeply—from model architecture to prompt engineering to the unique ways AI applications can be manipulated. Our assessments cover threats specific to AI that traditional security testing completely misses, using both automated and human-driven attack techniques."
      whatWeTestTitle="What We Assess"
      whatWeTestDescription="Comprehensive AI security testing covering models, applications, and the AI development lifecycle."
      coreTestingAreas={[
        "Prompt injection and jailbreaking attacks (direct & indirect)",
        "Data poisoning and training manipulation",
        "Model extraction and intellectual property theft",
        "Adversarial input and evasion techniques",
        "RAG and knowledge base security",
        "AI agent and tool use vulnerabilities",
        "Sensitive data leakage through outputs",
        "Supply chain security for AI/ML pipelines",
        "Multi-modal attack vectors (text, image, audio)",
        "AI governance and compliance alignment",
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
          description: "We test for prompt injection and input manipulation across all vectors.",
          details: [
            "Direct and indirect prompt injection testing",
            "Multi-turn jailbreaking and guardrail bypass",
            "System prompt extraction attempts",
            "Context manipulation and confusion attacks"
          ],
          result: "Validated prompt security and guardrail effectiveness."
        },
        {
          icon: BarChart3,
          title: "Model & Data Security",
          description: "We assess model security and data protection boundaries.",
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
          description: "Ongoing guidance as AI threats evolve rapidly.",
          details: [
            "Emerging threat monitoring and briefings",
            "Security review for model updates",
            "AI security training for your team"
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
        "AI security architecture guidance",
        "Jailbreak technique documentation",
        "AI governance compliance mapping",
        "Ongoing threat intelligence updates",
      ]}
      deliverablesNote="AI-native security findings with practical remediation for cutting-edge AI applications."
      whyTrustUs={[
        "Deep expertise in LLMs, ML models, and AI security research with published findings",
        "Understanding of emerging AI threats and attack techniques that evolve weekly",
        "Experience securing AI applications across financial, healthcare, legal, and enterprise sectors",
        "Commitment to advancing the field of AI security through research and responsible disclosure",
        "Custom red team AI that continuously develops new attack techniques",
        "Practical remediation guidance that balances security with AI capability and user experience",
      ]}
      stats={[
        { value: "100+", label: "AI Systems Assessed" },
        { value: "50+", label: "LLMs Tested" },
        { value: "24/7", label: "AI Expert Support" },
        { value: "95%", label: "Client Satisfaction" }
      ]}
      ctaTitle="Secure Your AI Before Attackers Exploit It"
      ctaDescription="AI systems face novel threats that traditional security can't detect. ParameterX provides specialized AI security testing to protect your AI investment and your users' data."
      ctaButtonText="Start AI Assessment"
      accentColor="purple"
    />
  );
};

export default AISecurityAssessment;
