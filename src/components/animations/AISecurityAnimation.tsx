import { useEffect, useState } from "react";
import { Brain, MessageSquare, Shield, AlertTriangle } from "lucide-react";

const AISecurityAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [promptText, setPromptText] = useState("");
  const [neurons, setNeurons] = useState<{ id: number; x: number; y: number; active: boolean }[]>([]);
  const [attacks, setAttacks] = useState<{ id: number; type: string; blocked: boolean }[]>([]);

  const promptSequence = [
    "Ignore previous instructions...",
    "Attempting prompt injection...",
    "BLOCKED: Malicious prompt detected",
    "System secure ✓",
  ];

  const attackTypes = ["Jailbreak", "Injection", "Extraction", "Poisoning"];

  useEffect(() => {
    // Initialize neurons
    const initialNeurons = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
      active: false,
    }));
    setNeurons(initialNeurons);

    const phaseInterval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 2500);

    const neuronInterval = setInterval(() => {
      setNeurons((prev) =>
        prev.map((n) => ({ ...n, active: Math.random() > 0.6 }))
      );
    }, 200);

    const attackInterval = setInterval(() => {
      setAttacks((prev) => {
        if (prev.length >= 4) {
          return prev.slice(1);
        }
        const newAttack = {
          id: Date.now(),
          type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
          blocked: false,
        };
        
        // Block attack after delay
        setTimeout(() => {
          setAttacks((p) =>
            p.map((a) => (a.id === newAttack.id ? { ...a, blocked: true } : a))
          );
        }, 800);
        
        return [...prev, newAttack];
      });
    }, 1500);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(neuronInterval);
      clearInterval(attackInterval);
    };
  }, []);

  useEffect(() => {
    const text = promptSequence[phase];
    let index = 0;
    setPromptText("");
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setPromptText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [phase]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      {/* Neural network background */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Neuron connections */}
        {neurons.map((neuron, i) =>
          neurons.slice(i + 1).map((other, j) => {
            const distance = Math.sqrt(
              Math.pow(neuron.x - other.x, 2) + Math.pow(neuron.y - other.y, 2)
            );
            if (distance < 20) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={`${neuron.x}%`}
                  y1={`${neuron.y}%`}
                  x2={`${other.x}%`}
                  y2={`${other.y}%`}
                  stroke={
                    neuron.active && other.active
                      ? "hsl(var(--color-purple-blockchain))"
                      : "hsl(var(--border))"
                  }
                  strokeWidth={neuron.active && other.active ? "2" : "0.5"}
                  opacity={neuron.active && other.active ? "0.8" : "0.2"}
                  className="transition-all duration-200"
                />
              );
            }
            return null;
          })
        )}

        {/* Neurons */}
        {neurons.map((neuron) => (
          <g key={neuron.id}>
            <circle
              cx={`${neuron.x}%`}
              cy={`${neuron.y}%`}
              r={neuron.active ? "6" : "3"}
              fill={
                neuron.active
                  ? "hsl(var(--color-purple-blockchain))"
                  : "hsl(var(--border))"
              }
              className="transition-all duration-200"
            />
            {neuron.active && (
              <circle
                cx={`${neuron.x}%`}
                cy={`${neuron.y}%`}
                r="10"
                fill="none"
                stroke="hsl(var(--color-purple-blockchain))"
                strokeWidth="1"
                opacity="0.5"
                className="animate-ping"
              />
            )}
          </g>
        ))}
      </svg>

      {/* Central AI Brain */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
          phase >= 2
            ? "bg-[hsl(var(--color-green-secure)/0.2)] border-[hsl(var(--color-green-secure))]"
            : "bg-[hsl(var(--color-purple-blockchain)/0.2)] border-[hsl(var(--color-purple-blockchain))]"
        } border-2`}>
          <Brain className={`w-12 h-12 transition-colors duration-500 ${
            phase >= 2 ? "text-[hsl(var(--color-green-secure))]" : "text-[hsl(var(--color-purple-blockchain))]"
          }`} />
          
          {/* Rotating shield */}
          <div className="absolute -inset-4 animate-spin" style={{ animationDuration: "10s" }}>
            <Shield className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-[hsl(var(--color-green-secure))]" />
          </div>
        </div>
      </div>

      {/* Attack indicators */}
      <div className="absolute left-4 top-4 space-y-2">
        {attacks.map((attack) => (
          <div
            key={attack.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-500 ${
              attack.blocked
                ? "bg-[hsl(var(--color-green-secure)/0.2)] border border-[hsl(var(--color-green-secure))]"
                : "bg-[hsl(var(--color-red-team)/0.2)] border border-[hsl(var(--color-red-team))] animate-pulse"
            }`}
          >
            {attack.blocked ? (
              <Shield className="w-3 h-3 text-[hsl(var(--color-green-secure))]" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-[hsl(var(--color-red-team))]" />
            )}
            <span className={attack.blocked ? "text-[hsl(var(--color-green-secure))]" : "text-[hsl(var(--color-red-team))]"}>
              {attack.type} {attack.blocked ? "BLOCKED" : "DETECTED"}
            </span>
          </div>
        ))}
      </div>

      {/* Prompt terminal */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg border border-[hsl(var(--color-purple-blockchain)/0.3)] p-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-[hsl(var(--color-purple-blockchain))]" />
          <span className="text-xs text-[hsl(var(--color-purple-blockchain))]">Prompt Analysis</span>
        </div>
        <div className="font-mono text-sm h-6 flex items-center">
          <span className={`${
            phase >= 2 
              ? phase >= 3 
                ? "text-[hsl(var(--color-green-secure))]" 
                : "text-[hsl(var(--color-red-team))]"
              : "text-gray-300"
          }`}>
            {promptText}
          </span>
          <span className="animate-pulse ml-0.5">▌</span>
        </div>
      </div>

      {/* Security status */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border">
        <div className={`w-2 h-2 rounded-full ${
          phase >= 2 ? "bg-[hsl(var(--color-green-secure))]" : "bg-[hsl(var(--color-purple-blockchain))]"
        } animate-pulse`} />
        <span className="text-xs text-muted-foreground">
          {phase >= 2 ? "Protected" : "Analyzing"}
        </span>
      </div>
    </div>
  );
};

export default AISecurityAnimation;
