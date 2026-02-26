import { useParallax } from "@/hooks/useParallax";
import { useEffect, useState } from "react";

const ParallaxBackground = () => {
  const slowOrb = useParallax({ speed: 0.08 });
  const mediumOrb = useParallax({ speed: 0.12 });
  const fastOrb = useParallax({ speed: 0.05 });
  const [time, setTime] = useState(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      setTime((t) => t + 0.008);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary ambient orb - top left with breathing */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-[220px] will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
          top: "-12%",
          left: "-22%",
          transform: `translateY(${slowOrb}px) scale(${1 + Math.sin(time) * 0.03})`,
        }}
      />

      {/* Secondary orb - bottom right */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[200px] will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
          bottom: "-8%",
          right: "-18%",
          transform: `translateY(${mediumOrb}px) scale(${1 + Math.cos(time * 0.7) * 0.025})`,
        }}
      />

      {/* Accent orb - wandering center */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[180px] will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.035) 0%, transparent 65%)",
          top: "35%",
          left: "45%",
          transform: `translate(${Math.sin(time * 0.5) * 30 - 50}%, ${fastOrb + Math.cos(time * 0.3) * 20}px)`,
        }}
      />

      {/* Fourth orb - top right accent */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[160px] will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.03) 0%, transparent 60%)",
          top: "10%",
          right: "5%",
          transform: `translateY(${slowOrb * 0.5}px)`,
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, hsl(var(--primary) / 0.12) 3px, hsl(var(--primary) / 0.12) 4px)",
        }}
      />

      {/* Horizontal scan beam */}
      <div
        className="absolute left-0 right-0 h-[1px] opacity-[0.04]"
        style={{
          top: `${((time * 15) % 120) - 10}%`,
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)",
          boxShadow: "0 0 20px 5px hsl(var(--primary) / 0.05)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, hsl(var(--background)) 100%)",
          opacity: 0.45,
        }}
      />

      {/* Corner accent lines */}
      <svg className="absolute top-4 left-4 w-16 h-16 opacity-[0.06]" viewBox="0 0 64 64">
        <path d="M0 20 L0 0 L20 0" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
      </svg>
      <svg className="absolute top-4 right-4 w-16 h-16 opacity-[0.06]" viewBox="0 0 64 64">
        <path d="M44 0 L64 0 L64 20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-16 h-16 opacity-[0.06]" viewBox="0 0 64 64">
        <path d="M0 44 L0 64 L20 64" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-16 h-16 opacity-[0.06]" viewBox="0 0 64 64">
        <path d="M44 64 L64 64 L64 44" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default ParallaxBackground;
