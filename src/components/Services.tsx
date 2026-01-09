import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, Target, Cloud, Globe, Lock } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Penetration Testing",
    description: "Comprehensive manual and automated testing to identify vulnerabilities in your applications, networks, and infrastructure before attackers do.",
  },
  {
    icon: Shield,
    title: "Vulnerability Assessment",
    description: "Systematic scanning and analysis of your systems to identify, classify, and prioritize security weaknesses across your entire attack surface.",
  },
  {
    icon: Target,
    title: "Red Team Operations",
    description: "Advanced adversary simulation that tests your organization's detection and response capabilities through realistic attack scenarios.",
  },
  {
    icon: Globe,
    title: "Web Application Security",
    description: "In-depth security testing of web applications including OWASP Top 10 vulnerabilities, business logic flaws, and API security assessments.",
  },
  {
    icon: Cloud,
    title: "Cloud Security Assessment",
    description: "Evaluate your cloud infrastructure security posture across AWS, Azure, and GCP with focus on misconfigurations and access controls.",
  },
  {
    icon: Lock,
    title: "Compliance Auditing",
    description: "Ensure adherence to industry standards and regulations including SOC 2, HIPAA, PCI DSS, and GDPR with detailed gap analysis.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-radial opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive <span className="text-primary">Security Solutions</span>
          </h2>
          <p className="text-muted-foreground">
            We combine automated scanning with deep manual testing to uncover real-world security risks across your entire digital ecosystem.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
