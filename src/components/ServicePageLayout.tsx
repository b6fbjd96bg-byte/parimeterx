import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  Lock, 
  Eye, 
  FileCheck, 
  Clock, 
  Users, 
  Award, 
  Zap,
  Target,
  AlertTriangle,
  FileText,
  Headphones
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

type AccentColor = "red" | "blue" | "green" | "purple";

interface ServicePageLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  benefits: string[];
  ctaText?: string;
  accentColor?: AccentColor;
}

const accentStyles: Record<AccentColor, { border: string; bg: string; text: string; glow: string }> = {
  red: {
    border: "border-[hsl(var(--color-red-team))]",
    bg: "bg-[hsl(var(--color-red-team))]",
    text: "text-[hsl(var(--color-red-team))]",
    glow: "shadow-[0_0_30px_hsl(var(--color-red-team)/0.3)]",
  },
  blue: {
    border: "border-[hsl(var(--color-blue-ai))]",
    bg: "bg-[hsl(var(--color-blue-ai))]",
    text: "text-[hsl(var(--color-blue-ai))]",
    glow: "shadow-[0_0_30px_hsl(var(--color-blue-ai)/0.3)]",
  },
  green: {
    border: "border-[hsl(var(--color-green-secure))]",
    bg: "bg-[hsl(var(--color-green-secure))]",
    text: "text-[hsl(var(--color-green-secure))]",
    glow: "shadow-[0_0_30px_hsl(var(--color-green-secure)/0.3)]",
  },
  purple: {
    border: "border-[hsl(var(--color-purple-blockchain))]",
    bg: "bg-[hsl(var(--color-purple-blockchain))]",
    text: "text-[hsl(var(--color-purple-blockchain))]",
    glow: "shadow-[0_0_30px_hsl(var(--color-purple-blockchain)/0.3)]",
  },
};

const processSteps = [
  { icon: Eye, title: "Discovery", description: "Initial scoping and reconnaissance" },
  { icon: Target, title: "Assessment", description: "Comprehensive security testing" },
  { icon: AlertTriangle, title: "Analysis", description: "Risk evaluation and prioritization" },
  { icon: FileText, title: "Reporting", description: "Detailed findings documentation" },
  { icon: Headphones, title: "Support", description: "Remediation guidance and retesting" },
];

const trustIndicators = [
  { icon: Shield, label: "OWASP Compliant" },
  { icon: Lock, label: "NIST Framework" },
  { icon: Award, label: "SANS Certified" },
  { icon: FileCheck, label: "ISO 27001" },
];

const ServicePageLayout = ({
  icon,
  title,
  subtitle,
  description,
  features,
  benefits,
  ctaText = "Get Started Today",
  accentColor = "blue",
}: ServicePageLayoutProps) => {
  const accent = accentStyles[accentColor];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 gradient-radial opacity-30" />
          {/* Accent color gradient for red team */}
          {accentColor === "red" && (
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-red-team)/0.05)] to-transparent" />
          )}
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/#services">
              <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Button>
            </Link>
            
            <div className="max-w-4xl">
              <div className={`h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse-glow ${accent.glow}`}>
                {icon}
              </div>
              <span className={`text-sm font-semibold tracking-widest uppercase mb-4 block ${accent.text || "text-primary"}`}>
                {subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {description}
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4">
                {trustIndicators.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 relative border-t border-border/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
              Our <span className="text-primary">Process</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {processSteps.map((step, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 text-center group hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className={`bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:${accent.border}/30 transition-colors`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    What We <span className="text-primary">Deliver</span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Key <span className="text-primary">Benefits</span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">700+</div>
                <p className="text-sm text-muted-foreground">Assessments Completed</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">200+</div>
                <p className="text-sm text-muted-foreground">Clients Protected</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <p className="text-sm text-muted-foreground">Expert Support</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">99%</div>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 text-center">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Secure Your Organization?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contact our team of security experts to discuss how we can help protect your business from cyber threats.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    {ctaText}
                  </Button>
                </Link>
                <Link to="/#services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View All Services
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

export default ServicePageLayout;
