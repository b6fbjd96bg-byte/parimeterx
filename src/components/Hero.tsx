import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedShield from "./AnimatedShield";
import TypingText from "./TypingText";
import GlitchText from "./GlitchText";
import MagneticButton from "./MagneticButton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 bg-background">
        {/* Grid Pattern with animation */}
        <div 
          className="absolute inset-0 opacity-[0.03] animate-grid-flow"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Radial Gradient Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[150px]" />
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-line" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8 animate-fade-in group hover:border-primary/60 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Security Platform</span>
            </div>

            {/* Main Headline with Glitch Effect */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="text-foreground">PARAMETER</span>
              <GlitchText text=" X" className="text-primary text-glow" />
            </h1>
            
            {/* Subheadline with Typing Effect */}
            <div className="text-xl md:text-2xl text-muted-foreground mb-4 h-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <TypingText 
                texts={[
                  "Defining the Next Edge of Defense",
                  "AI-Powered Threat Detection",
                  "Securing Your Digital Perimeter",
                  "Breaking Systems Before Hackers Do"
                ]}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={3000}
              />
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.6s" }}>
              AI-driven cybersecurity platform delivering penetration testing, red team operations, cloud security, and blockchain security to protect modern digital infrastructure.
            </p>

            {/* CTA Buttons with Magnetic Effect */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <MagneticButton strength={0.2}>
                <Button variant="cyber" size="xl" className="group" asChild>
                  <Link to="/get-security-audit">
                    Get Free AI Security Scan
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <Button variant="cyberOutline" size="xl">
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to a Security Expert
                </Button>
              </MagneticButton>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-border/30 animate-fade-in" style={{ animationDelay: "1s" }}>
              <p className="text-sm text-muted-foreground mb-4">Aligned with Industry Standards</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {["OWASP", "NIST", "SANS", "ISO 27001", "PCI DSS"].map((standard, index) => (
                  <div 
                    key={standard}
                    className="px-3 py-1.5 rounded-lg border border-border/30 bg-card/20 hover:border-primary/50 hover:bg-card/40 hover:scale-105 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}
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
          <div className="flex justify-center order-1 lg:order-2 animate-scale-in" style={{ animationDelay: "0.4s" }}>
            <AnimatedShield />
          </div>
        </div>

        {/* Stats Section with staggered animation */}
        <div 
          ref={statsAnimation.ref}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "700+", label: "Security Assessments" },
            { value: "99.9%", label: "Client Satisfaction" },
            { value: "24/7", label: "Security Monitoring" },
            { value: "100+", label: "Enterprise Clients" },
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/50 hover:-translate-y-1 transition-all duration-300 group ${
                statsAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary text-glow group-hover:scale-110 transition-transform origin-left">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Custom keyframes for scanning line */}
      <style>{`
        @keyframes scan-line {
          0% { top: -2px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 4s ease-in-out infinite;
        }
        @keyframes grid-flow {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
