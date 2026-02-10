import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/checkvet-logo-new.png";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Solução", href: "#solucao" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    // Se for uma âncora (#), faz scroll
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    // Pode criar uma página de cadastro ou abrir o modal de contato
    navigate("/login"); // Por enquanto vai para login, depois criar página de signup
  };

  const handleLogoClick = () => {
    // Se estiver na home, faz scroll para o topo
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Se estiver em outra página, navega para home
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center">
            <img src={logo} alt="CheckVet" className="h-[120px] md:h-40 w-auto mt-2 md:mt-3" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleLogin}>
              Login
            </Button>
            <Button size="sm" onClick={handleSignup}>
              Cadastre-se
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left px-4 py-3 text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border mt-2">
                <Button variant="outline" onClick={handleLogin}>
                  Login
                </Button>
                <Button onClick={handleSignup}>
                  Cadastre-se
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}