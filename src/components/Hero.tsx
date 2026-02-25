import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import XShieldAnimation from "./XShieldAnimation";
import TypingText from "./TypingText";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Clean background */}
      <div className="absolute inset-0 z-0 bg-background" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm mb-8 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-muted-foreground">Cybersecurity Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="text-foreground">PARAMETER</span>
              <span className="text-primary"> X</span>
            </h1>

            {/* Subheadline with Typing Effect */}
            <div className="text-xl md:text-2xl text-muted-foreground mb-4 h-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <TypingText
                texts={[
                  "Defining the Next Edge of Defense",
                  "Advanced Threat Detection",
                  "Securing Your Digital Perimeter",
                  "Breaking Systems Before Hackers Do",
                ]}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={3000}
              />
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.6s" }}>
              Enterprise-grade cybersecurity platform delivering penetration testing, red team operations, cloud security, and blockchain security assessments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <Button variant="cyber" size="xl" className="group" asChild>
                <Link to="/get-security-audit">
                  Get Security Assessment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
                {["OWASP", "NIST", "SANS", "ISO 27001", "PCI DSS"].map((standard, index) => (
                  <div
                    key={standard}
                    className="px-3 py-1.5 rounded-md border border-border/30 bg-card/20 hover:border-border/60 transition-colors duration-300 animate-fade-in"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                  >
                    <span className="text-xs font-medium tracking-wider text-muted-foreground">
                      {standard}
                    </span>
                  </div>
                ))}
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
              className={`p-4 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm hover:border-border/50 transition-all duration-500 ${
                statsAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
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
