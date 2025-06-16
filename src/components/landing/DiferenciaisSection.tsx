'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Bot, 
  Users, 
  Clock, 
  Smartphone, 
  Settings, 
  DollarSign 
} from 'lucide-react';
import { CalendarLines } from "@/components/ui/CalendarLines";

export const DiferenciaisSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section 
      id="diferenciais" 
      ref={ref}
      className="py-20 bg-gradient-to-br from-primary via-secondary to-tertiary relative overflow-hidden"
    >
      {/* Calendar Lines Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-5">
        <CalendarLines 
          className="w-full h-full" 
          variant="grid" 
          animated={true}
        />
      </div>

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-primary/10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2 }}
      />

      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-secondary/15 to-accent/15 rounded-full blur-3xl"></div>
      
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
            Por que escolher nossa solução?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Uma equipe inteira de IA pode custar menos que um único funcionário com salário mínimo
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
        >
          {[
            { 
              icon: Bot, 
              title: "IA Integrada à Agenda", 
              desc: "Conhece seus serviços, profissionais, horários, locais e políticas de atendimento. Totalmente personalizada para sua empresa.",
              colors: "from-accent/20 to-primary/20",
              glowColor: "accent"
            },
            { 
              icon: Users, 
              title: "Integração com Equipe Humana", 
              desc: "IA inicia e passa para humanos, ou humanos iniciam e passam para IA. Comunicação fluida entre robôs e pessoas.",
              colors: "from-secondary/20 to-tertiary/20",
              glowColor: "secondary"
            },
            { 
              icon: Clock, 
              title: "Implantação em 1 Hora", 
              desc: "Nossa equipe especializada implanta e configura tudo em uma única reunião. Você não faz nada sozinho!",
              colors: "from-accent/20 to-secondary/20",
              glowColor: "accent"
            },
            { 
              icon: Smartphone, 
              title: "Integração Total WhatsApp", 
              desc: "Cliente conversa normalmente no WhatsApp oficial da sua empresa e nossa IA responde como se fosse um humano.",
              colors: "from-tertiary/20 to-accent/20",
              glowColor: "tertiary"
            },
            { 
              icon: Settings, 
              title: "Fácil Administração", 
              desc: "Painel de controle simples e intuitivo. Atualize serviços, preços, horários e disponibilidade com poucos cliques.",
              colors: "from-primary/20 to-secondary/20",
              glowColor: "primary"
            },
            { 
              icon: DollarSign, 
              title: "Economia Surpreendente", 
              desc: "Redução significativa de custos operacionais com nossa IA trabalhando 24 horas sem salários ou benefícios.",
              colors: "from-secondary/20 to-primary/20",
              glowColor: "secondary"
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index * 0.1
                }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${item.colors} rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                  style={{
                    background: `radial-gradient(circle at 50% 30%, hsl(var(--${item.glowColor})) 0%, transparent 70%)`
                  }}
                />
                
                {/* Card with glassmorphism effect */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl overflow-hidden h-full">
                  <div className="flex flex-col h-full items-center text-center">
                    {/* Icon with animated glow */}
                    <div className="relative mb-4">
                      <motion.div 
                        className="absolute inset-0 rounded-full opacity-40 blur-md"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.5, 0.3] 
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        style={{
                          background: `radial-gradient(circle at 50% 50%, hsl(var(--${item.glowColor})) 0%, transparent 70%)`
                        }}
                      />
                      <div className="relative bg-gradient-to-br from-white/20 to-white/5 p-4 rounded-full backdrop-blur-sm border border-white/20">
                        <Icon size={28} className="text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Animated border gradient */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 rounded-xl overflow-hidden [mask:linear-gradient(white,transparent_50%)]">
                      <div className="h-[200%] w-[200%] animate-[spin_4s_linear_infinite]">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};
