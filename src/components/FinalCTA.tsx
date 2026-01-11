import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FinalCTA = () => {
  const animation = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      
      {/* Animated background shield */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <Shield className="w-[400px] h-[400px] animate-pulse-glow" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={animation.ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Glowing shield icon */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-pulse-glow border border-primary/30">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to secure your{" "}
            <span className="text-primary text-glow">digital perimeter?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Partner with our team of security experts to protect your organization from evolving cyber threats. Start with a free security consultation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#contact">
              <Button variant="cyber" size="xl" className="group w-full sm:w-auto">
                Request Free Security Audit
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/#contact">
              <Button variant="cyberOutline" size="xl" className="w-full sm:w-auto">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Security Team
              </Button>
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {["OWASP Compliant", "NIST Framework", "ISO 27001", "SOC 2 Ready"].map((badge) => (
              <div 
                key={badge}
                className="px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm"
              >
                <span className="text-xs font-medium text-muted-foreground">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
