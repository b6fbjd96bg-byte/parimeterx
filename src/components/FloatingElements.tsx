import { Shield, Lock, Key, Eye, Fingerprint, Wifi, Database, Code } from "lucide-react";
import { useParallax } from "@/hooks/useParallax";

const icons = [Shield, Lock, Key, Eye, Fingerprint, Wifi, Database, Code];

interface FloatingElement {
  icon: typeof Shield;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  parallaxSpeed: number;
}

const generateElements = (): FloatingElement[] => {
  return icons.map((icon, index) => ({
    icon,
    x: 5 + (index * 12) % 90,
    y: 10 + ((index * 17) % 80),
    size: 16 + (index % 3) * 8,
    duration: 15 + (index % 5) * 5,
    delay: index * 0.5,
    parallaxSpeed: 0.1 + (index % 4) * 0.1, // Varying speeds for depth
  }));
};

const FloatingElements = () => {
  const elements = generateElements();
  
  // Multiple parallax layers for depth effect
  const parallax1 = useParallax({ speed: 0.1 });
  const parallax2 = useParallax({ speed: 0.2 });
  const parallax3 = useParallax({ speed: 0.3 });
  const parallax4 = useParallax({ speed: 0.15, direction: "down" });

  const parallaxOffsets = [parallax1, parallax2, parallax3, parallax4];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((element, index) => {
        const Icon = element.icon;
        const parallaxOffset = parallaxOffsets[index % 4];
        
        return (
          <div
            key={index}
            className="absolute opacity-[0.03] text-primary will-change-transform"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `translateY(${parallaxOffset}px)`,
              animation: `float-${index % 4} ${element.duration}s ease-in-out infinite`,
              animationDelay: `${element.delay}s`,
            }}
          >
            <Icon size={element.size} />
          </div>
        );
      })}
      
      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -30px) rotate(5deg); }
          50% { transform: translate(-10px, -50px) rotate(-5deg); }
          75% { transform: translate(-30px, -20px) rotate(3deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, -40px) rotate(-8deg); }
          66% { transform: translate(15px, -25px) rotate(4deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -45px) rotate(10deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-15px, -20px) rotate(-3deg); }
          40% { transform: translate(10px, -35px) rotate(6deg); }
          60% { transform: translate(-20px, -50px) rotate(-4deg); }
          80% { transform: translate(5px, -30px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;
