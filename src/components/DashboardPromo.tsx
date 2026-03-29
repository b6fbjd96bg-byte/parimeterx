import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Shield, Search, AlertTriangle, CheckCircle, Target, ArrowRight, Zap, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import dashboardPreview from '@/assets/dashboard-preview.jpg';

const DashboardPromo = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  const features = [
    {
      icon: Search,
      title: 'Instant Scanning',
      description: 'Launch vulnerability scans on any target URL with one click.',
    },
    {
      icon: BarChart3,
      title: 'Severity Breakdown',
      description: 'Visual distribution of Critical, High, Medium, and Low findings.',
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Live dashboard that updates automatically as scans progress.',
    },
    {
      icon: CheckCircle,
      title: 'Track Remediation',
      description: 'Mark vulnerabilities as fixed and monitor your security posture.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider text-primary">Free for All Users</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Your Personal{' '}
            <span className="text-primary text-glow">Security Scanner</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Scan any website for vulnerabilities, track findings by severity, and monitor remediation — all from a powerful real-time dashboard.
          </p>
        </div>

        {/* Dashboard Preview Image */}
        <div className={`relative mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="relative mx-auto max-w-5xl">
            {/* Glow behind image */}
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-3xl opacity-50" />

            {/* Browser frame */}
            <div className="relative rounded-xl border border-border/60 bg-card/90 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3 text-primary" />
                    breach-aware.lovable.app/dashboard
                  </div>
                </div>
              </div>
              {/* Screenshot */}
              <img
                src={dashboardPreview}
                alt="ParameterX Vulnerability Scanner Dashboard showing real-time security metrics, severity distribution charts, and recent scan results"
                width={1920}
                height={1080}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${500 + index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center transition-all duration-700 delay-[900ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link to="/auth">
            <Button size="lg" variant="cyber" className="gap-2 group">
              Start Scanning — Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            No credit card required. Sign up and start scanning instantly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardPromo;
