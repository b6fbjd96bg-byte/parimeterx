import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import XShieldAnimation from "./XShieldAnimation";
import TypingText from "./TypingText";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

const Hero = () => {
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Reactive gradient that follows mouse */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(var(--primary) / 0.06), transparent 50%)`,
        }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-8 animate-fade-in group hover:border-primary/40 transition-colors duration-500">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
              <span className="text-sm font-medium text-primary/80 tracking-wide">
                Offensive Security Experts
              </span>
            </div>

            {/* Main Headline with gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="text-foreground">PARAMETER</span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift"> X</span>
            </h1>

            {/* Subheadline */}
            <div className="text-xl md:text-2xl text-muted-foreground mb-4 h-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <TypingText texts={[
                "Defining the Next Edge of Defense",
                "Advanced Threat Detection",
                "Securing Your Digital Perimeter",
                "Breaking Systems Before Hackers Do"]}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={3000} />
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.6s" }}>
              Enterprise-grade cybersecurity platform delivering penetration testing, red team operations, cloud security, and blockchain security assessments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <Button variant="cyber" size="xl" className="group relative overflow-hidden" asChild>
                <Link to="/get-security-audit">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Security Assessment
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-foreground/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </Button>
              <Button variant="cyberOutline" size="xl" asChild>
                <Link to="/#contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to an Expert
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-border/20 animate-fade-in" style={{ animationDelay: "1s" }}>
              <p className="text-sm text-muted-foreground mb-4">Aligned with Industry Standards</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {["OWASP", "NIST", "SANS", "ISO 27001", "PCI DSS"].map((standard, index) =>
                  <div
                    key={standard}
                    className="px-3 py-1.5 rounded-md border border-border/30 bg-card/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 animate-fade-in group/badge"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}>
                    <span className="text-xs font-medium tracking-wider text-muted-foreground group-hover/badge:text-primary transition-colors duration-300">
                      {standard}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Shield */}
          <div className="flex justify-center order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <XShieldAnimation />
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsAnimation.ref}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "700+", label: "Security Assessments" },
            { value: "99.9%", label: "Client Satisfaction" },
            { value: "24/7", label: "Security Monitoring" },
            { value: "100+", label: "Enterprise Clients" }
          ].map((stat, index) =>
            <div
              key={index}
              className={`group p-4 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 ${
                statsAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="text-2xl md:text-3xl font-bold text-primary group-hover:text-glow transition-all duration-300">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-6 h-6 text-primary/40" />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        .animate-gradient-shift {
          animation: gradient-shift 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
