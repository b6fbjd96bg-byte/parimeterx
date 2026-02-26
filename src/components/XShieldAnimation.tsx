import { useEffect, useState, useRef } from "react";

const XShieldAnimation = () => {
  const [mounted, setMounted] = useState(false);
  const [scanAngle, setScanAngle] = useState(0);
  const [threatDetected, setThreatDetected] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    let raf: number;
    let angle = 0;
    const animate = () => {
      angle = (angle + 1.5) % 360;
      frameRef.current++;
      setScanAngle(angle);
      // Periodic threat flash
      if (frameRef.current % 180 === 0) {
        setThreatDetected(true);
        setTimeout(() => setThreatDetected(false), 800);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dataNodes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const radius = i % 2 === 0 ? 120 : 95;
    return { x: 150 + Math.cos(angle) * radius, y: 150 + Math.sin(angle) * radius, delay: i * 0.2, ring: i % 2 };
  });

  const scanRad = (scanAngle * Math.PI) / 180;
  const scanX = 150 + Math.cos(scanRad) * 125;
  const scanY = 150 + Math.sin(scanRad) * 125;

  // Shield energy segments
  const shieldSegments = Array.from({ length: 6 }, (_, i) => {
    const startAngle = i * 60 - 90;
    const endAngle = startAngle + 50;
    const r = 135;
    const x1 = 150 + Math.cos((startAngle * Math.PI) / 180) * r;
    const y1 = 150 + Math.sin((startAngle * Math.PI) / 180) * r;
    const x2 = 150 + Math.cos((endAngle * Math.PI) / 180) * r;
    const y2 = 150 + Math.sin((endAngle * Math.PI) / 180) * r;
    return { x1, y1, x2, y2, startAngle, endAngle, r };
  });

  return (
    <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] flex items-center justify-center">
      <svg
        viewBox="0 0 300 300"
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <defs>
          <linearGradient id="xGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(187, 100%, 65%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(187, 100%, 40%)" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(187, 100%, 55%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="threatGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(0, 80%, 55%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(0, 80%, 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Sweep gradient for radar */}
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(187, 100%, 60%)" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(187, 100%, 60%)" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Shield energy barrier segments */}
        {shieldSegments.map((seg, i) => {
          const arcPath = describeArc(150, 150, seg.r, seg.startAngle, seg.endAngle);
          const isActive = Math.abs(((scanAngle - (seg.startAngle + 90) + 360) % 360)) < 60;
          return (
            <path
              key={`shield-${i}`}
              d={arcPath}
              fill="none"
              stroke={threatDetected ? "hsl(0, 80%, 55%)" : "hsl(187, 100%, 55%)"}
              strokeWidth={isActive ? "2.5" : "1"}
              opacity={isActive ? 0.6 : 0.15}
              strokeLinecap="round"
              filter={isActive ? "url(#glow)" : undefined}
            />
          );
        })}

        {/* Outer boundary ring */}
        <circle cx="150" cy="150" r="142" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.4" opacity="0.1">
          <animate attributeName="r" values="140;144;140" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Rotating dashed ring */}
        <circle
          cx="150" cy="150" r="125"
          fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.8" strokeDasharray="5 10 2 10" opacity="0.2"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="25s" repeatCount="indefinite" />
        </circle>

        {/* Counter-rotating inner ring */}
        <circle
          cx="150" cy="150" r="95"
          fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.5" strokeDasharray="2 6 4 6" opacity="0.12"
        >
          <animateTransform attributeName="transform" type="rotate" from="360 150 150" to="0 150 150" dur="18s" repeatCount="indefinite" />
        </circle>

        {/* Inner scanning ring */}
        <circle
          cx="150" cy="150" r="70"
          fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.4" strokeDasharray="1 4" opacity="0.1"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="-360 150 150" dur="12s" repeatCount="indefinite" />
        </circle>

        {/* Radar sweep line with gradient trail */}
        <line
          x1="150" y1="150" x2={scanX} y2={scanY}
          stroke="hsl(187, 100%, 60%)" strokeWidth="1.5" opacity="0.5" filter="url(#glow)"
        />
        {/* Sweep trail arcs */}
        {[...Array(10)].map((_, i) => {
          const trailAngle = ((scanAngle - i * 5) * Math.PI) / 180;
          const tx = 150 + Math.cos(trailAngle) * 125;
          const ty = 150 + Math.sin(trailAngle) * 125;
          return (
            <line
              key={i}
              x1="150" y1="150" x2={tx} y2={ty}
              stroke="hsl(187, 100%, 50%)"
              strokeWidth="0.4"
              opacity={0.12 - i * 0.012}
            />
          );
        })}

        {/* Sweep head dot */}
        <circle cx={scanX} cy={scanY} r="3.5" fill="hsl(187, 100%, 70%)" opacity="0.8" filter="url(#glow)">
          <animate attributeName="r" values="2.5;4.5;2.5" dur="0.8s" repeatCount="indefinite" />
        </circle>

        {/* Data nodes with network connections */}
        {dataNodes.map((node, i) => {
          const angleDiff = Math.abs(((scanAngle - i * 30 + 360) % 360));
          const isLit = angleDiff < 25 || angleDiff > 335;
          const isNearby = angleDiff < 60 || angleDiff > 300;
          return (
            <g key={i}>
              {/* Connection to center - dashed data flow */}
              <line
                x1="150" y1="150" x2={node.x} y2={node.y}
                stroke="hsl(187, 100%, 50%)"
                strokeWidth={isLit ? "1.2" : "0.25"}
                opacity={isLit ? 0.5 : isNearby ? 0.12 : 0.05}
                strokeDasharray={isLit ? "3 4" : "2 8"}
              />
              {/* Inter-node connections */}
              {i < dataNodes.length - 1 && node.ring === dataNodes[i + 1].ring && (
                <line
                  x1={node.x} y1={node.y}
                  x2={dataNodes[i + 1].x} y2={dataNodes[i + 1].y}
                  stroke="hsl(187, 100%, 50%)"
                  strokeWidth="0.3"
                  opacity={isLit ? 0.3 : 0.05}
                />
              )}
              {/* Node dot */}
              <circle
                cx={node.x} cy={node.y} r={isLit ? 4 : node.ring === 0 ? 2.5 : 1.8}
                fill={isLit ? "hsl(187, 100%, 65%)" : "hsl(187, 100%, 50%)"}
                opacity={isLit ? 0.95 : isNearby ? 0.35 : 0.15}
                filter={isLit ? "url(#glow)" : undefined}
              />
              {/* Active node ripple */}
              {isLit && (
                <>
                  <circle cx={node.x} cy={node.y} r="6" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.6" opacity="0.5">
                    <animate attributeName="r" values="5;14;5" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  {/* Data label */}
                  <text x={node.x + 8} y={node.y - 6} fill="hsl(187, 100%, 60%)" fontSize="5" opacity="0.5" fontFamily="monospace">
                    {`N${i.toString(16).toUpperCase()}`}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Globe wireframe */}
        <g opacity="0.12">
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="45s" repeatCount="indefinite" />
          <ellipse cx="150" cy="150" rx="55" ry="55" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.5" />
          <ellipse cx="150" cy="150" rx="55" ry="22" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.4" />
          <ellipse cx="150" cy="150" rx="22" ry="55" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.4" />
          <ellipse cx="150" cy="150" rx="55" ry="38" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.3" transform="rotate(60 150 150)" />
          <ellipse cx="150" cy="150" rx="55" ry="38" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.3" transform="rotate(-60 150 150)" />
        </g>

        {/* Center X logo */}
        <g filter="url(#strongGlow)">
          <path d="M132,132 L168,168" stroke="url(#xGrad2)" strokeWidth="7" strokeLinecap="round" />
          <path d="M168,132 L132,168" stroke="url(#xGrad2)" strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* Center energy pulse */}
        <circle cx="150" cy="150" r="20" fill={threatDetected ? "url(#threatGrad)" : "url(#pulseGrad)"}>
          <animate attributeName="r" values="18;40;18" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Secondary pulse ring */}
        <circle cx="150" cy="150" r="25" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.3" opacity="0.15">
          <animate attributeName="r" values="25;50;25" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Orbiting satellites */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`orbit-${i}`}>
            <circle cx="150" cy="150" r="1.5" fill="hsl(187, 100%, 75%)" opacity="0.6">
              <animateMotion
                dur={`${7 + i * 2.5}s`}
                repeatCount="indefinite"
                path={`M0,0 A${75 + i * 18},${75 + i * 18} 0 1 1 0.01,0`}
              />
            </circle>
            {/* Satellite trail */}
            <circle cx="150" cy="150" r="1" fill="hsl(187, 100%, 60%)" opacity="0.2">
              <animateMotion
                dur={`${7 + i * 2.5}s`}
                repeatCount="indefinite"
                begin={`-${0.3 + i * 0.1}s`}
                path={`M0,0 A${75 + i * 18},${75 + i * 18} 0 1 1 0.01,0`}
              />
            </circle>
          </g>
        ))}

        {/* Threat detection flash */}
        {threatDetected && (
          <circle cx="150" cy="150" r="145" fill="none" stroke="hsl(0, 80%, 55%)" strokeWidth="2" opacity="0.3">
            <animate attributeName="opacity" values="0.4;0;0.4;0" dur="0.8s" fill="freeze" />
          </circle>
        )}
      </svg>

      {/* Ambient glow */}
      <div
        className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full"
        style={{
          background: threatDetected
            ? "radial-gradient(circle, hsl(0 80% 50% / 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          animation: "pulse 3s ease-in-out infinite",
          transition: "background 0.3s ease",
        }}
      />

      {/* Status indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/40 rounded-full px-4 py-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${threatDetected ? "bg-destructive" : "bg-primary"} animate-pulse`} />
        <span className={`text-xs font-medium tracking-wider ${threatDetected ? "text-destructive" : "text-muted-foreground"}`}>
          {threatDetected ? "THREAT DETECTED" : "SCANNING"}
        </span>
      </div>
    </div>
  );
};

// Helper: describe SVG arc path
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default XShieldAnimation;
