import { Shield, Linkedin, Twitter, Github, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold tracking-wider">
                <span className="text-foreground">PERIMETER</span>
                <span className="text-primary"> X</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Defining the Next Edge of Defense. PerimeterX delivers expert-driven cybersecurity solutions to protect your organization against modern cyber threats.
            </p>
            
            {/* Contact Info with Icons */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@perimeterx.io</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (800) 555-SECX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>San Francisco, CA</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services/penetration-testing" className="hover:text-primary transition-colors">Penetration Testing</Link></li>
              <li><Link to="/services/vulnerability-assessment" className="hover:text-primary transition-colors">Vulnerability Assessment</Link></li>
              <li><Link to="/services/red-team-operations" className="hover:text-primary transition-colors">Red Team Operations</Link></li>
              <li><Link to="/services/cloud-security-assessment" className="hover:text-primary transition-colors">Cloud Security</Link></li>
              <li><Link to="/services/web-application-security" className="hover:text-primary transition-colors">Web App Security</Link></li>
              <li><Link to="/services/blockchain-security" className="hover:text-primary transition-colors">Blockchain Security</Link></li>
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
