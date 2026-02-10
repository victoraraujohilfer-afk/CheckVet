import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import hero2 from "@/assets/hero-2.jpg";
import hero4 from "@/assets/hero-4.jpg";

const mockups = [
  {
    id: "checklist",
    title: "Checklist em Tempo Real",
    description: "Acompanhe o progresso da consulta com itens que se marcam automaticamente",
    image: hero2,
  },
  {
    id: "soap",
    title: "Prontuário SOAP",
    description: "Documentação completa gerada automaticamente ao final de cada atendimento",
    image: hero4,
  },
  {
    id: "dashboard",
    title: "Dashboard Gerencial",
    description: "Visão completa de métricas e indicadores de desempenho da sua equipe",
    image: hero2,
  },
];

export function Mockups() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("checklist");

  const activeMockup = mockups.find((m) => m.id === activeTab);

  return (
    <section id="funcionalidades" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conheça o sistema
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interface intuitiva projetada para facilitar o dia a dia da sua clínica
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {mockups.map((mockup) => (
            <button
              key={mockup.id}
              onClick={() => setActiveTab(mockup.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === mockup.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {mockup.title}
            </button>
          ))}
        </div>

        {/* Active Mockup Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-background rounded-2xl shadow-xl overflow-hidden border border-border">
            {/* Browser Chrome */}
            <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background rounded-md px-4 py-1.5 text-xs text-muted-foreground">
                  app.checkvet.com.br
                </div>
              </div>
            </div>
            {/* Screenshot */}
            <div className="aspect-video relative overflow-hidden">
              <img
                src={activeMockup?.image}
                alt={activeMockup?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
          <p className="text-center mt-6 text-muted-foreground">{activeMockup?.description}</p>
        </motion.div>
      </div>
    </section>
  );
}
