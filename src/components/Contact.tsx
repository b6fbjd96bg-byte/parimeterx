import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  const leftAnimation = useScrollAnimation({ threshold: 0.2 });
  const rightAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 gradient-radial opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div
            ref={leftAnimation.ref}
            className={`transition-all duration-700 ${
              leftAnimation.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Secure Your <span className="text-primary">Digital Assets?</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Contact our security experts today for a free consultation. Let us help you identify vulnerabilities and strengthen your security posture.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email Us", value: "contact@parameterx.ai", href: "mailto:contact@parameterx.ai" },
                { icon: Phone, label: "Call Us", value: "+1 (234) 567-890", href: "tel:+1234567890" },
                { icon: MapPin, label: "Visit Us", value: "www.parameterx.ai", href: null },
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    leftAnimation.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="font-medium hover:text-primary transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <span className="font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div 
            ref={rightAnimation.ref}
            className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 transition-all duration-700 delay-200 ${
              rightAnimation.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <h3 className="text-xl font-semibold mb-6">Request a Free Security Audit</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="text-sm font-medium mb-2 block">Company</label>
                  <Input 
                    id="company" 
                    placeholder="Your Company" 
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2 block">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@company.com" 
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="service" className="text-sm font-medium mb-2 block">Service Interested In</label>
                <Input 
                  id="service" 
                  placeholder="e.g., Penetration Testing, Red Team" 
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="text-sm font-medium mb-2 block">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your security needs..." 
                  className="bg-background/50 border-border/50 focus:border-primary min-h-[100px]"
                />
              </div>
              
              <Button variant="cyber" size="lg" className="w-full group">
                Submit Request
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
