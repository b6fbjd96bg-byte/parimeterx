import { useParallax } from "@/hooks/useParallax";

const ParallaxBackground = () => {
  const slowOrb = useParallax({ speed: 0.08 });
  const mediumOrb = useParallax({ speed: 0.12 });
  const fastOrb = useParallax({ speed: 0.05 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary ambient orb - top left */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[200px] will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
          top: "-10%",
          left: "-20%",
          transform: `translateY(${slowOrb}px)`,
        }}
      />

      {/* Secondary orb - bottom right */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[180px] will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.04) 0%, transparent 70%)",
          bottom: "-5%",
          right: "-15%",
          transform: `translateY(${mediumOrb}px)`,
        }}
      />

      {/* Accent orb - center */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[150px] will-change-transform"
        style={{
          background: "radial-gradient(circle, hsl(var(--glow-secondary) / 0.03) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: `translate(-50%, ${fastOrb}px)`,
        }}
      />

      {/* Subtle scan lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, hsl(var(--primary) / 0.15) 3px, hsl(var(--primary) / 0.15) 4px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background)) 100%)",
          opacity: 0.4,
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
