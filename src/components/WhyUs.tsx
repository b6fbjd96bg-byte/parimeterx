import { Check, Zap, FileText, Users, Award, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Zap,
    title: "Expert-Driven Approach",
    description: "Our team of certified security professionals goes beyond automated tools with deep manual testing expertise.",
  },
  {
    icon: FileText,
    title: "Clear Reporting",
    description: "Receive detailed, actionable reports with prioritized findings and step-by-step remediation guidance.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Work directly with our security experts who understand your business context and threat landscape.",
  },
  {
    icon: Award,
    title: "Industry Certified",
    description: "OSCP, CEH, CISSP certified professionals aligned with OWASP, NIST, and SANS methodologies.",
  },
  {
    icon: Clock,
    title: "Rapid Turnaround",
    description: "Get comprehensive security assessments delivered on time without compromising thoroughness.",
  },
  {
    icon: Check,
    title: "Zero-Day Discovery",
    description: "Uncover unknown vulnerabilities and business logic flaws that automated scanners miss.",
  },
];

const WhyUs = () => {
  const textAnimation = useScrollAnimation({ threshold: 0.2 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.1 });
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="why-us" className="py-24 bg-secondary/30 relative">
      <div className="absolute inset-0 gradient-cyber opacity-50" />
      
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
              Stay Secure, Compliant, and <span className="text-primary">Resilient</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              PerimeterX empowers organizations to identify real-world security risks before attackers exploit them. Our approach combines cutting-edge technology with human expertise to deliver comprehensive security solutions.
            </p>
            
            {/* Stats */}
            <div 
              ref={statsAnimation.ref}
              className={`grid grid-cols-3 gap-4 pt-8 border-t border-border/50 transition-all duration-700 delay-300 ${
                statsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {[
                { value: "500+", label: "Assessments Done" },
                { value: "99%", label: "Client Retention" },
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
