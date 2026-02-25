import { useParallax } from "@/hooks/useParallax";

const ParallaxBackground = () => {
  const slowOrb = useParallax({ speed: 0.08 });
  const mediumOrb = useParallax({ speed: 0.12 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle ambient orb - top left */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full bg-primary/3 blur-[200px] will-change-transform"
        style={{
          top: "-10%",
          left: "-20%",
          transform: `translateY(${slowOrb}px)`,
        }}
      />

      {/* Subtle ambient orb - bottom right */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/2 blur-[180px] will-change-transform"
        style={{
          bottom: "-5%",
          right: "-15%",
          transform: `translateY(${mediumOrb}px)`,
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
