import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-border/30">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"
        style={{ left: `calc(${progress}% - 40px)` }}
      />
    </div>
  );
};

export default ScrollProgress;
