import { Boxes, Shield, Lock, Award, FileCheck, Search, Zap, AlertTriangle, Eye, Database, Coins, Code, GitBranch, Layers, ShieldCheck } from "lucide-react";
import DetailedServicePageLayout from "@/components/DetailedServicePageLayout";
import BlockchainSecurityAnimation from "@/components/animations/BlockchainSecurityAnimation";

const BlockchainSecurity = () => {
  return (
    <DetailedServicePageLayout
      icon={<Boxes className="h-8 w-8 text-[hsl(var(--color-purple-blockchain))]" />}
      title="Web3 & Blockchain Security"
      subtitle="Smart Contract Auditing"
      tagline="Secure decentralized systems where a single bug can cost millions."
      description="Smart contract auditing, DeFi protocol security, and full Web3 stack assessments across all major chains."
      extendedDescription="In blockchain systems, code is immutable and transactions are irreversible. A single vulnerability can lead to permanent fund loss, protocol collapse, or governance takeover. ParameterX has audited 500+ smart contracts and protected over $2B in total value locked—our audits are trusted by investors, users, and the Web3 community."
      trustIndicators={[
        { icon: Shield, label: "Smart Contract Experts" },
        { icon: Lock, label: "DeFi Protocol Security" },
        { icon: Award, label: "Web3 Certified" },
        { icon: FileCheck, label: "Audit Reports" },
      ]}
      keyFeatures={[
        { icon: Code, title: "Multi-Chain Expertise", description: "We audit Solidity, Rust (Solana/Near), Move (Aptos/Sui), Vyper, and Cairo smart contracts across all major chains." },
        { icon: Zap, title: "Flash Loan Simulation", description: "We simulate complex DeFi attacks including flash loans, oracle manipulation, and MEV exploitation scenarios." },
        { icon: GitBranch, title: "Formal Verification", description: "Mathematical proofs for critical contract functions ensure correctness beyond what testing alone can achieve." },
        { icon: Layers, title: "Cross-Chain Security", description: "We assess bridge protocols, cross-chain messaging, and multi-chain deployment risks." },
        { icon: ShieldCheck, title: "Public Audit Reports", description: "Investor-ready audit reports that build trust and transparency with your community." },
        { icon: Coins, title: "Tokenomics Analysis", description: "We analyze token economics, vesting schedules, and governance models for economic attack vectors." },
      ]}
      technologies={[
        { name: "Slither", category: "Static Analysis" },
        { name: "Mythril", category: "Static Analysis" },
        { name: "Securify", category: "Static Analysis" },
        { name: "Echidna", category: "Fuzzing" },
        { name: "Foundry", category: "Fuzzing" },
        { name: "Halmos", category: "Formal Verification" },
        { name: "Certora", category: "Formal Verification" },
        { name: "Hardhat", category: "Development" },
        { name: "Foundry", category: "Development" },
        { name: "Tenderly", category: "Simulation" },
        { name: "Custom DeFi Simulator", category: "Proprietary" },
      ]}
      companyHighlights={[
        "500+ smart contracts audited with over $2B in total value locked protected across major chains",
        "Zero exploited contracts post-audit—our track record speaks for itself",
        "ParameterX auditors have discovered and reported critical vulnerabilities in top DeFi protocols",
        "We provide formal verification for critical contract functions—mathematical proof of correctness",
        "Public audit reports available for community transparency and investor confidence",
        "Post-audit monitoring and incident response support for deployed protocols",
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
            "Fuzz testing with Echidna and Foundry",
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
            "Full re-audit to confirm resolution",
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
      deliverablesNote="All reports are investor-ready and can be published for community transparency."
      whyTrustUs={[
        "Expert-driven manual audits with zero exploited contracts post-audit track record",
        "Red-team mindset focused on real attacker behavior and economic attack vectors",
        "Deep understanding of DeFi protocols, token economics, and governance models",
        "Clear, actionable reports for developers, investors, and the community",
        "Multi-chain expertise: Solidity, Rust, Move, Vyper, and Cairo",
        "Formal verification capabilities for mathematically proven contract correctness",
        "Experience with cross-chain bridges, L2 solutions, and emerging blockchain architectures",
        "Post-audit monitoring and incident response for deployed protocols",
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
