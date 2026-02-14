import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 29, 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                ParameterX ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our cybersecurity services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may collect information about you in a variety of ways:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, company name, and job title when you contact us or request our services.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, operating system, and device information.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and navigation patterns.</li>
                <li><strong>Security Assessment Data:</strong> Technical information about your systems provided during security engagements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide, operate, and maintain our services</li>
                <li>Improve and personalize user experience</li>
                <li>Communicate with you about services, updates, and security advisories</li>
                <li>Conduct security assessments and deliver reports</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information. All data is encrypted in transit and at rest. Access to sensitive information is restricted to authorized personnel only. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Security assessment data is retained according to contractual agreements with clients.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Third-Party Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Email:</strong> contact@parameterx.org<br />
                <strong>Address:</strong> Suncity Sector 54, Gurugram, Haryana, India
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
