import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 25);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      <div className="relative z-10 flex flex-col items-center">
        {/* Brand Name */}
        <h1 className="text-3xl font-bold mb-6 tracking-wider">
          <span className="text-foreground">PARAMETER</span>
          <span className="text-primary"> X</span>
        </h1>

        {/* Progress Bar */}
        <div className="w-48 h-0.5 bg-border/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
