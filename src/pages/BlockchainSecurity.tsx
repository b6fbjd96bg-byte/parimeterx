import { Boxes, Shield, Lock, Award, FileCheck, Search, Zap, AlertTriangle, Eye, Database, Coins } from "lucide-react";
import DetailedServicePageLayout from "@/components/DetailedServicePageLayout";
import BlockchainSecurityAnimation from "@/components/animations/BlockchainSecurityAnimation";

const BlockchainSecurity = () => {
  return (
    <DetailedServicePageLayout
      icon={<Boxes className="h-8 w-8 text-[hsl(var(--color-purple-blockchain))]" />}
      title="Web3 & Blockchain Security"
      subtitle="Smart Contract Auditing"
      tagline="Secure decentralized systems where a single bug can cost millions."
      description="ParameterX provides end-to-end blockchain security services for Web3 startups, DeFi protocols, NFT platforms, exchanges, and enterprises building on blockchain. Our security approach combines manual expert auditing, red-team attack simulation, and business-logic analysis to protect both code and capital."
      extendedDescription="In blockchain systems, code is immutable and transactions are irreversible. A single vulnerability can lead to permanent fund loss, protocol collapse, or governance takeover. Traditional security testing is not enough — blockchain security requires deep understanding of smart contracts, cryptography, token economics, and adversarial financial attacks."
      trustIndicators={[
        { icon: Shield, label: "Smart Contract Experts" },
        { icon: Lock, label: "DeFi Protocol Security" },
        { icon: Award, label: "Web3 Certified" },
        { icon: FileCheck, label: "Audit Reports" },
      ]}
      approachTitle="Attack-Driven Blockchain Security"
      approachDescription="We combine manual expert auditing with automated tools and economic attack simulations to identify vulnerabilities that traditional scanners miss. Our team thinks like attackers to protect your protocol and users' funds."
      whatWeTestTitle="Comprehensive Blockchain Testing"
      whatWeTestDescription="We secure the entire Web3 stack — from smart contracts to frontend dApps, from token economics to infrastructure."
      coreTestingAreas={[
        "Reentrancy and flash-loan vulnerabilities",
        "Business-logic and financial flow flaws",
        "Access-control and ownership issues",
        "Arithmetic errors (overflow/underflow)",
        "Upgradeability and proxy risks",
        "Oracle manipulation attacks",
        "Gas-related DoS attacks",
        "MEV and front-running risks",
        "Signature replay attacks",
        "Client-side transaction manipulation",
        "Cross-chain bridge security",
        "Governance and voting vulnerabilities",
      ]}
      coreTestingNote="We also analyze tokenomics, vesting contracts, and DAO governance models to identify economic attack vectors."
      processTitle="Our Blockchain Security Process"
      processDescription="A rigorous, multi-phase approach to securing your decentralized applications and smart contracts."
      processSteps={[
        {
          icon: Search,
          title: "Reconnaissance & Scoping",
          description: "We analyze your protocol architecture, smart contracts, and business logic.",
          details: [
            "Review contract architecture and dependencies",
            "Map token flows and economic incentives",
            "Identify privileged roles and access patterns",
            "Document integration points and oracles",
          ],
          result: "Complete understanding of protocol attack surface",
        },
        {
          icon: Eye,
          title: "Manual Code Review",
          description: "Line-by-line expert review of Solidity, Rust, or Move contracts.",
          details: [
            "Reentrancy pattern analysis",
            "State machine validation",
            "External call security review",
            "Upgradeability mechanism audit",
          ],
          result: "Deep code-level vulnerability identification",
        },
        {
          icon: Zap,
          title: "Automated Security Analysis",
          description: "We run multiple automated tools and custom analyzers on your codebase.",
          details: [
            "Static analysis with Slither, Mythril, Securify",
            "Formal verification where applicable",
            "Gas optimization analysis",
            "Known vulnerability pattern matching",
          ],
          result: "Comprehensive automated findings cross-referenced with manual review",
        },
        {
          icon: AlertTriangle,
          title: "Economic Attack Simulation",
          description: "We simulate real-world financial attacks against your protocol.",
          details: [
            "Flash-loan exploitation scenarios",
            "Oracle price manipulation testing",
            "Liquidity drain attack modeling",
            "Governance takeover simulations",
          ],
          result: "Validated resilience against DeFi-specific attacks",
        },
        {
          icon: Database,
          title: "Infrastructure & dApp Review",
          description: "Beyond contracts, we secure your entire Web3 stack.",
          details: [
            "Frontend application security",
            "Wallet integration vulnerabilities",
            "API and backend security",
            "RPC endpoint and node security",
          ],
          result: "End-to-end security across your Web3 application",
        },
        {
          icon: Coins,
          title: "Remediation & Re-Audit",
          description: "We provide fix recommendations and verify your patches.",
          details: [
            "Severity-prioritized remediation guidance",
            "Proof-of-concept exploit demonstrations",
            "Developer support for complex fixes",
            "Optional re-audit to confirm resolution",
          ],
          result: "Verified secure protocol ready for deployment",
        },
      ]}
      deliverables={[
        "Severity-based vulnerability report",
        "Proof-of-Concept exploits",
        "Remediation guidance",
        "Economic attack analysis",
        "Gas optimization recommendations",
        "Re-audit after fixes",
        "Public audit report (optional)",
        "Security certification badge",
        "Continuous monitoring setup",
      ]}
      deliverablesNote="All reports are investor-ready and can be published for transparency."
      whyTrustUs={[
        "Expert-driven manual audits (not tool-only scans)",
        "Red-team mindset focused on real attacker behavior",
        "Strong background in business-logic and API security",
        "Clear, actionable reports for developers and investors",
        "Security designed for both startups and enterprises",
        "Deep understanding of DeFi protocols and token economics",
        "Experience with cross-chain bridges and L2 solutions",
        "Post-audit support and incident response",
      ]}
      stats={[
        { value: "500+", label: "Smart Contracts Audited" },
        { value: "$2B+", label: "TVL Protected" },
        { value: "150+", label: "Critical Bugs Found" },
        { value: "24/7", label: "Incident Response" },
      ]}
      ctaTitle="Secure Your Web3 Protocol"
      ctaDescription="Whether you are launching a new protocol or securing an existing one, ParameterX helps you build trust, resilience, and long-term security into your blockchain systems."
      ctaButtonText="Request Smart Contract Audit"
      accentColor="purple"
      heroAnimation={<BlockchainSecurityAnimation />}
    />
  );
};

export default BlockchainSecurity;
