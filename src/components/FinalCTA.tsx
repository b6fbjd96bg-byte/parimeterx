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
      
      {/* Animated rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="absolute w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 animate-ping-slow" style={{ animationDuration: "4s" }} />
        <div className="absolute w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 animate-ping-slow" style={{ animationDuration: "5s", animationDelay: "1s" }} />
        <div className="absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 animate-ping-slow" style={{ animationDuration: "6s", animationDelay: "2s" }} />
      </div>
      
      {/* Animated background shield with rotation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <Shield className="w-[400px] h-[400px] animate-spin-slow" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={animation.ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Glowing shield icon with ripple */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="relative w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-glow border border-primary/30">
              <Shield className="w-10 h-10 text-primary animate-bounce-subtle" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to secure your{" "}
            <span className="text-primary text-glow animate-pulse">digital perimeter?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Partner with our team of security experts to protect your organization from evolving cyber threats. Start with a free security consultation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-security-audit">
              <Button variant="cyber" size="xl" className="group w-full sm:w-auto relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Request Free Security Audit
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
            <Link to="/#contact">
              <Button variant="cyberOutline" size="xl" className="w-full sm:w-auto group">
                <MessageSquare className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Contact Security Team
              </Button>
            </Link>
          </div>
          
          {/* Trust badges with stagger animation */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {["OWASP Compliant", "NIST Framework", "ISO 27001", "SOC 2 Ready"].map((badge, index) => (
              <div 
                key={badge}
                className={`px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:scale-105 transition-all duration-300 ${
                  animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <span className="text-xs font-medium text-muted-foreground">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
