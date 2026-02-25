import { useEffect, useState } from "react";

const XShieldAnimation = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
      {/* Single slow orbit ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary/15 animate-spin"
          style={{ animationDuration: "40s" }}
        />
        <div
          className="absolute w-52 h-52 md:w-68 md:h-68 rounded-full border border-primary/10 animate-spin"
          style={{ animationDuration: "30s", animationDirection: "reverse" }}
        />
      </div>

      {/* Subtle globe */}
      <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full">
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle at 35% 35%, 
              hsl(var(--primary) / 0.3) 0%, 
              transparent 70%)`,
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-15 animate-spin"
          style={{ animationDuration: "60s" }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.4" />
          <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.4" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(var(--primary))" strokeWidth="0.3" />
        </svg>
      </div>

      {/* X Logo — clean, no glow filter */}
      <svg
        viewBox="0 0 100 100"
        className={`relative z-20 w-20 h-20 md:w-28 md:h-28 transition-all duration-1000 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <defs>
          <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path
          d="M25 25 L75 75"
          stroke="url(#xGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M75 25 L25 75"
          stroke="url(#xGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Soft ambient glow */}
      <div
        className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Status indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/40 rounded-full px-4 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
        <span className="text-xs font-medium text-muted-foreground tracking-wider">SECURE</span>
      </div>
    </div>
  );
};

export default XShieldAnimation;
