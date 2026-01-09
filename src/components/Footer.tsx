import { Shield, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold tracking-wider">
                <span className="text-foreground">PERIMETER</span>
                <span className="text-primary"> X</span>
              </span>
            </a>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Defining the Next Edge of Defense. PerimeterX delivers expert-driven cybersecurity solutions to protect your organization against modern cyber threats.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-primary transition-colors">Penetration Testing</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Vulnerability Assessment</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Red Team Operations</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Cloud Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#why-us" className="hover:text-primary transition-colors">Why Choose Us</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 PerimeterX. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Hashtags */}
        <div className="text-center mt-8 pt-4 border-t border-border/30">
          <p className="text-xs text-primary/60">
            #PerimeterX #AICybersecurity #ZeroTrust #CyberDefense
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
