import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const scrollToContact = () => {
    const element = document.querySelector("#contato");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-primary" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Transforme o padrão clínico do seu hospital veterinário
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Agende uma demonstração gratuita e veja na prática como o CheckVet pode revolucionar sua clínica
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-background text-primary hover:bg-background/90 px-8"
            onClick={scrollToContact}
          >
            Solicitar demonstração
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
