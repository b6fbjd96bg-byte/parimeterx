import { useEffect, useState } from "react";

const XShieldAnimation = () => {
  const [mounted, setMounted] = useState(false);
  const [scanAngle, setScanAngle] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const dataNodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const radius = 120;
    return { x: 150 + Math.cos(angle) * radius, y: 150 + Math.sin(angle) * radius, delay: i * 0.3 };
  });

  const scanRad = (scanAngle * Math.PI) / 180;
  const scanX = 150 + Math.cos(scanRad) * 120;
  const scanY = 150 + Math.sin(scanRad) * 120;

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
      <svg
        viewBox="0 0 300 300"
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <defs>
          <linearGradient id="xGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(187, 100%, 60%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(187, 100%, 40%)" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer pulse rings */}
        <circle cx="150" cy="150" r="140" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.5" opacity="0.1" />
        <circle cx="150" cy="150" r="130" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.3" opacity="0.08">
          <animate attributeName="r" values="125;135;125" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.15;0.08" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Rotating dashed ring */}
        <circle
          cx="150" cy="150" r="120"
          fill="none"
          stroke="hsl(187, 100%, 50%)"
          strokeWidth="0.8"
          strokeDasharray="8 12"
          opacity="0.2"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="30s" repeatCount="indefinite" />
        </circle>

        {/* Counter-rotating ring */}
        <circle
          cx="150" cy="150" r="100"
          fill="none"
          stroke="hsl(187, 100%, 50%)"
          strokeWidth="0.5"
          strokeDasharray="3 8"
          opacity="0.12"
        >
          <animateTransform attributeName="transform" type="rotate" from="360 150 150" to="0 150 150" dur="20s" repeatCount="indefinite" />
        </circle>

        {/* Radar sweep */}
        <path
          d={`M150,150 L${scanX},${scanY}`}
          stroke="hsl(187, 100%, 60%)"
          strokeWidth="1.5"
          opacity="0.4"
          filter="url(#glow)"
        />
        {/* Sweep trail */}
        {[...Array(6)].map((_, i) => {
          const trailAngle = ((scanAngle - i * 8) * Math.PI) / 180;
          const tx = 150 + Math.cos(trailAngle) * 120;
          const ty = 150 + Math.sin(trailAngle) * 120;
          return (
            <path
              key={i}
              d={`M150,150 L${tx},${ty}`}
              stroke="hsl(187, 100%, 50%)"
              strokeWidth="0.5"
              opacity={0.15 - i * 0.02}
            />
          );
        })}

        {/* Sweep arc glow */}
        <circle cx={scanX} cy={scanY} r="4" fill="hsl(187, 100%, 60%)" opacity="0.6" filter="url(#glow)">
          <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Data nodes with connections */}
        {dataNodes.map((node, i) => {
          const angleDiff = Math.abs(((scanAngle - i * 45 + 360) % 360));
          const isLit = angleDiff < 30 || angleDiff > 330;
          return (
            <g key={i}>
              {/* Connection to center */}
              <line
                x1="150" y1="150" x2={node.x} y2={node.y}
                stroke="hsl(187, 100%, 50%)"
                strokeWidth={isLit ? "1" : "0.3"}
                opacity={isLit ? 0.4 : 0.08}
                strokeDasharray="4 6"
              />
              {/* Node */}
              <circle
                cx={node.x} cy={node.y} r={isLit ? 4 : 2.5}
                fill={isLit ? "hsl(187, 100%, 60%)" : "hsl(187, 100%, 50%)"}
                opacity={isLit ? 0.9 : 0.3}
                filter={isLit ? "url(#glow)" : undefined}
              />
              {/* Node outer ring when active */}
              {isLit && (
                <circle cx={node.x} cy={node.y} r="8" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.5" opacity="0.4">
                  <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Globe / sphere */}
        <g opacity="0.15">
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="50s" repeatCount="indefinite" />
          <ellipse cx="150" cy="150" rx="60" ry="60" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.5" />
          <ellipse cx="150" cy="150" rx="60" ry="25" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.4" />
          <ellipse cx="150" cy="150" rx="25" ry="60" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.4" />
          <ellipse cx="150" cy="150" rx="60" ry="40" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.3" transform="rotate(45 150 150)" />
        </g>

        {/* Center X logo with glow */}
        <g filter="url(#softGlow)">
          <path d="M130,130 L170,170" stroke="url(#xGrad2)" strokeWidth="8" strokeLinecap="round" />
          <path d="M170,130 L130,170" stroke="url(#xGrad2)" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* Central pulse */}
        <circle cx="150" cy="150" r="20" fill="url(#pulseGrad)">
          <animate attributeName="r" values="15;35;15" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Orbiting small dots */}
        {[0, 1, 2].map((i) => (
          <circle key={`orbit-${i}`} cx="150" cy="150" r="2" fill="hsl(187, 100%, 70%)" opacity="0.5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${i * 120} 150 150`}
              to={`${i * 120 + 360} 150 150`}
              dur={`${8 + i * 2}s`}
              repeatCount="indefinite"
            />
            <animateMotion
              dur={`${8 + i * 2}s`}
              repeatCount="indefinite"
              path={`M0,0 A${85 + i * 15},${85 + i * 15} 0 1 1 0.01,0`}
            />
          </circle>
        ))}
      </svg>

      {/* Ambient glow */}
      <div
        className="absolute w-48 h-48 md:w-56 md:h-56 rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Status indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/40 rounded-full px-4 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-medium text-muted-foreground tracking-wider">SCANNING</span>
      </div>
    </div>
  );
};

export default XShieldAnimation;
