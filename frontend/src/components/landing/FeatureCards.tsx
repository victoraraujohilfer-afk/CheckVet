import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardCheck, FileText, BarChart3, ArrowRight } from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Checklist clínico em tempo real",
    description:
      "O sistema identifica o que já foi perguntado e examinado, e solicita os passos que estão faltando.",
  },
  {
    icon: FileText,
    title: "Prontuário automático (SOAP)",
    description:
      "Ao final da consulta, o CheckVet gera toda a documentação pronta, seguindo o formato SOAP padrão.",
  },
  {
    icon: BarChart3,
    title: "Auditoria de protocolo por veterinário",
    description:
      "O dono do hospital sabe exatamente quem segue o padrão clínico e onde estão as oportunidades de melhoria.",
  },
];

export function FeatureCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="solucao" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona o <span className="text-primary">Check</span>
            <span className="text-accent">Vet</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma solução completa para padronização e gestão clínica veterinária
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
              <button className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link">
                Saiba mais
                <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
