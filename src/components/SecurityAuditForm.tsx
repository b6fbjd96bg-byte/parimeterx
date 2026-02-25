import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Server, 
  Cloud, 
  Boxes, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";

const formSchema = z.object({
  // Step 1 - Contact Info
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().optional(),
  company: z.string().trim().min(2, "Company name is required").max(100, "Company name must be less than 100 characters"),
  jobTitle: z.string().trim().optional(),
  
  // Step 2 - Company Info
  companySize: z.string().min(1, "Please select company size"),
  industry: z.string().min(1, "Please select industry"),
  website: z.string().trim().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  
  // Step 3 - Security Needs
  services: z.array(z.string()).min(1, "Please select at least one service"),
  urgency: z.string().min(1, "Please select urgency level"),
  budget: z.string().optional(),
  additionalInfo: z.string().trim().max(2000, "Message must be less than 2000 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

const services = [
  { id: "penetration-testing", label: "Penetration Testing", icon: Shield },
  { id: "vulnerability-assessment", label: "Vulnerability Assessment", icon: Server },
  { id: "red-team-operations", label: "Red Team Operations", icon: Lock },
  { id: "web-app-security", label: "Web & API Security", icon: Globe },
  { id: "cloud-security", label: "Cloud Security", icon: Cloud },
  { id: "blockchain-security", label: "Blockchain Security", icon: Boxes },
];

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-1000 employees",
  "1000+ employees",
];

const industries = [
  "Technology / SaaS",
  "Finance / FinTech",
  "Healthcare",
  "E-commerce / Retail",
  "Government",
  "Education",
  "Manufacturing",
  "Other",
];

const urgencyLevels = [
  { value: "immediate", label: "Immediate (Within 1 week)" },
  { value: "soon", label: "Soon (Within 1 month)" },
  { value: "planning", label: "Planning (1-3 months)" },
  { value: "exploring", label: "Just Exploring" },
];

const budgetRanges = [
  "$5,000 - $15,000",
  "$15,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
  "Not sure yet",
];

const SecurityAuditForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const animation = useScrollAnimation({ threshold: 0.1 });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      companySize: "",
      industry: "",
      website: "",
      services: [],
      urgency: "",
      budget: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Save to database
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: data.fullName,
      company: data.company,
      email: data.email,
      service_interest: data.services.join(", "),
      message: `Industry: ${data.industry} | Size: ${data.companySize} | Urgency: ${data.urgency} | Budget: ${data.budget || 'N/A'} | Website: ${data.website || 'N/A'} | Phone: ${data.phone || 'N/A'} | Title: ${data.jobTitle || 'N/A'}\n\n${data.additionalInfo || ''}`,
    });

    setIsSubmitting(false);
    
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    
    setIsSubmitted(true);
    toast.success("Your security audit request has been submitted!");
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["fullName", "email", "company"];
    } else if (step === 2) {
      fieldsToValidate = ["companySize", "industry"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (isSubmitted) {
    return (
      <div 
        ref={animation.ref}
        className={`max-w-2xl mx-auto transition-all duration-700 ${
          animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Card className="bg-card/50 backdrop-blur-xl border-primary/30 overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Request Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest in ParameterX security services. Our team will review your request and contact you within 24 hours.
            </p>
            <Button 
              variant="cyber" 
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
                form.reset();
              }}
            >
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      ref={animation.ref}
      className={`max-w-4xl mx-auto transition-all duration-700 ${
        animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= stepNum 
                  ? "bg-primary text-primary-foreground box-glow" 
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > stepNum ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div 
                className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${
                  step > stepNum ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mb-8 px-4">
        <span className={`text-sm transition-colors ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          Contact Info
        </span>
        <span className={`text-sm transition-colors ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          Company Details
        </span>
        <span className={`text-sm transition-colors ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
          Security Needs
        </span>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
        
        <CardContent className="p-8 md:p-10 relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary">Step 1 of 3</span>
                    </div>
                    <h3 className="text-2xl font-bold">Contact Information</h3>
                    <p className="text-muted-foreground mt-2">Tell us how to reach you</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              className="bg-background/50 border-border/50 focus:border-primary h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@company.com" 
                              className="bg-background/50 border-border/50 focus:border-primary h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+1 (555) 000-0000" 
                              className="bg-background/50 border-border/50 focus:border-primary h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Company Name *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Acme Inc." 
                              className="bg-background/50 border-border/50 focus:border-primary h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="CTO, Security Lead, etc." 
                            className="bg-background/50 border-border/50 focus:border-primary h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Company Details */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary">Step 2 of 3</span>
                    </div>
                    <h3 className="text-2xl font-bold">Company Details</h3>
                    <p className="text-muted-foreground mt-2">Help us understand your organization</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary h-12">
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companySizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary h-12">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          Company Website
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://yourcompany.com" 
                            className="bg-background/50 border-border/50 focus:border-primary h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Security Needs */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary">Step 3 of 3</span>
                    </div>
                    <h3 className="text-2xl font-bold">Security Needs</h3>
                    <p className="text-muted-foreground mt-2">Select the services you're interested in</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <FormLabel>Services of Interest *</FormLabel>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                          {services.map((service) => (
                            <FormField
                              key={service.id}
                              control={form.control}
                              name="services"
                              render={({ field }) => {
                                return (
                                  <FormItem key={service.id}>
                                    <FormControl>
                                      <label
                                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                                          field.value?.includes(service.id)
                                            ? "border-primary bg-primary/10 box-glow-sm"
                                            : "border-border/50 bg-background/30 hover:border-primary/50"
                                        }`}
                                      >
                                        <Checkbox
                                          checked={field.value?.includes(service.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, service.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== service.id
                                                  )
                                                );
                                          }}
                                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <service.icon className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-medium">{service.label}</span>
                                      </label>
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Urgency *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary h-12">
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {urgencyLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Budget</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary h-12">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {budgetRanges.map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us more about your security requirements, current challenges, or specific concerns..."
                            className="bg-background/50 border-border/50 focus:border-primary min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border/30">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    variant="cyber"
                    onClick={nextStep}
                    className="gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="cyber"
                    disabled={isSubmitting}
                    className="gap-2 min-w-[180px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Submit Request
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          <span>256-bit SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>24hr Response Time</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditForm;
