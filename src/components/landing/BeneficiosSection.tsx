'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Clock, 
  BrainCircuit, 
  ArrowRightLeft, 
  Wallet,
  TrendingDown,
  TrendingUp,
  Smile,
  Server
} from 'lucide-react';

export const BeneficiosSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="beneficios" ref={ref} className="py-24 sm:py-32 bg-gradient-to-br from-light/50 via-accent/20 to-light/70 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Por que nossa solução é a escolha certa?
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Nós não apenas automatizamos. Nós elevamos seu atendimento a um novo patamar de excelência e eficiência.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-20"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {[
            { icon: Clock, title: "Atendimento 24/7 Ininterrupto", desc: "Nunca mais perca clientes por estar fechado. Atendimento contínuo, inclusive fins de semana e feriados." },
            { icon: BrainCircuit, title: "Conhecimento Total do Negócio", desc: "IA que sabe tudo sobre seus serviços, profissionais, horários e políticas específicas." },
            { icon: ArrowRightLeft, title: "Transição Humano-IA Perfeita", desc: "Colaboração fluida entre IA e equipe humana, começando e transferindo atendimentos quando necessário." },
            { icon: Wallet, title: "Economia Significativa", desc: "Equipe completa de IA por menos que o custo de um funcionário com salário mínimo." }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
              >
                <div className="group relative bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-white/50 h-full shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-accent/80 to-primary/80 text-white shadow-md">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-3">{item.title}</h3>
                    <p className="text-secondary/90 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-primary mb-3">Resultados que Falam por Si</h3>
          <div className="h-1 w-24 bg-accent mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } }
          }}
        >
          {[
            { icon: TrendingDown, value: "-70%", label: "em custos operacionais" },
            { icon: TrendingUp, value: "+85%", label: "em conversões de vendas" },
            { icon: Smile, value: "+92%", label: "em satisfação do cliente" },
            { icon: Server, value: "24/7", label: "de disponibilidade total" }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                }}
              >
                <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/40 shadow-lg h-full flex flex-col justify-center items-center">
                  <Icon className="w-8 h-8 text-accent mb-3" />
                  <span className="text-4xl font-bold text-primary">{item.value}</span>
                  <p className="mt-1 text-secondary/80 text-sm">{item.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
