import { Linkedin, Twitter, Github, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center mb-4 group">
              <span className="text-lg font-extrabold tracking-[0.2em] uppercase select-none">
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">PARAMETER</span>
                <span className="bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent ml-1 drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]">X</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Defining the Next Edge of Defense. ParameterX delivers expert-driven cybersecurity solutions to protect your organization against modern cyber threats.
            </p>
            
            {/* Contact Info with Icons */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@parameterx.org</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>8851484102</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Suncity Sector 54, Gurugram, Haryana, India</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href="https://linkedin.com/company/parameterx" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/parameterx" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/parameterx" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://facebook.com/parameterx" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@parameterx" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services/application-pentest" className="hover:text-primary transition-colors">Penetration Testing</Link></li>
              <li><Link to="/services/network-pentest" className="hover:text-primary transition-colors">Network Security</Link></li>
              <li><Link to="/services/red-team-assessment" className="hover:text-primary transition-colors">Red Team Operations</Link></li>
              <li><Link to="/services/cloud-pentest" className="hover:text-primary transition-colors">Cloud Security</Link></li>
              <li><Link to="/services/web-application-security" className="hover:text-primary transition-colors">Web App Security</Link></li>
              <li><Link to="/services/blockchain-security" className="hover:text-primary transition-colors">Blockchain Security</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/#why-us" className="hover:text-primary transition-colors">Why Choose Us</Link></li>
              <li><Link to="/#contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ParameterX. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Hashtags */}
        <div className="text-center mt-8 pt-4 border-t border-border/30">
          <p className="text-xs text-primary/60">
            #ParameterX #AICybersecurity #ZeroTrust #CyberDefense
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
