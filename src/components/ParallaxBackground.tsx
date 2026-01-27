import { useParallax } from "@/hooks/useParallax";

const ParallaxBackground = () => {
  // Multiple parallax layers at different speeds
  const slowOrb = useParallax({ speed: 0.15 });
  const mediumOrb = useParallax({ speed: 0.25 });
  const fastOrb = useParallax({ speed: 0.35 });
  const reverseOrb = useParallax({ speed: 0.2, direction: "down" });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large slow-moving orb - top left */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] will-change-transform"
        style={{
          top: "10%",
          left: "-10%",
          transform: `translateY(${slowOrb}px)`,
        }}
      />

      {/* Medium speed orb - top right */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] will-change-transform"
        style={{
          top: "20%",
          right: "-5%",
          transform: `translateY(${mediumOrb}px)`,
        }}
      />

      {/* Fast moving orb - center */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-primary/3 blur-[80px] will-change-transform"
        style={{
          top: "40%",
          left: "30%",
          transform: `translateY(${fastOrb}px)`,
        }}
      />

      {/* Reverse direction orb - bottom */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full bg-primary/4 blur-[150px] will-change-transform"
        style={{
          bottom: "10%",
          right: "20%",
          transform: `translateY(${reverseOrb}px)`,
        }}
      />

      {/* Floating geometric shapes with parallax */}
      <div
        className="absolute w-32 h-32 border border-primary/10 rotate-45 will-change-transform"
        style={{
          top: "15%",
          left: "10%",
          transform: `translateY(${slowOrb * 0.5}px) rotate(45deg)`,
        }}
      />

      <div
        className="absolute w-24 h-24 border border-primary/5 rounded-full will-change-transform"
        style={{
          top: "60%",
          right: "15%",
          transform: `translateY(${mediumOrb * 0.7}px)`,
        }}
      />

      <div
        className="absolute w-16 h-16 bg-primary/5 rotate-12 will-change-transform"
        style={{
          top: "75%",
          left: "20%",
          transform: `translateY(${fastOrb * 0.3}px) rotate(12deg)`,
        }}
      />

      {/* Gradient lines with parallax */}
      <div
        className="absolute w-[1px] h-[300px] bg-gradient-to-b from-transparent via-primary/20 to-transparent will-change-transform"
        style={{
          top: "5%",
          left: "25%",
          transform: `translateY(${slowOrb * 0.8}px)`,
        }}
      />

      <div
        className="absolute w-[1px] h-[400px] bg-gradient-to-b from-transparent via-primary/10 to-transparent will-change-transform"
        style={{
          top: "30%",
          right: "30%",
          transform: `translateY(${reverseOrb * 0.6}px)`,
        }}
      />

      {/* Dot grid with parallax */}
      <div
        className="absolute opacity-20 will-change-transform"
        style={{
          top: "50%",
          left: "5%",
          transform: `translateY(${mediumOrb * 0.4}px)`,
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-primary/30" />
          ))}
        </div>
      </div>

      <div
        className="absolute opacity-20 will-change-transform"
        style={{
          top: "20%",
          right: "8%",
          transform: `translateY(${slowOrb * 0.6}px)`,
        }}
      >
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-0.5 h-0.5 rounded-full bg-primary/20" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParallaxBackground;
