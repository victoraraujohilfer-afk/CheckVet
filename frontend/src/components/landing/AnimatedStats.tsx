import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  {
    value: 92,
    label: "Aumento de padronização clínica",
    color: "hsl(210, 100%, 40%)", // primary blue
  },
  {
    value: 70,
    label: "Redução do tempo de prontuário",
    color: "hsl(120, 39%, 54%)", // accent green
  },
  {
    value: 95,
    label: "Aderência ao protocolo clínico",
    color: "hsl(210, 100%, 50%)", // lighter blue
  },
];

function AnimatedCircle({
  value,
  label,
  color,
  isInView,
  delay,
}: {
  value: number;
  label: string;
  color: string;
  isInView: boolean;
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(easeOutQuart * value);
          setDisplayValue(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="hsl(220, 13%, 91%)"
            strokeWidth="12"
          />
          {/* Animated circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{displayValue}%</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-medium text-muted-foreground max-w-[140px]">
        {label}
      </p>
    </motion.div>
  );
}

export function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resultados" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Resultados comprovados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja o impacto do CheckVet nas clínicas e hospitais veterinários parceiros
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {stats.map((stat, index) => (
            <AnimatedCircle
              key={stat.label}
              value={stat.value}
              label={stat.label}
              color={stat.color}
              isInView={isInView}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
