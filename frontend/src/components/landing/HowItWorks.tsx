import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, Brain, CheckSquare, FileOutput } from "lucide-react";

const steps = [
  {
    icon: Mic,
    number: "01",
    title: "Microfone capta a consulta",
    description: "O áudio da consulta é capturado em tempo real através de um microfone discreto.",
  },
  {
    icon: Brain,
    number: "02",
    title: "IA analisa a conversa",
    description: "Nossa inteligência artificial processa e interpreta todo o conteúdo da consulta.",
  },
  {
    icon: CheckSquare,
    number: "03",
    title: "Checklist é atualizado em tempo real",
    description: "O sistema marca automaticamente os itens já realizados e indica o que falta.",
  },
  {
    icon: FileOutput,
    number: "04",
    title: "Relatórios e prontuário são gerados",
    description: "Ao final, toda documentação é gerada automaticamente no formato padrão.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="como-funciona" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona na prática
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Em 4 passos simples, transforme a forma como sua clínica documenta e padroniza atendimentos
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group h-full"
              >
                <div className="text-center bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <step.icon className="h-8 w-8 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
