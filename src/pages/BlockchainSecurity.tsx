import { Boxes } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const BlockchainSecurity = () => {
  return (
    <ServicePageLayout
      icon={<Boxes className="h-8 w-8 text-primary" />}
      title="Blockchain & Web3 Security"
      subtitle="Smart Contract Auditing"
      description="Security testing for blockchain applications and smart contracts to prevent irreversible exploits. Our experts analyze your decentralized applications, DeFi protocols, and NFT platforms to identify vulnerabilities before they can be exploited by attackers."
      features={[
        "Smart contract security auditing and testing",
        "Reentrancy and logic flaw detection",
        "Flash loan attack simulation and prevention",
        "Oracle manipulation testing",
        "DeFi protocol security assessment",
        "NFT platform security review",
        "Token economics and governance analysis",
        "Cross-chain bridge security evaluation",
      ]}
      benefits={[
        "Prevent irreversible smart contract exploits",
        "Protect user funds and platform reputation",
        "Ensure compliance with Web3 security standards",
        "Build trust with your DeFi community",
        "Identify vulnerabilities before mainnet deployment",
        "Receive detailed audit reports for transparency",
      ]}
      ctaText="Audit Your Smart Contract"
      accentColor="purple"
    />
  );
};

export default BlockchainSecurity;
