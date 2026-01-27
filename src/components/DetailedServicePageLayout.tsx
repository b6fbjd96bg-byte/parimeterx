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
  LucideIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      className={`relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Bug killing animation */}
      <div className={`absolute -top-4 -right-4 z-20 transition-all duration-500 ${
        isVisible && !isBugKilled ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}>
        <Bug className="h-8 w-8 text-[hsl(var(--color-red-team))] animate-pulse" />
      </div>
      
      {/* Squash effect */}
      <div className={`absolute -top-2 -right-2 z-30 transition-all duration-300 ${
        isBugKilled ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}>
        <div className="relative">
          <div className="absolute inset-0 bg-[hsl(var(--color-green-secure))] rounded-full animate-ping opacity-75 h-6 w-6" />
          <CheckCircle className="h-6 w-6 text-[hsl(var(--color-green-secure))] relative z-10" />
        </div>
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
}: DetailedServicePageLayoutProps) => {
  const colorVar = accentColors[accentColor];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 gradient-radial opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/#services">
              <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Button>
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <div className={`h-16 w-16 rounded-xl bg-[hsl(var(--${colorVar})/0.1)] flex items-center justify-center mb-6 animate-pulse-glow shadow-[0_0_30px_hsl(var(--${colorVar})/0.3)]`}>
                  {icon}
                </div>
                <span className={`text-sm font-semibold tracking-widest uppercase mb-4 block text-[hsl(var(--${colorVar}))]`}>
                  {subtitle}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {title.split(' ').slice(0, -2).join(' ')} <span className={`text-[hsl(var(--${colorVar}))]`}>{title.split(' ').slice(-2).join(' ')}</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                  {tagline}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {description}
                </p>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-4">
                  {trustIndicators.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2">
                      <item.icon className={`h-4 w-4 text-[hsl(var(--${colorVar}))]`} />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Hero Animation */}
              {heroAnimation && (
                <div className="hidden lg:block">
                  <div className={`rounded-2xl border border-[hsl(var(--${colorVar})/0.2)] bg-card/20 backdrop-blur-sm overflow-hidden`}>
                    {heroAnimation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-16 relative border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
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
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {whatWeTestTitle.split(' ').slice(0, -1).join(' ')} <span className={`text-[hsl(var(--${colorVar}))]`}>{whatWeTestTitle.split(' ').slice(-1)}</span>
                </h2>
                <p className="text-muted-foreground">
                  {whatWeTestDescription}
                </p>
              </div>
              
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Shield className={`h-5 w-5 text-[hsl(var(--${colorVar}))]`} />
                    Core Testing Areas
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {coreTestingAreas.map((area, index) => (
                      <div key={index} className="flex items-start gap-3 group">
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
        <section className="py-16 relative border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  What You <span className={`text-[hsl(var(--${colorVar}))]`}>Receive</span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {deliverables.map((item, index) => (
                  <Card key={index} className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--${colorVar})/0.5)] transition-all duration-300`}>
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
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Why Organizations <span className={`text-[hsl(var(--${colorVar}))]`}>Trust Us</span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {whyTrustUs.map((reason, index) => (
                  <div key={index} className={`flex items-start gap-3 bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:border-[hsl(var(--${colorVar})/0.5)] transition-colors`}>
                    <Shield className={`h-5 w-5 text-[hsl(var(--${colorVar}))] mt-0.5 flex-shrink-0`} />
                    <p className="text-muted-foreground">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">
                Measurable <span className={`text-[hsl(var(--${colorVar}))]`}>Results</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const icons = [Shield, Users, Clock, Award];
                const Icon = icons[index % icons.length];
                return (
                  <div key={index} className="text-center">
                    <div className={`h-12 w-12 rounded-lg bg-[hsl(var(--${colorVar})/0.1)] flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`h-6 w-6 text-[hsl(var(--${colorVar}))]`} />
                    </div>
                    <div className={`text-3xl font-bold text-[hsl(var(--${colorVar}))] mb-1`}>{stat.value}</div>
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
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 text-center">
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
                  <Button size="lg" className="w-full sm:w-auto">
                    {ctaButtonText}
                  </Button>
                </Link>
                <Link to="/#services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View All Security Services
                  </Button>
                </Link>
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
