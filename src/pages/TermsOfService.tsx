import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 29, 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using ParameterX's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                ParameterX provides cybersecurity services including but not limited to penetration testing, vulnerability assessments, security audits, red team operations, and security consulting. All services are provided subject to a separate Statement of Work or service agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Authorization and Scope</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Before any security testing engagement:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Client must provide written authorization for all testing activities</li>
                <li>Testing scope must be clearly defined and agreed upon</li>
                <li>Client warrants they have authority to authorize testing on target systems</li>
                <li>Any systems not explicitly in scope are excluded from testing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                ParameterX maintains strict confidentiality regarding all client information and assessment findings. We will not disclose any information about your systems, vulnerabilities, or security posture to third parties without your explicit written consent, except as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we exercise professional care in our services, security testing inherently carries some risk. ParameterX shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the fees paid for the specific service giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All methodologies, tools, techniques, and general knowledge developed by ParameterX remain our intellectual property. Clients receive full ownership of all deliverables and reports specific to their engagement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Professional Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ParameterX adheres to professional and ethical standards:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>We operate within authorized scope at all times</li>
                <li>We follow responsible disclosure practices</li>
                <li>We maintain professional certifications and training</li>
                <li>We comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate services with written notice as specified in the applicable service agreement. Upon termination, client remains responsible for fees for services rendered. Confidentiality obligations survive termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, contact us at:
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

export default TermsOfService;
