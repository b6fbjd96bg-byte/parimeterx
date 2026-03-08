import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), 800);
    const removeTimer = setTimeout(() => setPhase("gone"), 1400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-600 ease-out"
      style={{ opacity: phase === "fading" ? 0 : 1 }}
    >
      <div
        className="flex flex-col items-center transition-all duration-600 ease-out"
        style={{
          opacity: phase === "fading" ? 0 : 1,
          transform: phase === "fading" ? "scale(1.02)" : "scale(1)",
        }}
      >
        <h1 className="text-3xl font-bold tracking-wider">
          <span className="text-foreground">PARAMETER</span>
          <span className="text-primary"> X</span>
        </h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
