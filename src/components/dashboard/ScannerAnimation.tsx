import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react';

interface ScannerAnimationProps {
  isScanning: boolean;
  progress: number;
}

const ScannerAnimation = ({ isScanning, progress }: ScannerAnimationProps) => {
  const [scanLine, setScanLine] = useState(0);
  const [detectedNodes, setDetectedNodes] = useState<number[]>([]);

  useEffect(() => {
    if (!isScanning) {
      setScanLine(0);
      setDetectedNodes([]);
      return;
    }

    const lineInterval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 50);

    const nodeInterval = setInterval(() => {
      const newNode = Math.floor(Math.random() * 12);
      setDetectedNodes((prev) => {
        if (prev.includes(newNode)) return prev;
        return [...prev, newNode].slice(-6);
      });
    }, 800);

    return () => {
      clearInterval(lineInterval);
      clearInterval(nodeInterval);
    };
  }, [isScanning]);

  const nodes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const radius = 80;
    return {
      id: i,
      x: 100 + Math.cos(angle) * radius,
      y: 100 + Math.sin(angle) * radius,
    };
  });

  return (
    <div className="relative w-52 h-52 mx-auto">
      {/* Outer ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="hsl(var(--primary) / 0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
          className={isScanning ? 'animate-spin' : ''}
          style={{ animationDuration: '10s' }}
        />
        
        {/* Progress arc */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${progress * 5.97} 597`}
          transform="rotate(-90 100 100)"
          className="transition-all duration-300"
        />

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill={detectedNodes.includes(node.id) ? 'hsl(var(--destructive))' : 'hsl(var(--primary) / 0.3)'}
              className={`transition-all duration-300 ${detectedNodes.includes(node.id) ? 'animate-pulse' : ''}`}
            />
            <line
              x1="100"
              y1="100"
              x2={node.x}
              y2={node.y}
              stroke={detectedNodes.includes(node.id) ? 'hsl(var(--destructive) / 0.5)' : 'hsl(var(--primary) / 0.2)'}
              strokeWidth="1"
              className="transition-all duration-300"
            />
          </g>
        ))}

        {/* Scan line */}
        {isScanning && (
          <line
            x1="100"
            y1="100"
            x2={100 + Math.cos((scanLine * 3.6 * Math.PI) / 180) * 90}
            y2={100 + Math.sin((scanLine * 3.6 * Math.PI) / 180) * 90}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            opacity="0.8"
          />
        )}
      </svg>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`p-4 rounded-full bg-primary/10 ${isScanning ? 'animate-pulse' : ''}`}>
          {isScanning ? (
            <Target className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          ) : progress === 100 ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <Shield className="w-8 h-8 text-primary" />
          )}
        </div>
      </div>

      {/* Floating alerts */}
      {isScanning && detectedNodes.length > 0 && (
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col gap-1">
            {detectedNodes.slice(-3).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-destructive/20 rounded text-xs animate-fade-in"
              >
                <AlertTriangle className="w-3 h-3 text-destructive" />
                <span className="text-destructive">CVE</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerAnimation;
