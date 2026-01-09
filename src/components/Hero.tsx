import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock } from "lucide-react";
import bannerImage from "@/assets/perimeterx-banner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bannerImage}
          alt="PerimeterX Cybersecurity"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 gradient-radial" />
      </div>

      {/* Floating Lock Icons - Decorative */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Lock className="absolute top-1/4 left-1/4 h-6 w-6 text-primary/20 animate-float" style={{ animationDelay: "0s" }} />
        <Lock className="absolute top-1/3 right-1/4 h-4 w-4 text-primary/15 animate-float" style={{ animationDelay: "1s" }} />
        <Lock className="absolute bottom-1/3 left-1/3 h-5 w-5 text-primary/20 animate-float" style={{ animationDelay: "2s" }} />
        <Shield className="absolute top-1/2 right-1/3 h-8 w-8 text-primary/10 animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-pulse-glow">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Defining the Next Edge of Defense</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Secure Your </span>
            <span className="text-primary text-glow">Digital Perimeter</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Expert-driven penetration testing, vulnerability assessments, and red-team security solutions for startups, enterprises, and financial institutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cyber" size="xl" className="group">
              Get Your Free Security Audit
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="cyberOutline" size="xl">
              View Our Services
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-4">Aligned with Industry Standards</p>
            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <span className="text-sm font-semibold tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300">OWASP</span>
              <span className="text-sm font-semibold tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300">NIST</span>
              <span className="text-sm font-semibold tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300">SANS</span>
              <span className="text-sm font-semibold tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300">ISO 27001</span>
              <span className="text-sm font-semibold tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300">PCI DSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
