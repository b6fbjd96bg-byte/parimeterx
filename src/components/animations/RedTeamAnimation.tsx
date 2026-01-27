import { useEffect, useState } from "react";

const RedTeamAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [hackerPositions, setHackerPositions] = useState([
    { x: 10, y: 30, active: false },
    { x: 15, y: 60, active: false },
    { x: 8, y: 80, active: false },
  ]);
  const [attackLines, setAttackLines] = useState<{ id: number; progress: number }[]>([]);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 3000);

    const animateHackers = setInterval(() => {
      setHackerPositions((prev) =>
        prev.map((h, i) => ({
          ...h,
          active: Math.random() > 0.3,
          x: 10 + Math.sin(Date.now() / 1000 + i) * 5,
        }))
      );
    }, 500);

    const attackInterval = setInterval(() => {
      setAttackLines((prev) => {
        const updated = prev.map((l) => ({ ...l, progress: l.progress + 3 })).filter((l) => l.progress <= 100);
        if (Math.random() > 0.7 && updated.length < 5) {
          updated.push({ id: Date.now(), progress: 0 });
        }
        return updated;
      });
    }, 50);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(animateHackers);
      clearInterval(attackInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="red-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(var(--color-red-team))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#red-grid)" />
        </svg>
      </div>

      {/* Target building/fortress */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-48">
        {/* Fortress walls */}
        <div className={`absolute inset-0 border-4 rounded-lg transition-all duration-500 ${
          phase >= 3 
            ? "border-[hsl(var(--color-red-team))] shadow-[0_0_30px_hsl(var(--color-red-team)/0.5)]" 
            : "border-[hsl(var(--color-green-secure)/0.5)]"
        }`}>
          {/* Windows/targets */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 rounded transition-all duration-300 ${
                phase > i / 2 ? "bg-[hsl(var(--color-red-team))]" : "bg-border"
              }`}
              style={{
                left: `${20 + (i % 2) * 50}%`,
                top: `${15 + Math.floor(i / 2) * 30}%`,
              }}
            />
          ))}
          
          {/* Door */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 rounded-t-lg border-2 transition-all duration-500 ${
            phase >= 2 ? "border-[hsl(var(--color-red-team))] bg-[hsl(var(--color-red-team)/0.3)]" : "border-border bg-card"
          }`} />
        </div>
        
        {/* Shield around building */}
        <div className={`absolute -inset-4 rounded-xl border-2 border-dashed transition-all duration-500 ${
          phase < 2 ? "border-[hsl(var(--color-green-secure))] opacity-100" : "border-[hsl(var(--color-red-team))] opacity-30"
        }`} />
      </div>

      {/* Red team hackers */}
      {hackerPositions.map((hacker, index) => (
        <div
          key={index}
          className="absolute transition-all duration-300"
          style={{ left: `${hacker.x}%`, top: `${hacker.y}%` }}
        >
          {/* Hacker figure */}
          <div className={`relative transition-all duration-300 ${hacker.active ? "scale-110" : "scale-100"}`}>
            {/* Hood */}
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-red-team))] relative">
              {/* Eyes */}
              <div className="absolute top-3 left-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <div className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
            {/* Body */}
            <div className="w-6 h-8 bg-[hsl(var(--color-red-team)/0.8)] rounded-b mx-auto -mt-1" />
            
            {/* Keyboard glow when active */}
            {hacker.active && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-[hsl(var(--color-red-team)/0.5)] rounded blur animate-pulse" />
            )}
          </div>
          
          {/* Attack indicator */}
          {hacker.active && (
            <div className="absolute -right-8 top-1/2 text-xs text-[hsl(var(--color-red-team))] font-mono animate-pulse">
              &gt;_
            </div>
          )}
        </div>
      ))}

      {/* Attack lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {attackLines.map((line, index) => {
          const startX = 15;
          const startY = 30 + (index % 3) * 25;
          const endX = 70;
          const endY = 50;
          const currentX = startX + (endX - startX) * (line.progress / 100);
          const currentY = startY + (endY - startY) * (line.progress / 100);
          
          return (
            <g key={line.id}>
              <line
                x1={`${startX}%`}
                y1={`${startY}%`}
                x2={`${currentX}%`}
                y2={`${currentY}%`}
                stroke="hsl(var(--color-red-team))"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity={1 - line.progress / 150}
              />
              <circle
                cx={`${currentX}%`}
                cy={`${currentY}%`}
                r="4"
                fill="hsl(var(--color-red-team))"
                className="animate-pulse"
              />
            </g>
          );
        })}
      </svg>

      {/* Phase indicators */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {["Recon", "Access", "Escalate", "Exfil"].map((label, i) => (
          <div
            key={i}
            className={`px-2 py-1 rounded text-xs font-mono transition-all duration-300 ${
              phase >= i
                ? "bg-[hsl(var(--color-red-team))] text-white"
                : "bg-border text-muted-foreground"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Terminal output */}
      <div className="absolute top-4 left-4 w-40 h-20 bg-black/80 rounded border border-[hsl(var(--color-red-team)/0.5)] p-2 font-mono text-[10px] text-[hsl(var(--color-red-team))] overflow-hidden">
        <div className="animate-pulse">&gt; initiating attack...</div>
        <div className={phase >= 1 ? "opacity-100" : "opacity-0"}>&gt; access granted</div>
        <div className={phase >= 2 ? "opacity-100" : "opacity-0"}>&gt; escalating privs</div>
        <div className={phase >= 3 ? "opacity-100" : "opacity-0"}>&gt; data exfiltrated</div>
      </div>
    </div>
  );
};

export default RedTeamAnimation;
