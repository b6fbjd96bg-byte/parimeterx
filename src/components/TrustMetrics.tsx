import { useEffect, useState, useRef } from "react";
import { Shield, Users, Clock, Building2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const metrics = [
  { icon: Shield, value: 700, suffix: "+", label: "Security Assessments" },
  { icon: Users, value: 99.9, suffix: "%", label: "Client Satisfaction" },
  { icon: Clock, value: 24, suffix: "/7", label: "Security Monitoring" },
  { icon: Building2, value: 100, suffix: "+", label: "Enterprise Clients" },
];

const AnimatedCounter = ({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) => {
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
        if (current >= value) { setCount(value); clearInterval(timer); }
        else setCount(current);
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  const displayValue = value % 1 === 0 ? Math.floor(count) : count.toFixed(1);
  return <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary text-glow tabular-nums">{displayValue}{suffix}</span>;
};

/** Tiny floating particle that drifts upward inside a metric card */
const FloatingDot = ({ delay }: { delay: number }) => (
  <span
    className="absolute bottom-0 w-1 h-1 rounded-full bg-primary/40 animate-float pointer-events-none"
    style={{
      left: `${15 + Math.random() * 70}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${4 + Math.random() * 3}s`,
    }}
  />
);

const TrustMetrics = () => {
  const animation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 gradient-cyber opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      {/* Top & bottom separator lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Decorative corner brackets */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
        <span className="block w-4 h-4 border-t border-l border-primary/60" />
        <span className="block w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" />
        <span className="block w-4 h-4 border-t border-r border-primary/60" />
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
        <span className="block w-4 h-4 border-b border-l border-primary/60" />
        <span className="block w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" />
        <span className="block w-4 h-4 border-b border-r border-primary/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Optional heading — hidden to keep minimal like reference */}
        <div
          ref={animation.ref}
          className={`text-center mb-14 transition-all duration-700 ${animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="text-primary text-xs font-semibold tracking-[0.25em] uppercase mb-3 block">
            Trusted by Industry Leaders
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Proven <span className="text-primary text-glow">Results</span>
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md transition-all duration-700 ease-out text-center overflow-hidden hover:border-primary/40 hover:-translate-y-1 ${
                animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Top accent line with sweep animation */}
              <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden">
                <div
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-[sweep_1.5s_ease-in-out_infinite]"
                  style={{ marginLeft: "25%" }}
                />
              </div>

              {/* Background glow on hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-primary/8 blur-[60px] scale-0 group-hover:scale-100 transition-transform duration-700" />

              {/* Floating particles */}
              {[0, 1, 2].map((i) => (
                <FloatingDot key={i} delay={i * 1.5} />
              ))}

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 lg:p-10">
                {/* Icon — subtle, above the number */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 group-hover:border-primary/25 group-hover:scale-110 transition-all duration-500">
                  <metric.icon className="w-6 h-6 text-primary transition-transform duration-500 group-hover:rotate-6" />
                </div>

                {/* Animated number */}
                <div className="mb-2">
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} isVisible={animation.isVisible} />
                </div>

                {/* Label */}
                <p className="text-sm text-muted-foreground tracking-wide">{metric.label}</p>
              </div>

              {/* Bottom subtle line */}
              <div className="absolute bottom-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Sweep keyframe (injected once) */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
};

export default TrustMetrics;
