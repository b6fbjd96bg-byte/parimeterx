import { ReactNode, useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number;
  color?: string;
  delay?: number;
}

const StatsCard = ({ title, value, icon, trend, color = 'primary', delay = 0 }: StatsCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Flash on real-time value changes
  useEffect(() => {
    if (prevValue.current !== value && isVisible) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 700);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value, isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);
    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplayValue(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    requestAnimationFrame(animate);
  }, [value, isVisible]);

  const colorConfig: Record<string, { icon: string; border: string; glow: string }> = {
    primary: {
      icon: 'text-primary bg-primary/10',
      border: 'border-primary/20',
      glow: 'shadow-[0_0_20px_hsl(var(--primary)/0.15)]',
    },
    destructive: {
      icon: 'text-destructive bg-destructive/10',
      border: 'border-destructive/20',
      glow: 'shadow-[0_0_20px_hsl(var(--destructive)/0.15)]',
    },
    warning: {
      icon: 'text-yellow-500 bg-yellow-500/10',
      border: 'border-yellow-500/20',
      glow: 'shadow-[0_0_20px_hsl(38_92%_50%/0.15)]',
    },
    success: {
      icon: 'text-emerald-400 bg-emerald-500/10',
      border: 'border-emerald-500/20',
      glow: 'shadow-[0_0_20px_hsl(142_70%_45%/0.15)]',
    },
  };

  const cfg = colorConfig[color] || colorConfig.primary;

  return (
    <Card
      className={`p-5 transition-all duration-500 hover:scale-[1.03] border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden group
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${flash ? cfg.glow + ' ' + cfg.border : ''}
      `}
    >
      {/* Subtle top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${cfg.icon.split(' ')[0].replace('text-', 'bg-')} opacity-40 transition-opacity group-hover:opacity-80`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
          <p className={`text-3xl font-bold tabular-nums transition-all duration-300 ${flash ? 'scale-110' : 'scale-100'}`}>
            {displayValue.toLocaleString()}
          </p>
          {trend !== undefined && (
            <p className={`text-xs mt-1.5 ${trend >= 0 ? 'text-emerald-400' : 'text-destructive'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${cfg.icon} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
