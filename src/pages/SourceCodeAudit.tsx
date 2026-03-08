import { Code, Shield, Lock, Award, FileCheck, Search, Target, BarChart3, FileText, Wrench, RefreshCw, GitBranch, Braces, Bug, FileCode, ShieldCheck } from "lucide-react";
import DetailedServicePageLayout from "@/components/DetailedServicePageLayout";
import SourceCodeAuditAnimation from "@/components/animations/SourceCodeAuditAnimation";

const SourceCodeAudit = () => {
  return (
    <DetailedServicePageLayout
      heroAnimation={<SourceCodeAuditAnimation />}
      icon={<Code className="h-8 w-8 text-[hsl(var(--color-purple-blockchain))]" />}
      title="Ensure Code Security From the Source"
      subtitle="Source Code Security Audit"
      tagline="Security vulnerabilities in source code are the root cause of most application breaches. Finding them before deployment is critical."
      description="Our Source Code Security Audit service provides deep analysis of your codebase to identify security vulnerabilities, insecure coding patterns, and architectural weaknesses that could be exploited by attackers."
      extendedDescription="ParameterX code auditors have reviewed over 5 million lines of code across 15+ programming languages. We combine automated static analysis with expert manual review to find vulnerabilities that tools miss—including business logic flaws, race conditions, and subtle cryptographic weaknesses."
      trustIndicators={[
        { icon: Shield, label: "OWASP ASVS" },
        { icon: Lock, label: "CWE/SANS Top 25" },
        { icon: Award, label: "CERT Guidelines" },
        { icon: FileCheck, label: "Secure SDLC" },
      ]}
      keyFeatures={[
        { icon: Braces, title: "15+ Languages", description: "Expert review across Python, Java, JavaScript, TypeScript, Go, Rust, C/C++, PHP, Ruby, Swift, Kotlin, and more." },
        { icon: GitBranch, title: "CI/CD Integration", description: "We integrate security checks into your build pipeline with custom rules that catch vulnerabilities before merge." },
        { icon: Bug, title: "Logic Flaw Detection", description: "Manual review catches business logic vulnerabilities, race conditions, and timing attacks that static analysis misses." },
        { icon: FileCode, title: "Dependency Audit", description: "Complete SCA analysis of third-party libraries, transitive dependencies, and known CVE identification." },
        { icon: ShieldCheck, title: "Secure Code Examples", description: "Every finding includes secure code alternatives your developers can copy-paste directly into your codebase." },
        { icon: RefreshCw, title: "Developer Training", description: "Optional secure coding workshops customized to your stack and the vulnerability patterns found in your code." },
      ]}
      technologies={[
        { name: "Semgrep", category: "Static Analysis" },
        { name: "CodeQL", category: "Static Analysis" },
        { name: "SonarQube", category: "Static Analysis" },
        { name: "Checkmarx", category: "Static Analysis" },
        { name: "Snyk", category: "SCA" },
        { name: "OWASP Dependency-Check", category: "SCA" },
        { name: "Bandit (Python)", category: "Language-Specific" },
        { name: "Brakeman (Ruby)", category: "Language-Specific" },
        { name: "SpotBugs (Java)", category: "Language-Specific" },
        { name: "Custom Rule Engine", category: "Proprietary" },
        { name: "AI Code Reviewer", category: "Proprietary" },
      ]}
      companyHighlights={[
        "250+ code audits completed with over 5 million lines of code reviewed across 15+ languages",
        "Our auditors have contributed to OWASP projects and published research on secure coding practices",
        "Average audit identifies 8+ critical security issues including logic flaws invisible to automated tools",
        "We provide secure code examples in your language/framework—not generic recommendations",
        "CI/CD integration deliverables help you catch similar vulnerabilities automatically in future code",
        "ParameterX offers optional secure coding workshops to upskill your development team",
      ]}
      approachTitle="Beyond Automated Scanning"
      approachDescription="We combine automated static analysis with expert manual code review to find vulnerabilities that tools miss—including business logic flaws, race conditions, and subtle security issues that require human understanding of your application's context and business requirements."
      whatWeTestTitle="What We Analyze"
      whatWeTestDescription="Comprehensive code security analysis covering all layers of your application."
      coreTestingAreas={[
        "Injection vulnerabilities (SQL, command, LDAP, XPath, SSTI)",
        "Authentication and session management flaws",
        "Access control and authorization issues",
        "Cryptographic implementation weaknesses",
        "Sensitive data exposure and handling",
        "Error handling and information leakage",
        "Business logic and workflow vulnerabilities",
        "Third-party library and dependency risks",
        "Race conditions and concurrency issues",
        "Deserialization and object injection vulnerabilities",
      ]}
      coreTestingNote="Every finding is manually validated and includes code-level remediation guidance with secure alternatives."
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
          description: "We run comprehensive automated scanning tools with custom rules.",
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
          description: "Security experts review code for complex vulnerabilities tools can't find.",
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
            "Secure code examples and patterns in your language",
            "Priority ranking by risk and effort",
            "Integration with issue tracking systems (Jira, GitHub)"
          ],
          result: "Reports developers can immediately act on."
        },
        {
          icon: Wrench,
          title: "Remediation Support",
          description: "We help your team fix identified issues correctly.",
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
          description: "We help embed security into your development process permanently.",
          details: [
            "CI/CD security integration with custom rules",
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
        "Developer security guidance",
        "CI/CD security integration rules",
        "Custom static analysis configurations",
        "Optional developer training materials",
      ]}
      deliverablesNote="Code-level findings with secure alternatives that developers can immediately implement."
      whyTrustUs={[
        "Deep expertise across 15+ programming languages and major frameworks (React, Django, Spring, etc.)",
        "Combination of automated tools and expert manual review catches what scanners miss",
        "Understanding of secure development lifecycle practices and CI/CD security integration",
        "Focus on actionable findings with copy-paste secure code examples—not noise from automated scanners",
        "Our auditors contribute to OWASP and have published security research",
        "Average audit finds 8+ critical issues that would have been deployed to production",
      ]}
      stats={[
        { value: "250+", label: "Code Audits Completed" },
        { value: "5M+", label: "Lines of Code Reviewed" },
        { value: "15+", label: "Languages Supported" },
        { value: "99%", label: "Client Satisfaction" }
      ]}
      ctaTitle="Secure Your Code Before Deployment"
      ctaDescription="Vulnerabilities in source code are 10x cheaper to fix during development than after a breach. Invest in code security now with ParameterX."
      ctaButtonText="Start Code Audit"
      accentColor="purple"
    />
  );
};

export default SourceCodeAudit;
