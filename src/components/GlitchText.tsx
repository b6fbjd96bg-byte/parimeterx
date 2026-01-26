import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
}

const GlitchText = ({ text, className = "", glitchOnHover = true }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?0123456789";

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const maxIterations = text.length * 2;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iterations / 2) {
              return text[index];
            }
            if (char === " ") return " ";
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("")
      );

      iterations++;

      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isGlitching, text]);

  // Periodic glitch effect when not hovering
  useEffect(() => {
    if (glitchOnHover) return;

    const triggerGlitch = () => {
      setIsGlitching(true);
    };

    const interval = setInterval(triggerGlitch, 5000);
    return () => clearInterval(interval);
  }, [glitchOnHover]);

  return (
    <span
      className={`relative ${className}`}
      onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
    >
      <span className="relative z-10">{displayText}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-[hsl(var(--color-red-team))] opacity-70 z-0"
            style={{ transform: "translate(-2px, 0)", clipPath: "inset(20% 0 40% 0)" }}
          >
            {displayText}
          </span>
          <span
            className="absolute inset-0 text-[hsl(var(--color-blue-ai))] opacity-70 z-0"
            style={{ transform: "translate(2px, 0)", clipPath: "inset(60% 0 10% 0)" }}
          >
            {displayText}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;
