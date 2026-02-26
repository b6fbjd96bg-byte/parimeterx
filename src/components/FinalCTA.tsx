import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FinalCTA = () => {
  const animation = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30" />
      
      {/* Animated glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* Expanding rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[200, 300, 400].map((size, i) => (
          <div key={i} className="absolute rounded-full border border-primary/10 animate-ping-slow"
            style={{ 
              width: size, height: size, 
              top: -size/2, left: -size/2,
              animationDuration: `${4 + i}s`, 
              animationDelay: `${i}s` 
            }} 
          />
        ))}
      </div>
      
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={animation.ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Shield icon with ripple */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="relative w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-glow border border-primary/30">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to secure your{" "}
            <span className="text-primary text-glow">digital perimeter?</span>
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
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-foreground/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
            <Link to="/#contact">
              <Button variant="cyberOutline" size="xl" className="w-full sm:w-auto group">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Security Team
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {["OWASP Compliant", "NIST Framework", "ISO 27001", "SOC 2 Ready"].map((badge, index) => (
              <div 
                key={badge}
                className={`px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-300 ${
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
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
