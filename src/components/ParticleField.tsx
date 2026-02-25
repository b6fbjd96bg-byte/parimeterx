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

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const streamsRef = useRef<DataStream[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  const hexChars = "0123456789ABCDEF";
  const cyberChars = "01アイウエオカキクケコ";

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.min(50, Math.floor(window.innerWidth / 35));
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      }));
    };

    const createStreams = () => {
      const count = Math.min(8, Math.floor(window.innerWidth / 200));
      streamsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * -1,
        speed: Math.random() * 1.5 + 0.5,
        length: Math.floor(Math.random() * 12 + 6),
        opacity: Math.random() * 0.15 + 0.05,
        chars: Array.from({ length: 20 }, () => cyberChars[Math.floor(Math.random() * cyberChars.length)]),
        charIndex: 0,
      }));
    };

    const draw = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw data streams (matrix rain effect)
      streamsRef.current.forEach((stream) => {
        for (let i = 0; i < stream.length; i++) {
          const charY = stream.y + i * 16;
          if (charY < 0 || charY > canvas.height) continue;
          const fade = 1 - i / stream.length;
          const isHead = i === 0;
          ctx.font = "12px monospace";
          ctx.fillStyle = isHead
            ? `hsla(187, 100%, 70%, ${stream.opacity * 1.5})`
            : `hsla(187, 100%, 50%, ${stream.opacity * fade})`;
          const char = stream.chars[(stream.charIndex + i) % stream.chars.length];
          ctx.fillText(char, stream.x, charY);
        }
        stream.y += stream.speed;
        stream.charIndex += 0.05;
        if (stream.y - stream.length * 16 > canvas.height) {
          stream.y = -stream.length * 16;
          stream.x = Math.random() * canvas.width;
        }
        // Randomly mutate chars
        if (Math.random() < 0.02) {
          const idx = Math.floor(Math.random() * stream.chars.length);
          stream.chars[idx] = cyberChars[Math.floor(Math.random() * cyberChars.length)];
        }
      });

      // Draw particles with mouse interaction
      particlesRef.current.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.8;
          p.vx += (dx / dist) * force * 0.1;
          p.vy += (dy / dist) * force * 0.1;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Base drift
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulsing opacity
        const pulse = Math.sin(timeRef.current * p.pulseSpeed * 60 + p.pulsePhase) * 0.5 + 0.5;
        const currentOpacity = p.opacity * (0.5 + pulse * 0.5);

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 100%, 60%, ${currentOpacity})`;
        ctx.fill();

        // Glow ring on larger particles
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(187, 100%, 50%, ${currentOpacity * 0.1})`;
          ctx.fill();
        }

        // Connections
        particlesRef.current.slice(i + 1).forEach((other) => {
          const cdx = p.x - other.x;
          const cdy = p.y - other.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < 180) {
            const lineOpacity = 0.08 * (1 - cdist / 180);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(187, 100%, 50%, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Hex data on connections occasionally
            if (cdist < 80 && Math.random() < 0.001) {
              const midX = (p.x + other.x) / 2;
              const midY = (p.y + other.y) / 2;
              ctx.font = "8px monospace";
              ctx.fillStyle = `hsla(187, 100%, 60%, ${lineOpacity * 3})`;
              const hex = Array.from({ length: 4 }, () => hexChars[Math.floor(Math.random() * 16)]).join("");
              ctx.fillText(hex, midX - 10, midY);
            }
          }
        });

        // Mouse proximity highlight
        if (dist < 200 && dist > 0) {
          const highlight = (200 - dist) / 200;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2 + highlight * 4, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(187, 100%, 60%, ${highlight * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Draw subtle hex grid overlay
      const gridSize = 60;
      const scrollOffset = (timeRef.current * 5) % gridSize;
      ctx.strokeStyle = "hsla(187, 100%, 50%, 0.015)";
      ctx.lineWidth = 0.5;
      for (let x = -gridSize + scrollOffset; x < canvas.width + gridSize; x += gridSize) {
        for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize * 0.866) {
          const offset = Math.floor(y / (gridSize * 0.866)) % 2 === 0 ? 0 : gridSize / 2;
          const hx = x + offset;
          // Only draw if near mouse for subtle interactivity
          const hdx = hx - mx;
          const hdy = y - my;
          const hdist = Math.sqrt(hdx * hdx + hdy * hdy);
          if (hdist < 300) {
            const hOpacity = (300 - hdist) / 300 * 0.04;
            ctx.strokeStyle = `hsla(187, 100%, 50%, ${hOpacity})`;
            drawHexagon(ctx, hx, y, gridSize * 0.3);
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    createParticles();
    createStreams();
    draw();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
      createStreams();
    });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
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
