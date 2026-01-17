import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Hide loading screen after animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Shield Logo */}
        <div className="relative mb-8">
          {/* Scanning waves */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-20 h-20 rounded-full border border-primary/30 animate-scan-wave" style={{ animationDelay: "0s" }} />
            <div className="absolute w-20 h-20 rounded-full border border-primary/30 animate-scan-wave" style={{ animationDelay: "0.5s" }} />
            <div className="absolute w-20 h-20 rounded-full border border-primary/30 animate-scan-wave" style={{ animationDelay: "1s" }} />
          </div>
          
          {/* Shield icon */}
          <div className="w-20 h-20 rounded-2xl bg-card border-2 border-primary flex items-center justify-center animate-pulse-glow">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold mb-4 tracking-wider">
          <span className="text-foreground">PARAMETER</span>
          <span className="text-primary text-glow"> X</span>
        </h1>

        {/* Tagline */}
        <p className="text-muted-foreground text-sm mb-8 tracking-wide">
          Defining the Next Edge of Defense
        </p>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-100 ease-out box-glow"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-xs text-primary mt-4 animate-pulse">
          Initializing Security Systems...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
