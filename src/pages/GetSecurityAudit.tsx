import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SecurityAuditForm from "@/components/SecurityAuditForm";
import { Shield } from "lucide-react";

const GetSecurityAudit = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Free Security Assessment</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get Your <span className="text-primary text-glow">Security Audit</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Take the first step towards securing your digital assets. Our expert team will analyze your security posture and provide actionable recommendations.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4">
          <SecurityAuditForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetSecurityAudit;
