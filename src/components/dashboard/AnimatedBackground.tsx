const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle animated grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-move 30s linear infinite',
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          top: '-15%',
          right: '-10%',
          animation: 'pulse-glow 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
          bottom: '5%',
          left: '-8%',
          animation: 'pulse-glow 8s ease-in-out infinite reverse',
        }}
      />

      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.15); opacity: 0.12; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
