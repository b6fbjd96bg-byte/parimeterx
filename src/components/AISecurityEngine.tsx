import { Brain, Globe, Server, Cloud, Boxes, Scan, Shield, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const connectedAssets = [
  { icon: Globe, label: "Web Application", angle: 0 },
  { icon: Server, label: "API", angle: 72 },
  { icon: Cloud, label: "Cloud", angle: 144 },
  { icon: Boxes, label: "Blockchain", angle: 216 },
  { icon: Shield, label: "Network", angle: 288 },
];

const features = [
  {
    icon: Scan,
    title: "AI Asset Discovery",
    description: "Automatically identifies all digital assets including hidden APIs, subdomains, cloud resources, and smart contracts.",
  },
  {
    icon: Shield,
    title: "Continuous Vulnerability Scanning",
    description: "24/7 AI scanning for web, API, cloud, and blockchain vulnerabilities with real-time alerts.",
  },
  {
    icon: Target,
    title: "Exploit Pattern Detection",
    description: "AI analyzes real-world attack patterns and red team findings to detect high-risk vulnerabilities.",
  },
  {
    icon: Zap,
    title: "Risk-Based Prioritization",
    description: "Vulnerabilities are ranked by real-world impact and exploitability for efficient remediation.",
  },
  {
    icon: Brain,
    title: "AI-Assisted Remediation",
    description: "Provides clear, actionable remediation steps with code suggestions to fix vulnerabilities faster.",
  },
];

const AISecurityEngine = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const visualAnimation = useScrollAnimation({ threshold: 0.1 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-radial opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            AI-Powered Security
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            PerimeterX <span className="text-primary text-glow">AI Security Engine</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            PerimeterX uses artificial intelligence combined with human security experts to continuously scan, detect, and help eliminate vulnerabilities before attackers exploit them.
          </p>
        </div>

        {/* AI Brain Visual with Connected Assets */}
        <div 
          ref={visualAnimation.ref}
          className={`relative max-w-lg mx-auto mb-20 h-[400px] transition-all duration-1000 ${
            visualAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {/* Scanning waves */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-24 h-24 rounded-full border border-primary/20 animate-scan-wave" style={{ animationDelay: "0s" }} />
            <div className="absolute w-24 h-24 rounded-full border border-primary/20 animate-scan-wave" style={{ animationDelay: "1s" }} />
            <div className="absolute w-24 h-24 rounded-full border border-primary/20 animate-scan-wave" style={{ animationDelay: "2s" }} />
          </div>

          {/* Central AI Brain */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-2 border-primary flex items-center justify-center animate-pulse-glow">
              <Brain className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            </div>
          </div>

          {/* Connecting lines and orbiting assets */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {connectedAssets.map((asset, index) => {
              const angleRad = (asset.angle * Math.PI) / 180;
              const radius = 140;
              const x = 200 + Math.cos(angleRad) * radius;
              const y = 200 + Math.sin(angleRad) * radius;
              
              return (
                <g key={index}>
                  {/* Connection line */}
                  <line
                    x1="200"
                    y1="200"
                    x2={x}
                    y2={y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                  {/* Data flow particles */}
                  <circle r="3" fill="hsl(var(--primary))">
                    <animateMotion
                      dur={`${2 + index * 0.3}s`}
                      repeatCount="indefinite"
                      path={`M200,200 L${x},${y}`}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Orbiting asset icons */}
          {connectedAssets.map((asset, index) => {
            const angleRad = (asset.angle * Math.PI) / 180;
            const radius = 140;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <div 
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-card border border-primary/30 flex flex-col items-center justify-center backdrop-blur-sm hover:border-primary hover:scale-110 transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <asset.icon className="w-6 h-6 text-primary group-hover:text-glow transition-all" />
                  <span className="text-[10px] text-muted-foreground mt-1 hidden md:block">{asset.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Cards */}
        <div 
          ref={featuresAnimation.ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 ${
                featuresAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISecurityEngine;
