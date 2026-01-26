import { useEffect, useState, useRef } from "react";
import { Shield, Users, Clock, Building2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const metrics = [
  { icon: Shield, value: 700, suffix: "+", label: "Security Assessments" },
  { icon: Users, value: 99.9, suffix: "%", label: "Client Satisfaction" },
  { icon: Clock, value: 24, suffix: "/7", label: "Security Monitoring" },
  { icon: Building2, value: 100, suffix: "+", label: "Enterprise & FinTech Trusted" },
];

const AnimatedCounter = ({ 
  value, 
  suffix, 
  isVisible 
}: { 
  value: number; 
  suffix: string; 
  isVisible: boolean;
}) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isVisible, value]);
  
  const displayValue = value % 1 === 0 ? Math.floor(count) : count.toFixed(1);
  
  return (
    <span className="text-4xl md:text-5xl font-bold text-primary text-glow">
      {displayValue}{suffix}
    </span>
  );
};

const TrustMetrics = () => {
  const animation = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 gradient-cyber opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={animation.ref}
          className={`text-center mb-12 transition-all duration-700 ${
            animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            Trusted by Industry Leaders
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Proven <span className="text-primary">Results</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className={`relative group p-6 md:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 text-center hover:-translate-y-2 overflow-hidden ${
                animation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 animate-gradient-x" />
                <div className="absolute inset-[1px] rounded-2xl bg-card" />
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float-particle"
                    style={{
                      left: `${20 + i * 15}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${2 + i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <metric.icon className="w-7 h-7 text-primary" />
                </div>
                
                <AnimatedCounter 
                  value={metric.value} 
                  suffix={metric.suffix} 
                  isVisible={animation.isVisible} 
                />
                
                <p className="text-sm text-muted-foreground mt-2">{metric.label}</p>
              </div>
            </div>
          ))}
          
          <style>{`
            @keyframes gradient-x {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            .animate-gradient-x {
              background-size: 200% 200%;
              animation: gradient-x 3s ease infinite;
            }
            @keyframes float-particle {
              0%, 100% { transform: translateY(100%) scale(0); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(-100px) scale(1); opacity: 0; }
            }
            .animate-float-particle {
              animation: float-particle 3s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default TrustMetrics;
