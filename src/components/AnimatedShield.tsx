import { useEffect, useState } from "react";

const AnimatedShield = () => {
  const [attacks, setAttacks] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const angle = Math.random() * 360;
      const radians = (angle * Math.PI) / 180;
      const distance = 200;
      const x = Math.cos(radians) * distance;
      const y = Math.sin(radians) * distance;
      
      const newAttack = {
        id: Date.now() + Math.random(),
        x,
        y,
        angle,
      };
      
      setAttacks((prev) => [...prev.slice(-5), newAttack]);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
      {/* Scanning waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="absolute w-32 h-32 rounded-full border-2 border-primary/30 animate-scan-wave"
          style={{ animationDelay: "0s" }}
        />
        <div 
          className="absolute w-32 h-32 rounded-full border-2 border-primary/30 animate-scan-wave"
          style={{ animationDelay: "1s" }}
        />
        <div 
          className="absolute w-32 h-32 rounded-full border-2 border-primary/30 animate-scan-wave"
          style={{ animationDelay: "2s" }}
        />
      </div>
      
      {/* Attack particles */}
      {attacks.map((attack) => (
        <div
          key={attack.id}
          className="absolute w-3 h-3 rounded-full animate-attack"
          style={{
            "--start-x": `${attack.x}px`,
            "--start-y": `${attack.y}px`,
            backgroundColor: "hsl(var(--color-red-team))",
            boxShadow: "0 0 10px hsl(var(--color-red-team) / 0.8)",
            left: "50%",
            top: "50%",
            marginLeft: "-6px",
            marginTop: "-6px",
          } as React.CSSProperties}
        />
      ))}
      
      {/* Shield container with 3D effect */}
      <div 
        className="relative z-10"
        style={{ 
          perspective: "1000px",
          transformStyle: "preserve-3d" 
        }}
      >
        {/* Main Shield SVG */}
        <svg
          viewBox="0 0 100 120"
          className="w-40 h-48 md:w-52 md:h-60 animate-shield-glow"
          style={{
            filter: "drop-shadow(0 0 30px hsl(var(--primary) / 0.5))",
          }}
        >
          {/* Shield background with gradient */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--color-blue-ai))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--color-green-secure))" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--color-blue-ai))" />
              <stop offset="100%" stopColor="hsl(var(--color-green-secure))" />
            </linearGradient>
            {/* Hexagon pattern */}
            <pattern id="hexPattern" x="0" y="0" width="20" height="17.32" patternUnits="userSpaceOnUse">
              <polygon 
                points="10,0 20,5 20,15 10,20 0,15 0,5" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="0.5" 
                strokeOpacity="0.3"
                transform="translate(0,-1.7)"
              />
            </pattern>
          </defs>
          
          {/* Shield shape */}
          <path
            d="M50 5 L90 20 L90 50 Q90 90 50 115 Q10 90 10 50 L10 20 Z"
            fill="url(#shieldGradient)"
            stroke="url(#shieldBorder)"
            strokeWidth="2"
          />
          
          {/* Hexagonal grid overlay */}
          <path
            d="M50 5 L90 20 L90 50 Q90 90 50 115 Q10 90 10 50 L10 20 Z"
            fill="url(#hexPattern)"
          />
          
          {/* Inner shield detail */}
          <path
            d="M50 15 L80 27 L80 50 Q80 82 50 102 Q20 82 20 50 L20 27 Z"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          
          {/* Center checkmark for "secured" state */}
          <path
            d="M35 55 L45 65 L65 40"
            fill="none"
            stroke="hsl(var(--color-green-secure))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
          
          {/* Digital circuit lines */}
          <g stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.6">
            <line x1="25" y1="35" x2="35" y2="35" />
            <line x1="35" y1="35" x2="35" y2="45" />
            <line x1="65" y1="35" x2="75" y2="35" />
            <line x1="65" y1="35" x2="65" y2="45" />
            <line x1="25" y1="75" x2="35" y2="75" />
            <line x1="35" y1="75" x2="35" y2="65" />
            <line x1="65" y1="75" x2="75" y2="75" />
            <line x1="65" y1="75" x2="65" y2="65" />
          </g>
          
          {/* Corner nodes */}
          <circle cx="35" cy="35" r="2" fill="hsl(var(--primary))" />
          <circle cx="65" cy="35" r="2" fill="hsl(var(--primary))" />
          <circle cx="35" cy="75" r="2" fill="hsl(var(--primary))" />
          <circle cx="65" cy="75" r="2" fill="hsl(var(--primary))" />
        </svg>
      </div>
      
      {/* Secured glow ring */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-primary/20 animate-secured-pulse"
        style={{
          background: "radial-gradient(circle, hsl(var(--color-green-secure) / 0.05) 0%, transparent 70%)"
        }}
      />
      
      {/* Blocked indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2">
        <div className="w-2 h-2 rounded-full bg-green-secure animate-pulse" />
        <span className="text-xs font-medium text-primary">SECURED</span>
      </div>
    </div>
  );
};

export default AnimatedShield;
