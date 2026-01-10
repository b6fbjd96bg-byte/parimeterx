import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Shield, Target, Users, Award, Linkedin, Twitter, Mail, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "15+ years in cybersecurity. Former security lead at Fortune 500 companies. OSCP, CISSP certified.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Sarah Mitchell",
    role: "Chief Security Officer",
    bio: "Expert in red team operations and threat intelligence. Previously at major financial institutions.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Marcus Johnson",
    role: "Lead Penetration Tester",
    bio: "Specialist in web application security and API testing. Multiple CVE discoveries.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Emily Rodriguez",
    role: "Cloud Security Architect",
    bio: "AWS, Azure, and GCP certified. Focuses on cloud-native security solutions.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
];

const timeline = [
  { year: "2018", event: "PerimeterX founded with a mission to democratize cybersecurity" },
  { year: "2019", event: "Expanded services to include cloud security assessments" },
  { year: "2020", event: "Launched red team operations division" },
  { year: "2021", event: "Achieved SOC 2 Type II certification" },
  { year: "2022", event: "Reached 500+ successful security assessments" },
  { year: "2023", event: "Expanded globally with clients across 30+ countries" },
  { year: "2024", event: "Launched AI-powered vulnerability detection platform" },
];

const values = [
  {
    icon: Shield,
    title: "Integrity First",
    description: "We operate with complete transparency and ethical standards in every engagement.",
  },
  {
    icon: Target,
    title: "Excellence Driven",
    description: "We strive for the highest quality in our assessments and deliverables.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description: "We build lasting relationships by understanding and addressing real business needs.",
  },
  {
    icon: Award,
    title: "Continuous Innovation",
    description: "We stay ahead of threats by constantly evolving our methodologies and tools.",
  },
];

const AboutUs = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const missionAnimation = useScrollAnimation({ threshold: 0.2 });
  const valuesAnimation = useScrollAnimation({ threshold: 0.1 });
  const teamAnimation = useScrollAnimation({ threshold: 0.1 });
  const historyAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial opacity-30" />
        <div 
          ref={heroAnimation.ref}
          className={`container mx-auto px-4 relative z-10 text-center transition-all duration-700 ${
            heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">About Us</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Defining the <span className="text-primary text-glow">Next Edge</span> of Defense
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            PerimeterX is a next-generation cybersecurity company dedicated to protecting organizations 
            from evolving cyber threats through expert-driven security solutions.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-secondary/30 relative">
        <div className="absolute inset-0 gradient-cyber opacity-50" />
        <div 
          ref={missionAnimation.ref}
          className={`container mx-auto px-4 relative z-10 transition-all duration-700 delay-100 ${
            missionAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              To empower organizations worldwide with proactive security solutions that identify and 
              mitigate real-world risks before they can be exploited. We believe every organization, 
              regardless of size, deserves enterprise-grade security protection.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                { number: "500+", label: "Security Assessments" },
                { number: "30+", label: "Countries Served" },
                { number: "99%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
                >
                  <div className="text-4xl font-bold text-primary text-glow mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-radial opacity-20" />
        <div 
          ref={valuesAnimation.ref}
          className={`container mx-auto px-4 relative z-10 transition-all duration-700 ${
            valuesAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-primary">Core Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className={`group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 delay-${index * 100}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/30 relative">
        <div className="absolute inset-0 gradient-cyber opacity-50" />
        <div 
          ref={teamAnimation.ref}
          className={`container mx-auto px-4 relative z-10 transition-all duration-700 ${
            teamAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our <span className="text-primary">Leadership Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry veterans with decades of combined experience in cybersecurity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex gap-3">
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-radial opacity-20" />
        <div 
          ref={historyAnimation.ref}
          className={`container mx-auto px-4 relative z-10 transition-all duration-700 ${
            historyAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small team with a big vision to a global cybersecurity leader
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border" />
              
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className="relative pl-16 pb-10 last:pb-0"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 w-11 h-11 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="p-5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
                    <span className="text-sm font-bold text-primary">{item.year}</span>
                    <p className="text-foreground mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
