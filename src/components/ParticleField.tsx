import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  type: "node" | "data";
}

interface DataStream {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  chars: string[];
  charIndex: number;
}

interface ThreatPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const streamsRef = useRef<DataStream[]>([]);
  const pulsesRef = useRef<ThreatPulse[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  const cyberChars = "01アイウエオカキクケコ⟨⟩∞Δ";

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const createParticles = () => {
      const count = Math.min(70, Math.floor(w() / 25));
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w(),
        y: Math.random() * h(),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        type: Math.random() < 0.15 ? "data" : "node",
      }));
    };

    const createStreams = () => {
      const count = Math.min(10, Math.floor(w() / 160));
      streamsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w(),
        y: Math.random() * h() * -1,
        speed: Math.random() * 1.2 + 0.4,
        length: Math.floor(Math.random() * 15 + 8),
        opacity: Math.random() * 0.12 + 0.04,
        chars: Array.from({ length: 25 }, () => cyberChars[Math.floor(Math.random() * cyberChars.length)]),
        charIndex: 0,
      }));
    };

    // Spawn periodic threat pulses
    const spawnPulse = () => {
      if (pulsesRef.current.length > 3) return;
      const colors = [
        "hsla(187, 100%, 60%,",  // cyan
        "hsla(140, 70%, 50%,",   // green
        "hsla(220, 80%, 60%,",   // blue
      ];
      pulsesRef.current.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        radius: 0,
        maxRadius: 80 + Math.random() * 120,
        opacity: 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    let pulseTimer = 0;

    const draw = () => {
      const dt = 0.016;
      timeRef.current += dt;
      pulseTimer += dt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w(), h());

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Spawn pulses periodically
      if (pulseTimer > 3 + Math.random() * 4) {
        pulseTimer = 0;
        spawnPulse();
      }

      // Draw threat pulses
      pulsesRef.current = pulsesRef.current.filter((p) => {
        p.radius += 1.2;
        const life = 1 - p.radius / p.maxRadius;
        if (life <= 0) return false;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = p.color + `${life * p.opacity})`;
        ctx.lineWidth = 1.5 * life;
        ctx.stroke();
        // Inner ring
        if (p.radius > 10) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = p.color + `${life * p.opacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        return true;
      });

      // Draw data streams
      streamsRef.current.forEach((stream) => {
        for (let i = 0; i < stream.length; i++) {
          const charY = stream.y + i * 18;
          if (charY < -20 || charY > h() + 20) continue;
          const fade = 1 - i / stream.length;
          const isHead = i === 0;
          const flicker = isHead ? (0.8 + Math.sin(timeRef.current * 15) * 0.2) : 1;
          ctx.font = `${isHead ? 14 : 12}px monospace`;
          ctx.fillStyle = isHead
            ? `hsla(187, 100%, 75%, ${stream.opacity * 2 * flicker})`
            : `hsla(187, 100%, 50%, ${stream.opacity * fade * 0.8})`;
          const char = stream.chars[(Math.floor(stream.charIndex) + i) % stream.chars.length];
          ctx.fillText(char, stream.x, charY);
        }
        stream.y += stream.speed;
        stream.charIndex += 0.08;
        if (stream.y - stream.length * 18 > h()) {
          stream.y = -stream.length * 18;
          stream.x = Math.random() * w();
          stream.speed = Math.random() * 1.2 + 0.4;
        }
        if (Math.random() < 0.03) {
          const idx = Math.floor(Math.random() * stream.chars.length);
          stream.chars[idx] = cyberChars[Math.floor(Math.random() * cyberChars.length)];
        }
      });

      // Build spatial grid for connections (optimization)
      const connectionDist = 200;
      const particles = particlesRef.current;

      // Update & draw particles
      particles.forEach((p, i) => {
        // Mouse interaction - attraction at far, repulsion close
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          if (dist < 80) {
            // Repulsion
            const force = (80 - dist) / 80 * 0.6;
            p.vx += (dx / dist) * force * 0.12;
            p.vy += (dy / dist) * force * 0.12;
          } else {
            // Gentle attraction
            const force = (dist - 80) / 120 * 0.15;
            p.vx -= (dx / dist) * force * 0.02;
            p.vy -= (dy / dist) * force * 0.02;
          }
        }

        // Damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Gentle drift
        p.vx += (Math.random() - 0.5) * 0.008;
        p.vy += (Math.random() - 0.5) * 0.008;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w() + 10;
        if (p.x > w() + 10) p.x = -10;
        if (p.y < -10) p.y = h() + 10;
        if (p.y > h() + 10) p.y = -10;

        // Pulsing
        const pulse = Math.sin(timeRef.current * p.pulseSpeed * 60 + p.pulsePhase) * 0.5 + 0.5;
        const currentOpacity = p.opacity * (0.4 + pulse * 0.6);

        // Draw particle
        if (p.type === "data") {
          // Data nodes are diamond-shaped
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4 + timeRef.current * 0.5);
          ctx.fillStyle = `hsla(187, 100%, 65%, ${currentOpacity})`;
          ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
          // Data node glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(187, 100%, 50%, ${currentOpacity * 0.08})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(187, 100%, 60%, ${currentOpacity})`;
          ctx.fill();

          // Subtle glow on larger nodes
          if (p.size > 1.5) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(187, 100%, 50%, ${currentOpacity * 0.06})`;
            ctx.fill();
          }
        }

        // Connections (network topology lines)
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const cdx = p.x - other.x;
          const cdy = p.y - other.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < connectionDist) {
            const lineOpacity = 0.1 * (1 - cdist / connectionDist);

            // Animated dash offset for "data flowing" effect
            ctx.beginPath();
            ctx.setLineDash([3, 6]);
            ctx.lineDashOffset = -timeRef.current * 20;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(187, 100%, 50%, ${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.setLineDash([]);

            // Traveling data packet along connection
            if (cdist < 120 && (i + j) % 7 === Math.floor(timeRef.current * 2) % 7) {
              const t = (timeRef.current * 0.5 + i * 0.1) % 1;
              const px = p.x + (other.x - p.x) * t;
              const py = p.y + (other.y - p.y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(187, 100%, 80%, ${lineOpacity * 4})`;
              ctx.fill();
            }
          }
        }

        // Mouse proximity energy ring
        if (dist < 250 && dist > 0) {
          const highlight = (250 - dist) / 250;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + highlight * 6, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(187, 100%, 65%, ${highlight * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Mouse cursor energy field
      if (mx > 0 && my > 0) {
        const cursorPulse = Math.sin(timeRef.current * 3) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(mx, my, 40 + cursorPulse * 15, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(187, 100%, 50%, ${0.04 + cursorPulse * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Crosshair
        const chSize = 8;
        ctx.strokeStyle = `hsla(187, 100%, 60%, ${0.08 + cursorPulse * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(mx - chSize, my); ctx.lineTo(mx + chSize, my);
        ctx.moveTo(mx, my - chSize); ctx.lineTo(mx, my + chSize);
        ctx.stroke();
      }

      // Subtle hex grid near mouse
      const gridSize = 50;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w(); x += gridSize) {
        for (let y = 0; y < h(); y += gridSize * 0.866) {
          const offset = Math.floor(y / (gridSize * 0.866)) % 2 === 0 ? 0 : gridSize / 2;
          const hx = x + offset;
          const hdx = hx - mx;
          const hdy = y - my;
          const hdist = Math.sqrt(hdx * hdx + hdy * hdy);
          if (hdist < 250) {
            const hOpacity = (250 - hdist) / 250 * 0.035;
            ctx.strokeStyle = `hsla(187, 100%, 50%, ${hOpacity})`;
            drawHexagon(ctx, hx, y, gridSize * 0.28);
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    createParticles();
    createStreams();
    draw();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
      createStreams();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const hx = x + r * Math.cos(angle);
    const hy = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.stroke();
}

export default ParticleField;
