'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Bot, Clock } from 'lucide-react';

export const ComoFuncionaSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="como-funciona" ref={ref} className="py-20 bg-gradient-to-br from-primary via-secondary to-tertiary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-accent/30 to-light/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-light/20 to-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            animate={isInView ? { scale: [0.9, 1.05, 1] } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Como funciona nossa solução
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Atendimento 24/7 sem interrupções, fins de semana ou feriados
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
        >
          {[
            { 
              icon: Calendar, 
              step: "1",
              title: "Agendamento da Implantação", 
              desc: "Logo após a contratação, você agenda uma reunião online de 1 hora com nossa equipe para configurarmos tudo juntos.",
              color: "from-accent to-primary"
            },
            { 
              icon: Bot, 
              step: "2",
              title: "Configuração da IA", 
              desc: "Nossa equipe configura o atendente virtual para conhecer todos os detalhes do seu negócio e regras de atendimento.",
              color: "from-primary to-secondary"
            },
            { 
              icon: Clock, 
              step: "3",
              title: "Ativação Imediata", 
              desc: "No mesmo dia, seu sistema já está 100% operacional e pronto para atender seus clientes no WhatsApp oficial.",
              color: "from-secondary to-accent"
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              >
                {/* Step card with glassmorphism */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl h-full">
                  <div className="flex flex-col h-full">
                    {/* Step number with gradient background */}
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {item.step}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      </div>
                    </div>
                    
                    {/* Step icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Icon size={32} className="text-white" />
                      </div>
                    </div>
                    
                    {/* Step description */}
                    <p className="text-gray-200 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Decoration elements */}
                  <div className="absolute top-2 right-2 w-20 h-20 rounded-full bg-gradient-to-r from-white/5 to-transparent opacity-30"></div>
                  <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full bg-gradient-to-r from-white/5 to-transparent opacity-30"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
