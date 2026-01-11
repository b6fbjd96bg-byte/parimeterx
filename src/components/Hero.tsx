import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import AnimatedShield from "./AnimatedShield";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 bg-background">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Radial Gradient Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8 animate-pulse-glow">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Security Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">PERIMETER</span>
              <span className="text-primary text-glow"> X</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Defining the Next Edge of Defense
            </p>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              AI-driven cybersecurity platform delivering penetration testing, red team operations, cloud security, and blockchain security to protect modern digital infrastructure.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="cyber" size="xl" className="group">
                Get Free AI Security Scan
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="cyberOutline" size="xl">
                <Phone className="mr-2 h-5 w-5" />
                Talk to a Security Expert
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-border/30">
              <p className="text-sm text-muted-foreground mb-4">Aligned with Industry Standards</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {["OWASP", "NIST", "SANS", "ISO 27001", "PCI DSS"].map((standard) => (
                  <div 
                    key={standard}
                    className="px-3 py-1.5 rounded-lg border border-border/30 bg-card/20 hover:border-primary/50 hover:bg-card/40 transition-all duration-300"
                  >
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground hover:text-primary transition-colors">
                      {standard}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Animated Shield */}
          <div className="flex justify-center order-1 lg:order-2">
            <AnimatedShield />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "700+", label: "Security Assessments" },
            { value: "99.9%", label: "Client Satisfaction" },
            { value: "24/7", label: "Security Monitoring" },
            { value: "100+", label: "Enterprise Clients" },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/50 transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary text-glow">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
