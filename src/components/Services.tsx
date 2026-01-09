import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Search, Target, Cloud, Globe, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Search,
    title: "Penetration Testing",
    description: "Comprehensive manual and automated testing to identify vulnerabilities in your applications, networks, and infrastructure before attackers do.",
    link: "/services/penetration-testing",
  },
  {
    icon: Shield,
    title: "Vulnerability Assessment",
    description: "Systematic scanning and analysis of your systems to identify, classify, and prioritize security weaknesses across your entire attack surface.",
    link: "/services/vulnerability-assessment",
  },
  {
    icon: Target,
    title: "Red Team Operations",
    description: "Advanced adversary simulation that tests your organization's detection and response capabilities through realistic attack scenarios.",
    link: "/services/red-team-operations",
  },
  {
    icon: Globe,
    title: "Web Application Security",
    description: "In-depth security testing of web applications including OWASP Top 10 vulnerabilities, business logic flaws, and API security assessments.",
    link: "/services/web-application-security",
  },
  {
    icon: Cloud,
    title: "Cloud Security Assessment",
    description: "Evaluate your cloud infrastructure security posture across AWS, Azure, and GCP with focus on misconfigurations and access controls.",
    link: "/services/cloud-security-assessment",
  },
  {
    icon: Lock,
    title: "Compliance Auditing",
    description: "Ensure adherence to industry standards and regulations including SOC 2, HIPAA, PCI DSS, and GDPR with detailed gap analysis.",
    link: "/services/compliance-auditing",
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
            <Link key={index} to={service.link}>
              <Card className="group h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </CardDescription>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
