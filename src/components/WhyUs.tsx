import { Brain, FileText, Users, Zap, Clock, Target } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Platform",
    description: "Advanced AI continuously scans and identifies vulnerabilities across your entire digital infrastructure.",
  },
  {
    icon: Users,
    title: "Expert-Driven Testing",
    description: "Certified security professionals conduct deep manual testing that automated tools can't match.",
  },
  {
    icon: Target,
    title: "Zero-Day & Logic Focus",
    description: "We uncover unknown vulnerabilities and business logic flaws that attackers exploit.",
  },
  {
    icon: FileText,
    title: "Clear & Actionable Reports",
    description: "Receive detailed reports with prioritized findings and step-by-step remediation guidance.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround Time",
    description: "Get comprehensive security assessments delivered on time without compromising quality.",
  },
  {
    icon: Zap,
    title: "Direct Expert Access",
    description: "Work directly with our security experts who understand your business and threat landscape.",
  },
];

const WhyUs = () => {
  const textAnimation = useScrollAnimation({ threshold: 0.2 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.1 });
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });
  
  // Parallax effect
  const bgParallax = useParallax({ speed: 0.12 });

  return (
    <section id="why-us" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div 
        className="absolute inset-0 gradient-cyber opacity-50 will-change-transform" 
        style={{ transform: `translateY(${bgParallax}px)` }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div 
            ref={textAnimation.ref}
            className={`transition-all duration-700 ${
              textAnimation.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose <span className="text-primary">Parameter X</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              ParameterX combines cutting-edge AI technology with expert human intelligence to deliver comprehensive security solutions. We go beyond automated scanning to uncover the vulnerabilities that matter most.
            </p>
            
            {/* Stats */}
            <div 
              ref={statsAnimation.ref}
              className={`grid grid-cols-3 gap-4 pt-8 border-t border-border/50 transition-all duration-700 delay-300 ${
                statsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {[
                { value: "700+", label: "Assessments Done" },
                { value: "99.9%", label: "Client Satisfaction" },
                { value: "24/7", label: "Expert Support" },
              ].map((stat, index) => (
                <div 
                  key={index}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                  className={`transition-all duration-500 ${
                    statsAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                >
                  <div className="text-3xl font-bold text-primary text-glow mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div 
            ref={featuresAnimation.ref}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group p-5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 ${
                  featuresAnimation.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
