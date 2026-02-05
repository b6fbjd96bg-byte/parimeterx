 import { useEffect, useState } from "react";
 
 const XShieldAnimation = () => {
   const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
   const [attacks, setAttacks] = useState<{ id: number; angle: number; distance: number }[]>([]);
 
   useEffect(() => {
     // Generate initial particles
     const initialParticles = Array.from({ length: 50 }, (_, i) => ({
       id: i,
       x: Math.random() * 100,
       y: Math.random() * 100,
       size: Math.random() * 3 + 1,
       delay: Math.random() * 5,
     }));
     setParticles(initialParticles);
 
     // Generate attack particles
     const attackInterval = setInterval(() => {
       const newAttack = {
         id: Date.now() + Math.random(),
         angle: Math.random() * 360,
         distance: 180 + Math.random() * 40,
       };
       setAttacks((prev) => [...prev.slice(-8), newAttack]);
     }, 600);
 
     return () => clearInterval(attackInterval);
   }, []);
 
   return (
     <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
       {/* Background grid */}
       <div 
         className="absolute inset-0 opacity-20"
         style={{
           backgroundImage: `
             linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
             linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
           `,
           backgroundSize: '20px 20px',
         }}
       />
 
       {/* Floating particles */}
       {particles.map((particle) => (
         <div
           key={particle.id}
           className="absolute rounded-full animate-pulse"
           style={{
             left: `${particle.x}%`,
             top: `${particle.y}%`,
             width: `${particle.size}px`,
             height: `${particle.size}px`,
             backgroundColor: 'hsl(var(--primary))',
             opacity: 0.4,
             animation: `pulse ${2 + particle.delay}s ease-in-out infinite`,
             animationDelay: `${particle.delay}s`,
           }}
         />
       ))}
 
       {/* Outer scanning rings */}
       <div className="absolute inset-0 flex items-center justify-center">
         {[0, 1, 2].map((i) => (
           <div
             key={i}
             className="absolute rounded-full border animate-scan-wave"
             style={{
               width: '80px',
               height: '80px',
               borderColor: 'hsl(var(--primary) / 0.4)',
               borderWidth: '2px',
               animationDelay: `${i * 1.2}s`,
             }}
           />
         ))}
       </div>
 
       {/* Attack particles */}
       {attacks.map((attack) => {
         const radians = (attack.angle * Math.PI) / 180;
         const x = Math.cos(radians) * attack.distance;
         const y = Math.sin(radians) * attack.distance;
         return (
           <div
             key={attack.id}
             className="absolute w-2 h-2 rounded-full animate-attack"
             style={{
               "--start-x": `${x}px`,
               "--start-y": `${y}px`,
               backgroundColor: "hsl(var(--color-red-team))",
               boxShadow: "0 0 8px hsl(var(--color-red-team) / 0.8)",
               left: "50%",
               top: "50%",
               marginLeft: "-4px",
               marginTop: "-4px",
             } as React.CSSProperties}
           />
         );
       })}
 
       {/* Orbital rings */}
       <div className="absolute inset-0 flex items-center justify-center">
         <div 
           className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-primary/30 animate-spin"
           style={{ animationDuration: '20s' }}
         />
         <div 
           className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-primary/20 animate-spin"
           style={{ animationDuration: '15s', animationDirection: 'reverse' }}
         />
         <div 
           className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-primary/40 animate-spin"
           style={{ animationDuration: '25s' }}
         />
       </div>
 
       {/* Connection nodes on orbital rings */}
       {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
         const radians = (angle * Math.PI) / 180;
         const radius = 120;
         const x = Math.cos(radians) * radius;
         const y = Math.sin(radians) * radius;
         return (
           <div
             key={i}
             className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"
             style={{
               left: `calc(50% + ${x}px)`,
               top: `calc(50% + ${y}px)`,
               transform: 'translate(-50%, -50%)',
               boxShadow: '0 0 10px hsl(var(--primary) / 0.6)',
               animationDelay: `${i * 0.2}s`,
             }}
           />
         );
       })}
 
       {/* Central globe */}
       <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center">
         {/* Globe background */}
         <div 
           className="absolute inset-0 rounded-full opacity-30"
           style={{
             background: `radial-gradient(circle at 30% 30%, 
               hsl(var(--primary) / 0.4) 0%, 
               hsl(var(--color-blue-ai) / 0.2) 50%, 
               transparent 100%)`,
           }}
         />
         
         {/* Globe grid lines */}
         <svg 
           className="absolute inset-0 w-full h-full opacity-40 animate-spin"
           style={{ animationDuration: '30s' }}
           viewBox="0 0 100 100"
         >
           {/* Latitude lines */}
           <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
           <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
           <ellipse cx="50" cy="50" rx="45" ry="10" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
           {/* Longitude lines */}
           <ellipse cx="50" cy="50" rx="25" ry="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
           <ellipse cx="50" cy="50" rx="10" ry="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
           <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(var(--primary))" strokeWidth="0.5" />
           <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(var(--primary))" strokeWidth="0.5" />
         </svg>
       </div>
 
       {/* X Shield Logo */}
       <svg
         viewBox="0 0 100 100"
         className="relative z-20 w-24 h-24 md:w-32 md:h-32 animate-shield-glow"
         style={{
           filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.6))",
         }}
       >
         <defs>
           <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="hsl(var(--color-blue-ai))" />
             <stop offset="50%" stopColor="hsl(var(--primary))" />
             <stop offset="100%" stopColor="hsl(var(--color-green-secure))" />
           </linearGradient>
           <filter id="xGlow">
             <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
             <feMerge>
               <feMergeNode in="coloredBlur"/>
               <feMergeNode in="SourceGraphic"/>
             </feMerge>
           </filter>
         </defs>
         
         {/* X shape with rounded ends */}
         <g filter="url(#xGlow)">
           {/* First diagonal of X */}
           <path
             d="M20 20 L80 80"
             stroke="url(#xGradient)"
             strokeWidth="12"
             strokeLinecap="round"
             fill="none"
           />
           {/* Second diagonal of X */}
           <path
             d="M80 20 L20 80"
             stroke="url(#xGradient)"
             strokeWidth="12"
             strokeLinecap="round"
             fill="none"
           />
         </g>
 
         {/* Center glow point */}
         <circle 
           cx="50" 
           cy="50" 
           r="6" 
           fill="hsl(var(--primary))"
           className="animate-pulse"
         />
       </svg>
 
       {/* Inner glow ring */}
       <div 
         className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full animate-pulse"
         style={{
           background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
         }}
       />
 
       {/* Secured glow ring */}
       <div 
         className="absolute inset-0 rounded-full animate-secured-pulse"
         style={{
           background: "radial-gradient(circle, hsl(var(--color-green-secure) / 0.05) 0%, transparent 60%)"
         }}
       />
 
       {/* Lock icon at bottom */}
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-60">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
           <rect x="3" y="11" width="18" height="11" rx="2" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
           <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round"/>
           <circle cx="12" cy="16" r="1.5" fill="hsl(var(--primary))"/>
         </svg>
       </div>
 
       {/* Status indicator */}
       <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2">
         <div className="w-2 h-2 rounded-full bg-green-secure animate-pulse" />
         <span className="text-xs font-medium text-primary tracking-wider">PROTECTED</span>
       </div>
     </div>
   );
 };
 
 export default XShieldAnimation;