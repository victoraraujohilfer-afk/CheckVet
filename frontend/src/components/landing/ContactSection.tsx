import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contato@checkvet.com.br",
    href: "mailto:contato@checkvet.com.br",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "(11) 99999-9999",
    href: "https://wa.me/5511999999999",
  },
  {
    icon: MapPin,
    label: "Localização",
    value: "São Paulo, SP - Brasil",
  },
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contato" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contato
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entre em contato conosco
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group"
            >
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex flex-col items-center text-center bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                    {item.value}
                  </p>
                </a>
              ) : (
                <div className="flex flex-col items-center text-center bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-foreground text-lg">{item.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
