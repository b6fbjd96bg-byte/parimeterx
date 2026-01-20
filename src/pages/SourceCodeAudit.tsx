import { Code, Shield, Lock, Award, FileCheck, Search, Target, BarChart3, FileText, Wrench, RefreshCw } from "lucide-react";
import DetailedServicePageLayout from "@/components/DetailedServicePageLayout";

const SourceCodeAudit = () => {
  return (
    <DetailedServicePageLayout
      icon={<Code className="h-8 w-8 text-[hsl(var(--color-purple-blockchain))]" />}
      title="Ensure Code Security From the Source"
      subtitle="Source Code Security Audit"
      tagline="Security vulnerabilities in source code are the root cause of most application breaches. Finding them before deployment is critical."
      description="Our Source Code Security Audit service provides deep analysis of your codebase to identify security vulnerabilities, insecure coding patterns, and architectural weaknesses that could be exploited by attackers."
      trustIndicators={[
        { icon: Shield, label: "OWASP ASVS" },
        { icon: Lock, label: "CWE/SANS Top 25" },
        { icon: Award, label: "CERT Guidelines" },
        { icon: FileCheck, label: "Secure SDLC" },
      ]}
      approachTitle="Beyond Automated Scanning"
      approachDescription="We combine automated static analysis with expert manual code review to find vulnerabilities that tools miss—including business logic flaws, race conditions, and subtle security issues that require human understanding of your application's context."
      whatWeTestTitle="What We Analyze"
      whatWeTestDescription="Comprehensive code security analysis covering all layers of your application."
      coreTestingAreas={[
        "Injection vulnerabilities (SQL, command, LDAP, XPath)",
        "Authentication and session management flaws",
        "Access control and authorization issues",
        "Cryptographic implementation weaknesses",
        "Sensitive data exposure and handling",
        "Error handling and information leakage",
        "Business logic and workflow vulnerabilities",
        "Third-party library and dependency risks"
      ]}
      coreTestingNote="Every finding is manually validated and includes code-level remediation guidance."
      processTitle="Our Code Review Process"
      processDescription="Systematic approach combining automated and manual analysis."
      processSteps={[
        {
          icon: Search,
          title: "Code & Architecture Analysis",
          description: "We understand your application's structure and security context.",
          details: [
            "Architecture and data flow analysis",
            "Technology stack assessment",
            "Security control identification",
            "High-risk area prioritization"
          ],
          result: "Targeted review focused on highest-risk code areas."
        },
        {
          icon: Target,
          title: "Automated Static Analysis",
          description: "We run comprehensive automated scanning tools.",
          details: [
            "Multi-tool static analysis scanning",
            "Dependency and library vulnerability checking",
            "Code quality and security metric analysis",
            "Custom rule development for your stack"
          ],
          result: "Broad coverage of known vulnerability patterns."
        },
        {
          icon: BarChart3,
          title: "Expert Manual Review",
          description: "Security experts review code for complex vulnerabilities.",
          details: [
            "Business logic and workflow analysis",
            "Authentication and authorization review",
            "Cryptographic implementation assessment",
            "Race condition and timing attack analysis"
          ],
          result: "Deep analysis finding vulnerabilities tools miss."
        },
        {
          icon: FileText,
          title: "Developer-Friendly Reporting",
          description: "Clear findings with code-level remediation guidance.",
          details: [
            "Specific file and line number references",
            "Secure code examples and patterns",
            "Priority ranking by risk and effort",
            "Integration with issue tracking systems"
          ],
          result: "Reports developers can immediately act on."
        },
        {
          icon: Wrench,
          title: "Remediation Support",
          description: "We help your team fix identified issues.",
          details: [
            "Developer consultation and guidance",
            "Secure coding pattern recommendations",
            "Code fix review and validation"
          ],
          result: "Verified security improvements in your codebase."
        },
        {
          icon: RefreshCw,
          title: "Secure Development Integration",
          description: "We help embed security into your development process.",
          details: [
            "CI/CD security integration guidance",
            "Secure coding training recommendations",
            "Code review process improvement"
          ],
          result: "Sustained code security through secure development practices."
        },
      ]}
      deliverables={[
        "Comprehensive code security report",
        "Vulnerability findings with code references",
        "Secure code remediation examples",
        "Dependency vulnerability analysis",
        "Architecture security recommendations",
        "Developer security guidance"
      ]}
      deliverablesNote="Code-level findings that developers can immediately act on."
      whyTrustUs={[
        "Deep expertise across multiple programming languages and frameworks",
        "Combination of automated tools and expert manual review",
        "Understanding of secure development lifecycle practices",
        "Focus on actionable findings, not noise from automated scanners"
      ]}
      stats={[
        { value: "250+", label: "Code Audits Completed" },
        { value: "5M+", label: "Lines of Code Reviewed" },
        { value: "15+", label: "Languages Supported" },
        { value: "99%", label: "Client Satisfaction" }
      ]}
      ctaTitle="Secure Your Code Before Deployment"
      ctaDescription="Vulnerabilities in source code are cheaper to fix during development than after a breach. Invest in code security now."
      ctaButtonText="Start Code Audit"
      accentColor="purple"
    />
  );
};

export default SourceCodeAudit;
