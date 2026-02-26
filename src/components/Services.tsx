import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Target, Cloud, Network, Code, Cpu, Brain, Building2, ArrowRight, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

type AccentColor = "red" | "blue" | "green" | "purple";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  accent: AccentColor;
}

const services: Service[] = [
  { icon: Shield, title: "Application Pentest", description: "Enhance the security of your applications and elevate your DevSecOps practice.", link: "/services/application-pentest", accent: "blue" },
  { icon: Building2, title: "Enterprise Pentest", description: "Protect your organization from cyber threats with our comprehensive enterprise security solutions.", link: "/services/enterprise-pentest", accent: "green" },
  { icon: Target, title: "Red Team Assessment", description: "Obtain a comprehensive perspective on your organization's defense capabilities against real-world attacks.", link: "/services/red-team-assessment", accent: "red" },
  { icon: Cloud, title: "Cloud Pentest", description: "Evaluate and enhance cloud security posture with expert testing and analysis.", link: "/services/cloud-pentest", accent: "blue" },
  { icon: Network, title: "Network Pentest", description: "Uncover potential network vulnerabilities and protect your sensitive systems and data.", link: "/services/network-pentest", accent: "green" },
  { icon: Code, title: "Source Code Audit", description: "Ensure the integrity and security of your codebase with our source code audits.", link: "/services/source-code-audit", accent: "purple" },
  { icon: Cpu, title: "IoT Pentest", description: "Secure interconnected devices and products by validating their resilience against potential attackers.", link: "/services/iot-pentest", accent: "green" },
  { icon: Brain, title: "AI Security Assessment", description: "We identify critical vulnerabilities in production LLMs and AI systems that expose novel attack paths.", link: "/services/ai-security-assessment", accent: "purple" },
  { icon: Boxes, title: "Blockchain Security", description: "Secure decentralized systems with smart contract audits, DeFi protocol testing, and Web3 security.", link: "/services/blockchain-security", accent: "purple" },
];

const accentColors: Record<AccentColor, string> = {
  red: "var(--color-red-team)",
  blue: "var(--color-blue-ai)",
  green: "var(--color-green-secure)",
  purple: "var(--color-purple-blockchain)",
};

const Services = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const cardsAnimation = useScrollAnimation({ threshold: 0.1 });
  const bgParallax = useParallax({ speed: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 gradient-radial opacity-30 will-change-transform" 
        style={{ transform: `translateY(${bgParallax}px)` }}
      />

      {/* Animated section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={headerAnimation.ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-primary text-glow">Security Services</span>
          </h2>
          <p className="text-muted-foreground">
            Comprehensive offensive security services powered by AI and expert security professionals to protect your digital infrastructure.
          </p>
        </div>

        <div 
          ref={cardsAnimation.ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const colorVar = accentColors[service.accent];
            const isHovered = hoveredIndex === index;
            
            return (
              <Link 
                key={index} 
                to={service.link}
                className={`transition-all duration-700 ${
                  cardsAnimation.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Card 
                  className="group h-full bg-card/50 backdrop-blur-sm border-border/30 transition-all duration-500 cursor-pointer hover:-translate-y-3 relative overflow-hidden"
                  style={{
                    borderColor: isHovered ? `hsl(${colorVar} / 0.5)` : undefined,
                    boxShadow: isHovered ? `0 20px 60px -15px hsl(${colorVar} / 0.2), 0 0 30px -10px hsl(${colorVar} / 0.1)` : undefined,
                  }}
                >
                  {/* Top accent line */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, hsl(${colorVar}), transparent)` }}
                  />

                  {/* Background glow */}
                  <div 
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    style={{ background: `hsl(${colorVar} / 0.1)` }}
                  />
                  
                  <CardHeader className="relative z-10">
                    <div 
                      className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 border"
                      style={{
                        backgroundColor: `hsl(${colorVar} / 0.1)`,
                        borderColor: isHovered ? `hsl(${colorVar} / 0.3)` : 'transparent',
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </CardDescription>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Learn More 
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
