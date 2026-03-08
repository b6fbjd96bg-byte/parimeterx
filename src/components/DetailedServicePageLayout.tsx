import { useRef, useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  Lock, 
  Award, 
  FileCheck,
  Bug,
  Clock,
  Users,
  LucideIcon,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type AccentColor = "red" | "blue" | "green" | "purple";

interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  result: string;
}

interface TrustIndicator {
  icon: LucideIcon;
  label: string;
}

interface KeyFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Technology {
  name: string;
  category: string;
}

interface DetailedServicePageLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  extendedDescription?: string;
  trustIndicators: TrustIndicator[];
  approachTitle: string;
  approachDescription: string;
  whatWeTestTitle: string;
  whatWeTestDescription: string;
  coreTestingAreas: string[];
  coreTestingNote?: string;
  processTitle: string;
  processDescription: string;
  processSteps: ProcessStep[];
  deliverables: string[];
  deliverablesNote?: string;
  whyTrustUs: string[];
  stats: { value: string; label: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  accentColor?: AccentColor;
  heroAnimation?: ReactNode;
  keyFeatures?: KeyFeature[];
  technologies?: Technology[];
  companyHighlights?: string[];
}

// Custom hook for individual step animation
const useStepAnimation = (index: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isBugKilled, setIsBugKilled] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
            setIsBugKilled(true);
          }, 300 + index * 150);
        }
      },
      { threshold: 0.3, rootMargin: "0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [index]);

  return { ref, isVisible, isBugKilled };
};

const accentColors: Record<AccentColor, string> = {
  red: "color-red-team",
  blue: "color-blue-ai",
  green: "color-green-secure",
  purple: "color-purple-blockchain",
};

// Animated counter for stats — uses rAF for smooth 60fps
const AnimatedStatCounter = ({ value, isVisible }: { value: string; isVisible: boolean }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const numericMatch = value.match(/^([\d.]+)/);
      if (!numericMatch) { setDisplayValue(value); return; }
      const target = parseFloat(numericMatch[1]);
      const suffix = value.replace(numericMatch[1], "");
      const isFloat = value.includes(".");
      const duration = 1600;
      let start: number | null = null;
      let rafId: number;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        if (progress >= 1) {
          setDisplayValue(value);
        } else {
          setDisplayValue((isFloat ? current.toFixed(1) : Math.floor(current).toString()) + suffix);
          rafId = requestAnimationFrame(step);
        }
      };
      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }
  }, [isVisible, value]);

  return <span>{isVisible ? displayValue : "0"}</span>;
};

// Bug killing animation component for each step
const ProcessStepComponent = ({ 
  step, 
  index, 
  totalSteps,
  accentColor 
}: { 
  step: ProcessStep; 
  index: number;
  totalSteps: number;
  accentColor: AccentColor;
}) => {
  const { ref, isVisible, isBugKilled } = useStepAnimation(index);
  const colorVar = accentColors[accentColor];

  return (
    <div 
      ref={ref}
      className={`relative transition-all duration-700 ease-out will-change-[transform,opacity] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {/* Bug killing animation */}
      <div className={`absolute -top-4 -right-4 z-20 transition-all duration-500 ease-out will-change-transform ${
        isVisible && !isBugKilled ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}>
        <Bug className="h-8 w-8 text-[hsl(var(--color-red-team))]" />
      </div>
      
      {/* Squash effect */}
      <div className={`absolute -top-2 -right-2 z-30 transition-all duration-500 ease-out will-change-transform ${
        isBugKilled ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}>
        <CheckCircle className="h-6 w-6 text-[hsl(var(--color-green-secure))]" />
      </div>

      <Card className={`bg-card/50 backdrop-blur-sm border transition-all duration-500 ${
        isBugKilled 
          ? "border-[hsl(var(--color-green-secure)/0.5)] shadow-[0_0_20px_hsl(var(--color-green-secure)/0.2)]" 
          : "border-border/50"
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Step number with animation */}
            <div className={`flex-shrink-0 relative transition-all duration-500 ${
              isBugKilled ? "scale-110" : ""
            }`}>
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                isBugKilled 
                  ? "bg-[hsl(var(--color-green-secure)/0.2)]" 
                  : `bg-[hsl(var(--${colorVar})/0.1)]`
              }`}>
                <span className={`text-2xl font-bold transition-colors duration-500 ${
                  isBugKilled ? "text-[hsl(var(--color-green-secure))]" : `text-[hsl(var(--${colorVar}))]`
                }`}>
                  {index + 1}
                </span>
              </div>
              {/* Connecting line */}
              {index < totalSteps - 1 && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 transition-colors duration-500 ${
                  isBugKilled 
                    ? "bg-gradient-to-b from-[hsl(var(--color-green-secure))] to-transparent" 
                    : "bg-gradient-to-b from-border to-transparent"
                }`} />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <step.icon className={`h-5 w-5 transition-colors duration-500 ${
                  isBugKilled ? "text-[hsl(var(--color-green-secure))]" : `text-[hsl(var(--${colorVar}))]`
                }`} />
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              
              <ul className="space-y-2 mb-4">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 transition-colors duration-500 ${
                      isBugKilled ? "text-[hsl(var(--color-green-secure))]" : `text-[hsl(var(--${colorVar})/0.7)]`
                    }`} />
                    {detail}
                  </li>
                ))}
              </ul>
              
              <div className={`border-l-2 pl-4 py-2 transition-colors duration-500 ${
                isBugKilled 
                  ? "border-[hsl(var(--color-green-secure))]" 
                  : `border-[hsl(var(--${colorVar})/0.3)]`
              }`}>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</span>
                <p className={`font-medium transition-colors duration-500 ${
                  isBugKilled ? "text-[hsl(var(--color-green-secure))]" : "text-foreground"
                }`}>{step.result}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DetailedServicePageLayout = ({
  icon,
  title,
  subtitle,
  tagline,
  description,
  extendedDescription,
  trustIndicators,
  approachTitle,
  approachDescription,
  whatWeTestTitle,
  whatWeTestDescription,
  coreTestingAreas,
  coreTestingNote,
  processTitle,
  processDescription,
  processSteps,
  deliverables,
  deliverablesNote,
  whyTrustUs,
  stats,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  accentColor = "blue",
  heroAnimation,
  keyFeatures,
  technologies,
  companyHighlights,
}: DetailedServicePageLayoutProps) => {
  const colorVar = accentColors[accentColor];
  const featuresAnim = useScrollAnimation({ threshold: 0.1 });
  const techAnim = useScrollAnimation({ threshold: 0.1 });
  const statsAnim = useScrollAnimation({ threshold: 0.2 });
  const highlightsAnim = useScrollAnimation({ threshold: 0.2 });
  const deliverablesAnim = useScrollAnimation({ threshold: 0.1 });
  const trustAnim = useScrollAnimation({ threshold: 0.1 });

  return (
     <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <main>
        {/* Hero Section */}
         <section className="pt-32 pb-16 relative overflow-hidden animate-fade-in">
           <div className="absolute inset-0 gradient-radial opacity-20" />
           <div 
             className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `linear-gradient(hsl(var(--${colorVar})) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--${colorVar})) 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
             }}
           />
            <div className={`absolute top-20 left-10 w-64 h-64 rounded-full bg-[hsl(var(--${colorVar})/0.08)] blur-[80px]`} />
            <div className={`absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[hsl(var(--${colorVar})/0.08)] blur-[60px]`} />
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/#services">
              <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Button>
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                 <div className={`h-16 w-16 rounded-xl bg-[hsl(var(--${colorVar})/0.1)] flex items-center justify-center mb-6 shadow-[0_0_30px_hsl(var(--${colorVar})/0.3)] hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
                 <span className={`text-sm font-semibold tracking-widest uppercase mb-4 block text-[hsl(var(--${colorVar}))] animate-fade-in`} style={{ animationDelay: '0.3s' }}>
                  {subtitle}
                </span>
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  {title.split(' ').slice(0, -2).join(' ')} <span className={`text-[hsl(var(--${colorVar}))]`}>{title.split(' ').slice(-2).join(' ')}</span>
                </h1>
                 <p className="text-xl text-muted-foreground leading-relaxed mb-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  {tagline}
                </p>
                 <p className="text-lg text-muted-foreground leading-relaxed mb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  {description}
                </p>
                {extendedDescription && (
                  <p className="text-base text-muted-foreground/80 leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '0.65s' }}>
                    {extendedDescription}
                  </p>
                )}
                
                {/* Trust Indicators */}
                 <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                  {trustIndicators.map((item, index) => (
                     <div 
                       key={index} 
                       className={`flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 hover:border-[hsl(var(--${colorVar})/0.5)] hover:scale-105 transition-all duration-300`}
                     >
                      <item.icon className={`h-4 w-4 text-[hsl(var(--${colorVar}))]`} />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA in hero */}
                <div className="flex flex-wrap gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <Link to="/get-security-audit">
                    <Button variant="cyber" size="lg" className="group">
                      {ctaButtonText}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/#contact">
                    <Button variant="cyberOutline" size="lg">
                      Talk to an Expert
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Hero Animation */}
              {heroAnimation && (
                 <div className="hidden lg:block animate-scale-in" style={{ animationDelay: '0.5s' }}>
                   <div className={`rounded-2xl border border-[hsl(var(--${colorVar})/0.2)] bg-card/20 backdrop-blur-sm overflow-hidden hover:border-[hsl(var(--${colorVar})/0.5)] transition-colors duration-300`}>
                    {heroAnimation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        {keyFeatures && keyFeatures.length > 0 && (
          <section className="py-20 relative border-t border-border/30 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--${colorVar})/0.4)] to-transparent`} />
            <div className="container mx-auto px-4">
              <div 
                ref={featuresAnim.ref}
                className={`text-center mb-14 transition-all duration-800 ease-out ${featuresAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <span className={`text-sm font-semibold tracking-widest uppercase mb-4 block text-[hsl(var(--${colorVar}))]`}>Key Capabilities</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  What Sets Our <span className={`text-[hsl(var(--${colorVar}))]`}>Service Apart</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  ParameterX delivers enterprise-grade security with a unique combination of AI-powered tools and expert-driven methodology.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyFeatures.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-[hsl(var(--${colorVar})/0.5)] transition-all duration-500 ease-out hover:-translate-y-1.5 overflow-hidden ${
                        featuresAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                      }`}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[hsl(var(--${colorVar})/0.08)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative z-10">
                        <div className={`h-12 w-12 rounded-lg bg-[hsl(var(--${colorVar})/0.1)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-transparent group-hover:border-[hsl(var(--${colorVar})/0.2)]`}>
                          <FeatureIcon className={`h-6 w-6 text-[hsl(var(--${colorVar}))]`} />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-[hsl(var(--${colorVar}))] transition-colors duration-300">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Approach Section */}
         <section className="py-16 relative border-t border-border/30 overflow-hidden">
           <div className={`absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--${colorVar})/0.4)] to-transparent w-full`} />
          <div className="container mx-auto px-4">
             <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {approachTitle.split(' ').slice(0, -1).join(' ')} <span className={`text-[hsl(var(--${colorVar}))]`}>{approachTitle.split(' ').slice(-1)}</span>
              </h2>
              <p className="text-muted-foreground">
                {approachDescription}
              </p>
            </div>
          </div>
        </section>

        {/* What We Test Section */}
         <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
               <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {whatWeTestTitle.split(' ').slice(0, -1).join(' ')} <span className={`text-[hsl(var(--${colorVar}))]`}>{whatWeTestTitle.split(' ').slice(-1)}</span>
                </h2>
                <p className="text-muted-foreground">
                  {whatWeTestDescription}
                </p>
              </div>
              
               <Card className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--${colorVar})/0.3)] transition-colors duration-300 animate-fade-in`} style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Shield className={`h-5 w-5 text-[hsl(var(--${colorVar}))]`} />
                    Core Testing Areas
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {coreTestingAreas.map((area, index) => (
                       <div key={index} className="flex items-start gap-3 group animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.05}s` }}>
                        <CheckCircle className={`h-5 w-5 text-[hsl(var(--${colorVar}))] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform`} />
                        <p className="text-muted-foreground">{area}</p>
                      </div>
                    ))}
                  </div>
                  {coreTestingNote && (
                    <p className="text-sm text-muted-foreground mt-6 pt-6 border-t border-border/50 italic">
                      {coreTestingNote}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        {technologies && technologies.length > 0 && (
          <section className="py-16 relative border-t border-border/30 overflow-hidden">
            <div className="container mx-auto px-4">
              <div 
                ref={techAnim.ref}
                className={`text-center mb-12 transition-all duration-800 ease-out ${techAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <span className={`text-sm font-semibold tracking-widest uppercase mb-4 block text-[hsl(var(--${colorVar}))]`}>Tools & Technologies</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Industry-Leading <span className={`text-[hsl(var(--${colorVar}))]`}>Security Stack</span>
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                {/* Group by category */}
                {Object.entries(
                  technologies.reduce((acc, tech) => {
                    if (!acc[tech.category]) acc[tech.category] = [];
                    acc[tech.category].push(tech.name);
                    return acc;
                  }, {} as Record<string, string[]>)
                ).map(([category, tools], catIndex) => (
                  <div 
                    key={category} 
                    className={`mb-6 transition-all duration-700 ease-out ${techAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                    style={{ transitionDelay: `${catIndex * 100}ms` }}
                  >
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-3">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tools.map((tool, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-md text-sm border border-border/50 bg-card/50 hover:border-[hsl(var(--${colorVar})/0.5)] hover:bg-[hsl(var(--${colorVar})/0.05)] transition-all duration-300`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process Section with Bug Killing Animation */}
        <section className="py-16 relative border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {processTitle.split(' ').slice(0, -1).join(' ')} <span className={`text-[hsl(var(--${colorVar}))]`}>{processTitle.split(' ').slice(-1)}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {processDescription}
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Bug className="h-4 w-4 text-[hsl(var(--color-red-team))]" />
                <span>Scroll to eliminate vulnerabilities</span>
                <CheckCircle className="h-4 w-4 text-[hsl(var(--color-green-secure))]" />
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {processSteps.map((step, index) => (
                <ProcessStepComponent 
                  key={index} 
                  step={step} 
                  index={index} 
                  totalSteps={processSteps.length}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* What You Receive Section */}
         <section className="py-16 relative border-t border-border/30 overflow-hidden">
           <div className={`absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--${colorVar})/0.4)] to-transparent w-full`} />
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
               <div 
                 ref={deliverablesAnim.ref}
                 className={`text-center mb-12 transition-all duration-800 ease-out ${deliverablesAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
               >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  What You <span className={`text-[hsl(var(--${colorVar}))]`}>Receive</span>
                </h2>
              </div>
              
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {deliverables.map((item, index) => (
                   <Card 
                     key={index} 
                     className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--${colorVar})/0.5)] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ${
                       deliverablesAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                     }`}
                     style={{ transitionDelay: `${index * 60}ms` }}
                   >
                    <CardContent className="p-4 flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 text-[hsl(var(--${colorVar}))] flex-shrink-0`} />
                      <span className="text-sm">{item}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {deliverablesNote && (
                <p className="text-center text-muted-foreground font-medium">
                  {deliverablesNote}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Why Trust Us Section */}
         <section className="py-16 relative overflow-hidden">
            <div className={`absolute top-1/2 left-0 w-32 h-32 rounded-full bg-[hsl(var(--${colorVar})/0.06)] blur-[60px]`} />
            <div className={`absolute top-1/3 right-0 w-40 h-40 rounded-full bg-[hsl(var(--${colorVar})/0.06)] blur-[80px]`} />
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
               <div 
                 ref={trustAnim.ref}
                 className={`text-center mb-12 transition-all duration-800 ease-out ${trustAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
               >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Why Organizations <span className={`text-[hsl(var(--${colorVar}))]`}>Trust Us</span>
                </h2>
              </div>
              
               <div className="grid md:grid-cols-2 gap-4">
                {whyTrustUs.map((reason, index) => (
                   <div 
                     key={index} 
                     className={`flex items-start gap-3 bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:border-[hsl(var(--${colorVar})/0.5)] hover:scale-[1.02] transition-all duration-300 ${
                       trustAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                     }`}
                     style={{ transitionDelay: `${index * 80}ms` }}
                   >
                    <Shield className={`h-5 w-5 text-[hsl(var(--${colorVar}))] mt-0.5 flex-shrink-0`} />
                    <p className="text-muted-foreground">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ParameterX Advantage Section */}
        {companyHighlights && companyHighlights.length > 0 && (
          <section className="py-16 relative border-t border-border/30 overflow-hidden">
            <div className="container mx-auto px-4">
              <div 
                ref={highlightsAnim.ref}
                className={`text-center mb-12 transition-all duration-800 ease-out ${highlightsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <span className={`text-sm font-semibold tracking-widest uppercase mb-4 block text-[hsl(var(--${colorVar}))]`}>The ParameterX Advantage</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Why <span className={`text-[hsl(var(--${colorVar}))]`}>ParameterX</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We combine cutting-edge technology with deep security expertise to deliver results that matter.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-3">
                {companyHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg bg-card/30 border border-border/30 hover:border-[hsl(var(--${colorVar})/0.3)] transition-all duration-500 ease-out ${
                      highlightsAnim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <Sparkles className={`h-5 w-5 text-[hsl(var(--${colorVar}))] mt-0.5 flex-shrink-0`} />
                    <p className="text-muted-foreground">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
         <section className="py-16 relative border-t border-border/30 overflow-hidden">
           <div className={`absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--${colorVar})/0.4)] to-transparent w-full`} />
          <div className="container mx-auto px-4">
             <div 
               ref={statsAnim.ref}
               className={`text-center mb-12 transition-all duration-800 ease-out ${statsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
             >
              <h2 className="text-2xl md:text-3xl font-bold">
                Measurable <span className={`text-[hsl(var(--${colorVar}))]`}>Results</span>
              </h2>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const icons = [Shield, Users, Clock, Award];
                const Icon = icons[index % icons.length];
                return (
                   <div 
                     key={index} 
                     className={`text-center group transition-all duration-700 ease-out ${
                       statsAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                     }`}
                     style={{ transitionDelay: `${index * 100}ms` }}
                   >
                     <div className={`h-12 w-12 rounded-lg bg-[hsl(var(--${colorVar})/0.1)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:shadow-[0_0_20px_hsl(var(--${colorVar})/0.3)] transition-all duration-300`}>
                      <Icon className={`h-6 w-6 text-[hsl(var(--${colorVar}))]`} />
                    </div>
                     <div className={`text-3xl font-bold text-[hsl(var(--${colorVar}))] mb-1 group-hover:scale-110 transition-transform duration-300`}>
                       <AnimatedStatCounter value={stat.value} isVisible={statsAnim.isVisible} />
                     </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden`}>
              {/* Background glow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[hsl(var(--${colorVar})/0.05)] blur-[100px]`} />
              
              <div className="relative z-10">
                <div className={`h-16 w-16 rounded-xl bg-[hsl(var(--${colorVar})/0.1)] flex items-center justify-center mx-auto mb-6`}>
                  <Lock className={`h-8 w-8 text-[hsl(var(--${colorVar}))]`} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {ctaTitle.split(' ').slice(0, -2).join(' ')} <span className={`text-[hsl(var(--${colorVar}))]`}>{ctaTitle.split(' ').slice(-2).join(' ')}</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {ctaDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/get-security-audit">
                    <Button variant="cyber" size="lg" className="w-full sm:w-auto group">
                      {ctaButtonText}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/#services">
                    <Button size="lg" variant="cyberOutline" className="w-full sm:w-auto">
                      View All Security Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DetailedServicePageLayout;
