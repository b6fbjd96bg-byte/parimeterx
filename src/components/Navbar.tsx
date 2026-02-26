import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user } = useAuth();

  const navLinks = [
    { label: "Services", href: isHomePage ? "#services" : "/#services" },
    { label: "About", href: "/about" },
    { label: "Why Us", href: isHomePage ? "#why-us" : "/#why-us" },
    { label: "Contact", href: isHomePage ? "#contact" : "/#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black text-primary tracking-tighter transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6))]">X</span>
            <span className="text-xl font-bold tracking-wider">
              <span className="text-foreground">PARAMETER</span>
              <span className="text-primary"> X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
                >
                  {link.label}
                </a>
              )
            ))}
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
              <Button variant="cyber" size="sm" asChild>
                <Link to="/get-security-audit">Get Security Audit</Link>
              </Button>
            </>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith("/") && !link.href.includes("#") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
                    onClick={(e) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      } else {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <>
                <Button variant="ghost" size="sm" className="w-fit" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button variant="cyber" size="sm" className="w-fit" asChild>
                  <Link to="/get-security-audit">Get Security Audit</Link>
                </Button>
              </>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
