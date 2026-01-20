import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Target, Cloud, Network, Code, Cpu, Brain, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { LucideIcon } from "lucide-react";

type AccentColor = "red" | "blue" | "green" | "purple";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  accent: AccentColor;
}

const services: Service[] = [
  {
    icon: Shield,
    title: "Application Pentest",
    description: "Enhance the security of your applications and elevate your DevSecOps practice.",
    link: "/services/application-pentest",
    accent: "blue",
  },
  {
    icon: Building2,
    title: "Enterprise Pentest",
    description: "Protect your organization from cyber threats with our comprehensive enterprise security solutions.",
    link: "/services/enterprise-pentest",
    accent: "green",
  },
  {
    icon: Target,
    title: "Red Team Assessment",
    description: "Obtain a comprehensive perspective on your organization's defense capabilities against real-world attacks.",
    link: "/services/red-team-assessment",
    accent: "red",
  },
  {
    icon: Cloud,
    title: "Cloud Pentest",
    description: "Evaluate and enhance cloud security posture with expert testing and analysis.",
    link: "/services/cloud-pentest",
    accent: "blue",
  },
  {
    icon: Network,
    title: "Network Pentest",
    description: "Uncover potential network vulnerabilities and protect your sensitive systems and data.",
    link: "/services/network-pentest",
    accent: "green",
  },
  {
    icon: Code,
    title: "Source Code Audit",
    description: "Ensure the integrity and security of your codebase with our source code audits.",
    link: "/services/source-code-audit",
    accent: "purple",
  },
  {
    icon: Cpu,
    title: "IoT Pentest",
    description: "Secure interconnected devices and products by validating their resilience against potential attackers.",
    link: "/services/iot-pentest",
    accent: "green",
  },
  {
    icon: Brain,
    title: "AI Security Assessment",
    description: "We identify critical vulnerabilities in production LLMs and AI systems that expose novel attack paths.",
    link: "/services/ai-security-assessment",
    accent: "purple",
  },
];

const accentStyles: Record<AccentColor, { border: string; bg: string; hoverBorder: string; iconBg: string }> = {
  red: {
    border: "border-[hsl(var(--color-red-team)/0.3)]",
    bg: "bg-[hsl(var(--color-red-team)/0.05)]",
    hoverBorder: "hover:border-[hsl(var(--color-red-team)/0.6)]",
    iconBg: "group-hover:bg-[hsl(var(--color-red-team)/0.2)]",
  },
  blue: {
    border: "border-[hsl(var(--color-blue-ai)/0.3)]",
    bg: "bg-[hsl(var(--color-blue-ai)/0.05)]",
    hoverBorder: "hover:border-[hsl(var(--color-blue-ai)/0.6)]",
    iconBg: "group-hover:bg-[hsl(var(--color-blue-ai)/0.2)]",
  },
  green: {
    border: "border-[hsl(var(--color-green-secure)/0.3)]",
    bg: "bg-[hsl(var(--color-green-secure)/0.05)]",
    hoverBorder: "hover:border-[hsl(var(--color-green-secure)/0.6)]",
    iconBg: "group-hover:bg-[hsl(var(--color-green-secure)/0.2)]",
  },
  purple: {
    border: "border-[hsl(var(--color-purple-blockchain)/0.3)]",
    bg: "bg-[hsl(var(--color-purple-blockchain)/0.05)]",
    hoverBorder: "hover:border-[hsl(var(--color-purple-blockchain)/0.6)]",
    iconBg: "group-hover:bg-[hsl(var(--color-purple-blockchain)/0.2)]",
  },
};

const Services = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const cardsAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="services" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-radial opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-primary">Security Services</span>
          </h2>
          <p className="text-muted-foreground">
            Comprehensive offensive security services powered by AI and expert security professionals to protect your digital infrastructure.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          ref={cardsAnimation.ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const accent = accentStyles[service.accent];
            const IconComponent = service.icon;
            
            return (
              <Link 
                key={index} 
                to={service.link}
                className={`transition-all duration-700 ${
                  cardsAnimation.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className={`group h-full bg-card/50 backdrop-blur-sm ${accent.border} ${accent.hoverBorder} transition-all duration-300 cursor-pointer hover:-translate-y-1`}>
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ${accent.iconBg} group-hover:scale-110 transition-all duration-300`}>
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </CardDescription>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                      Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
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
