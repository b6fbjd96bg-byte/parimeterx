import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AISecurityEngine from "@/components/AISecurityEngine";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import TrustMetrics from "@/components/TrustMetrics";
import FinalCTA from "@/components/FinalCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import FloatingElements from "@/components/FloatingElements";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Global Animations */}
      <ScrollProgress />
      <ParticleField />
      <FloatingElements />
      
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <AISecurityEngine />
        <Services />
        <WhyUs />
        <TrustMetrics />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
