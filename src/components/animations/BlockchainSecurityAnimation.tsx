import { useEffect, useState } from "react";

const BlockchainSecurityAnimation = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [activeBlock, setActiveBlock] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState<number[]>([]);
  const [securedBlocks, setSecuredBlocks] = useState<number[]>([]);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanProgress(prev => (prev + 1) % 100);
    }, 50);

    const blockInterval = setInterval(() => {
      setActiveBlock(prev => (prev + 1) % 5);
    }, 800);

    const vulnInterval = setInterval(() => {
      const randomBlock = Math.floor(Math.random() * 5);
      setVulnerabilities(prev => 
        prev.includes(randomBlock) ? prev : [...prev, randomBlock]
      );
      
      setTimeout(() => {
        setSecuredBlocks(prev => 
          prev.includes(randomBlock) ? prev : [...prev, randomBlock]
        );
        setTimeout(() => {
          setVulnerabilities(prev => prev.filter(v => v !== randomBlock));
          setSecuredBlocks(prev => prev.filter(s => s !== randomBlock));
        }, 1000);
      }, 600);
    }, 2000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(blockInterval);
      clearInterval(vulnInterval);
    };
  }, []);

  const blocks = [
    { id: 0, label: "Genesis", hash: "0x7f8..." },
    { id: 1, label: "Block #1", hash: "0xa3b..." },
    { id: 2, label: "Block #2", hash: "0xc9d..." },
    { id: 3, label: "Block #3", hash: "0xe1f..." },
    { id: 4, label: "Block #4", hash: "0x2a4..." },
  ];

  const smartContracts = [
    { name: "DEX.sol", status: "auditing" },
    { name: "Vault.sol", status: "secure" },
    { name: "Token.sol", status: "scanning" },
  ];

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-[hsl(var(--color-purple-blockchain)/0.1)] to-background p-6 overflow-hidden">
      {/* Blockchain visualization */}
      <div className="absolute top-8 left-0 right-0 flex items-center justify-center gap-2">
        {blocks.map((block, index) => (
          <div key={block.id} className="flex items-center">
            {/* Block */}
            <div 
              className={`relative w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                activeBlock === index 
                  ? "border-[hsl(var(--color-purple-blockchain))] bg-[hsl(var(--color-purple-blockchain)/0.2)] scale-110 shadow-[0_0_20px_hsl(var(--color-purple-blockchain)/0.5)]" 
                  : securedBlocks.includes(index)
                    ? "border-[hsl(var(--color-green-secure))] bg-[hsl(var(--color-green-secure)/0.1)]"
                    : vulnerabilities.includes(index)
                      ? "border-[hsl(var(--color-red-team))] bg-[hsl(var(--color-red-team)/0.1)] animate-pulse"
                      : "border-border/50 bg-card/50"
              }`}
            >
              <span className="text-[8px] font-mono text-muted-foreground">{block.label}</span>
              <span className="text-[6px] font-mono text-primary/60">{block.hash}</span>
              
              {/* Vulnerability indicator */}
              {vulnerabilities.includes(index) && !securedBlocks.includes(index) && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[hsl(var(--color-red-team))] rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-[8px] text-white">!</span>
                </div>
              )}
              
              {/* Secured indicator */}
              {securedBlocks.includes(index) && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[hsl(var(--color-green-secure))] rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white">✓</span>
                </div>
              )}
            </div>
            
            {/* Chain link */}
            {index < blocks.length - 1 && (
              <div className={`w-4 h-0.5 transition-colors duration-300 ${
                activeBlock > index 
                  ? "bg-[hsl(var(--color-purple-blockchain))]" 
                  : "bg-border/50"
              }`}>
                <div 
                  className="h-full bg-[hsl(var(--color-purple-blockchain))]"
                  style={{ 
                    width: activeBlock === index ? `${scanProgress}%` : activeBlock > index ? "100%" : "0%",
                    transition: "width 0.05s linear"
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Smart Contract Audit Panel */}
      <div className="absolute bottom-8 left-6 right-6">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--color-purple-blockchain))] animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">Smart Contract Security Audit</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {smartContracts.map((contract, index) => (
              <div 
                key={contract.name}
                className={`text-center p-2 rounded border transition-all duration-500 ${
                  contract.status === "secure" 
                    ? "border-[hsl(var(--color-green-secure)/0.5)] bg-[hsl(var(--color-green-secure)/0.1)]"
                    : contract.status === "auditing"
                      ? "border-[hsl(var(--color-purple-blockchain)/0.5)] bg-[hsl(var(--color-purple-blockchain)/0.1)]"
                      : "border-border/50 bg-card/50"
                }`}
              >
                <div className="text-xs font-mono mb-1">{contract.name}</div>
                <div className={`text-[10px] uppercase tracking-wider ${
                  contract.status === "secure" 
                    ? "text-[hsl(var(--color-green-secure))]"
                    : contract.status === "auditing"
                      ? "text-[hsl(var(--color-purple-blockchain))]"
                      : "text-muted-foreground"
                }`}>
                  {contract.status === "auditing" && "● "}
                  {contract.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating security elements */}
      <div className="absolute top-24 left-8 text-[10px] font-mono text-[hsl(var(--color-purple-blockchain)/0.6)] animate-pulse">
        reentrancy check...
      </div>
      <div className="absolute top-32 right-8 text-[10px] font-mono text-[hsl(var(--color-green-secure)/0.6)]">
        ✓ access control
      </div>
      <div className="absolute top-40 left-12 text-[10px] font-mono text-muted-foreground/40">
        oracle validation
      </div>

      {/* Network effect lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="blockchain-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--color-purple-blockchain))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--color-purple-blockchain))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--color-purple-blockchain))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line 
          x1="0" y1="140" x2="100%" y2="140" 
          stroke="url(#blockchain-gradient)" 
          strokeWidth="1"
          strokeDasharray="4 4"
        >
          <animate 
            attributeName="stroke-dashoffset" 
            values="0;8" 
            dur="1s" 
            repeatCount="indefinite" 
          />
        </line>
      </svg>
    </div>
  );
};

export default BlockchainSecurityAnimation;
