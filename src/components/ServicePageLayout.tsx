import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface ServicePageLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  benefits: string[];
  ctaText?: string;
}

const ServicePageLayout = ({
  icon,
  title,
  subtitle,
  description,
  features,
  benefits,
  ctaText = "Get Started Today",
}: ServicePageLayoutProps) => {
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
            
            <div className="max-w-4xl">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                {icon}
              </div>
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
                {subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  What We <span className="text-primary">Deliver</span>
                </h2>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  Key <span className="text-primary">Benefits</span>
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 text-center">
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
