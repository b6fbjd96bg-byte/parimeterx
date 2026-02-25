import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const leftAnimation = useScrollAnimation({ threshold: 0.2 });
  const rightAnimation = useScrollAnimation({ threshold: 0.2 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    service_interest: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: form.full_name,
      company: form.company || null,
      email: form.email,
      service_interest: form.service_interest || null,
      message: form.message || null,
    });
    setIsSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("Your request has been submitted! We'll get back to you soon.");
  };

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
                { icon: Mail, label: "Email Us", value: "contact@parameterx.org", href: "mailto:contact@parameterx.org" },
                { icon: Phone, label: "Call Us", value: "8851484102", href: "tel:8851484102" },
                { icon: MapPin, label: "Visit Us", value: "Suncity Sector 54, Gurugram, Haryana, India", href: null },
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
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Thank You!</h3>
                <p className="text-muted-foreground max-w-sm">
                  Your request has been received. Our security team will review it and get back to you within 24 hours.
                </p>
                <Button
                  variant="cyberOutline"
                  className="mt-6"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ full_name: "", company: "", email: "", service_interest: "", message: "" });
                  }}
                >
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-6">Request a Free Security Audit</h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="full_name" className="text-sm font-medium mb-2 block">Full Name *</label>
                      <Input 
                        id="full_name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="text-sm font-medium mb-2 block">Company</label>
                      <Input 
                        id="company"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your Company" 
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">Email *</label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com" 
                      className="bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service_interest" className="text-sm font-medium mb-2 block">Service Interested In</label>
                    <Input 
                      id="service_interest"
                      name="service_interest"
                      value={form.service_interest}
                      onChange={handleChange}
                      placeholder="e.g., Penetration Testing, Red Team" 
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your security needs..." 
                      className="bg-background/50 border-border/50 focus:border-primary min-h-[100px]"
                    />
                  </div>
                  
                  <Button variant="cyber" size="lg" className="w-full group" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                    {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
