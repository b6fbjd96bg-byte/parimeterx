import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import XShieldAnimation from "./XShieldAnimation";
import TypingText from "./TypingText";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState, useRef } from "react";

const StatCard = ({ endValue, suffix, label, decimals, isVisible, delay }: {
  endValue: number; suffix: string; label: string; decimals: number; isVisible: boolean; delay: number;
}) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = endValue / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= endValue) { setCount(endValue); clearInterval(timer); }
        else setCount(current);
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isVisible, endValue]);

  const displayValue = decimals === 0 ? Math.floor(count) : count.toFixed(decimals);

  return (
    <div
      className={`group relative p-5 rounded-xl border border-primary/20 bg-card/30 backdrop-blur-md hover:border-primary/60 transition-all duration-700 ease-out overflow-hidden hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Glow border effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: 'inset 0 0 20px hsl(var(--primary) / 0.15), 0 0 30px hsl(var(--primary) / 0.1)' }} />
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/40 rounded-tl-lg group-hover:border-primary/80 transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/40 rounded-tr-lg group-hover:border-primary/80 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/40 rounded-bl-lg group-hover:border-primary/80 transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/40 rounded-br-lg group-hover:border-primary/80 transition-colors duration-300" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/10 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.3)] group-hover:drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all duration-300">
          {displayValue}{suffix}
        </div>
        <div className="text-sm text-muted-foreground mt-1.5 tracking-wide">{label}</div>
      </div>
    </div>
  );
};

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
          className="relative z-20 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { endValue: 700, suffix: "+", label: "Security Assessments", decimals: 0 },
            { endValue: 99.9, suffix: "%", label: "Client Satisfaction", decimals: 1 },
            { endValue: 24, suffix: "/7", label: "Security Monitoring", decimals: 0 },
            { endValue: 100, suffix: "+", label: "Enterprise Clients", decimals: 0 }
          ].map((stat, index) => (
            <StatCard
              key={index}
              endValue={stat.endValue}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
              isVisible={statsAnimation.isVisible}
              delay={index * 120}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-float">
        <ChevronDown className="w-6 h-6 text-primary/40" />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10" />

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
