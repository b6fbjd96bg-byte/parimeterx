import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 gradient-radial opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div>
            <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Secure Your <span className="text-primary">Digital Assets?</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Contact our security experts today for a free consultation. Let us help you identify vulnerabilities and strengthen your security posture.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email Us</div>
                  <a href="mailto:contact@perimeterx.ai" className="font-medium hover:text-primary transition-colors">
                    contact@perimeterx.ai
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Call Us</div>
                  <a href="tel:+1234567890" className="font-medium hover:text-primary transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Visit Us</div>
                  <span className="font-medium">www.perimeterx.ai</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
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
