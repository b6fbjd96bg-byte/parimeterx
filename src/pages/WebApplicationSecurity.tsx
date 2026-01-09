import { Globe } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const WebApplicationSecurity = () => {
  return (
    <ServicePageLayout
      icon={<Globe className="h-8 w-8 text-primary" />}
      title="Web Application Security"
      subtitle="Application Testing"
      description="We conduct in-depth security testing of web applications to identify OWASP Top 10 vulnerabilities, business logic flaws, authentication issues, and API security risks. Our testing ensures your applications are resilient against modern attack techniques and secure for end users."
      features={[
        "OWASP Top 10 vulnerability assessment",
        "Business logic and workflow testing",
        "Authentication and session management review",
        "Authorization and access control testing",
        "Input validation and injection testing",
        "API security testing (REST, GraphQL, SOAP)",
        "Client-side security assessment",
        "Secure code review and static analysis",
      ]}
      benefits={[
        "Protect sensitive user data from breaches",
        "Prevent financial fraud and account takeover attacks",
        "Ensure compliance with application security standards",
        "Build customer trust through secure applications",
        "Reduce development costs by finding issues early",
        "Maintain business continuity and reputation",
      ]}
      ctaText="Secure Your Application"
    />
  );
};

export default WebApplicationSecurity;
