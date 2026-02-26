import { Brain, Globe, Server, Cloud, Boxes, Scan, Shield, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";
import { useEffect, useState } from "react";

const connectedAssets = [
  { icon: Globe, label: "Web App", angle: 0 },
  { icon: Server, label: "API", angle: 72 },
  { icon: Cloud, label: "Cloud", angle: 144 },
  { icon: Boxes, label: "Blockchain", angle: 216 },
  { icon: Shield, label: "Network", angle: 288 },
];

const features = [
  { icon: Scan, title: "AI Asset Discovery", description: "Automatically identifies all digital assets including hidden APIs, subdomains, cloud resources, and smart contracts." },
  { icon: Shield, title: "Continuous Scanning", description: "24/7 AI scanning for web, API, cloud, and blockchain vulnerabilities with real-time alerts." },
  { icon: Target, title: "Exploit Detection", description: "AI analyzes real-world attack patterns and red team findings to detect high-risk vulnerabilities." },
  { icon: Zap, title: "Risk Prioritization", description: "Vulnerabilities ranked by real-world impact and exploitability for efficient remediation." },
  { icon: Brain, title: "AI Remediation", description: "Provides clear, actionable remediation steps with code suggestions to fix vulnerabilities faster." },
];

const AISecurityEngine = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const visualAnimation = useScrollAnimation({ threshold: 0.1 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.1 });
  const bgParallax = useParallax({ speed: 0.2 });
  const [time, setTime] = useState(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      setTime(t => t + 0.012);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-40 will-change-transform" style={{ transform: `translateY(${bgParallax * 0.3}px)` }} />
      
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={headerAnimation.ref}
          className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">AI-Powered Security</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            ParameterX <span className="text-primary text-glow">AI Security Engine</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ParameterX uses artificial intelligence combined with human security experts to continuously scan, detect, and help eliminate vulnerabilities before attackers exploit them.
          </p>
        </div>

        {/* AI Brain Visual */}
        <div 
          ref={visualAnimation.ref}
          className={`relative max-w-lg mx-auto mb-20 h-[400px] transition-all duration-1000 ${
            visualAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {/* Scanning waves */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map(i => (
              <div key={i} className="absolute w-24 h-24 rounded-full border border-primary/20 animate-scan-wave" style={{ animationDelay: `${i}s` }} />
            ))}
          </div>

          {/* Central AI Brain with glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-2 border-primary flex items-center justify-center animate-pulse-glow">
                <Brain className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              </div>
            </div>
          </div>

          {/* SVG connections with animated dashes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {connectedAssets.map((asset, index) => {
              const angleRad = ((asset.angle + time * 8) * Math.PI) / 180;
              const radius = 140;
              const x = 200 + Math.cos(angleRad) * radius;
              const y = 200 + Math.sin(angleRad) * radius;
              
              return (
                <g key={index}>
                  <line x1="200" y1="200" x2={x} y2={y} stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4,6" strokeOpacity="0.4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-20" dur={`${1.5 + index * 0.2}s`} repeatCount="indefinite" />
                  </line>
                  <circle r="2.5" fill="hsl(var(--primary))" opacity="0.8">
                    <animateMotion dur={`${2.5 + index * 0.4}s`} repeatCount="indefinite" path={`M200,200 L${x},${y}`} />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Orbiting asset icons */}
          {connectedAssets.map((asset, index) => {
            const angleRad = ((asset.angle + time * 8) * Math.PI) / 180;
            const radius = 140;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 will-change-transform"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-card border border-primary/30 flex flex-col items-center justify-center backdrop-blur-sm hover:border-primary hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <asset.icon className="w-6 h-6 text-primary" />
                  <span className="text-[10px] text-muted-foreground mt-1 hidden md:block">{asset.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Cards */}
        <div ref={featuresAnimation.ref} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${
                featuresAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
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
