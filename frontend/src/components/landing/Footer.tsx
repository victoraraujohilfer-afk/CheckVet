import { useNavigate } from "react-router-dom";
import hilferLogo from "@/assets/hilfer-logo.png";

const footerLinks = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "#funcionalidades" },
      { label: "Como Funciona", href: "#como-funciona" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Contato", href: "#contato" },
    ],
  },
];

export function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      // Se estiver na home, faz scroll
      if (window.location.pathname === "/") {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Se estiver em outra página, navega para home e depois faz scroll
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-10 pb-2">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-2 text-center md:text-left">
          {/* Brand */}
          <div className="flex justify-center md:justify-start items-center md:items-start md:pt-6">
            <p className="text-lg font-bold text-primary-foreground leading-tight text-center md:text-left">
              O Melhor Amigo<br />do Veterinário!
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-primary-foreground mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Hilfer */}
          <div className="flex flex-col items-center text-center">
            <span className="font-bold text-primary-foreground text-xl">CheckVet</span>
            <span className="text-[10px] text-primary-foreground/80 mb-1">é uma solução da:</span>
            <img src={hilferLogo} alt="Hilfer" className="h-[140px] w-auto -mt-7" />
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-2">
          <p className="text-sm text-primary-foreground/70 text-center">
            © {new Date().getFullYear()} CheckVet. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}