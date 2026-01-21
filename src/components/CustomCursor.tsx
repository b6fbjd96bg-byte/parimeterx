import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const requestRef = useRef<number>();
  const positionRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check for touch device after mount
    const checkTouchDevice = () => {
      const hasTouchScreen = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      setIsTouchDevice(hasTouchScreen);
      return hasTouchScreen;
    };

    if (checkTouchDevice()) {
      return;
    }

    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);
      
      positionRef.current = { x: currentX, y: currentY };
      setPosition({ x: currentX, y: currentY });
      
      requestRef.current = requestAnimationFrame(animate);
    };

    const updateCursor = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!isVisible) {
        setIsVisible(true);
      }
      
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        !!target.closest('[role="button"]') ||
        !!target.closest('input') ||
        !!target.closest('label') ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor using a style element for better compatibility
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {/* Main cursor dot */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.75 : isPointer ? 1.5 : 1})`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
      >
        <div 
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--primary))',
          }}
        />
      </div>

      {/* Cursor ring */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.5 : isPointer ? 1.5 : 1})`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
          pointerEvents: 'none',
          zIndex: 99998,
        }}
      >
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: `2px solid ${isPointer ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)'}`,
            backgroundColor: isPointer ? 'hsl(var(--primary) / 0.1)' : 'transparent',
            transition: 'border-color 0.2s ease-out, background-color 0.2s ease-out',
          }}
        />
      </div>

      {/* Trailing glow effect */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 0.3 : 0,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: 'none',
          zIndex: 99997,
        }}
      >
        <div 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--primary) / 0.2)',
            filter: 'blur(20px)',
          }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;
