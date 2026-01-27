import { useEffect, useState } from "react";

interface ParallaxOptions {
  speed?: number; // 0.1 = slow, 1 = same as scroll, 2 = faster than scroll
  direction?: "up" | "down";
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = "up" } = options;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const multiplier = direction === "up" ? -1 : 1;
      setOffset(scrollY * speed * multiplier);
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, direction]);

  return offset;
};

export default useParallax;
