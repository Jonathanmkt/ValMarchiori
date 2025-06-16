
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
              desc: "Apenas leia um QR Code, faça um cadastro simples e veja sua IA atendendo clientes imediatamente.",
              colors: "from-primary/20 to-accent/20",
              glowColor: "primary"
            },
            { 
              icon: Settings, 
              title: "Zero Complicação", 
              desc: "Total personalização sem complicação. Não precisa criar contas complexas ou configurar nada sozinho.",
              colors: "from-secondary/20 to-primary/20",
              glowColor: "secondary"
            },
            { 
              icon: DollarSign, 
              title: "Custo-Benefício Incrível", 
              desc: "Uma equipe completa de IA custa menos que os encargos de um funcionário com salário mínimo.",
              colors: "from-accent/20 to-tertiary/20",
              glowColor: "accent"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.1 }}
            >
              {/* Glow effect on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${item.colors} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                style={{
                  background: `radial-gradient(circle at 50% 50%, hsl(var(--${item.glowColor})) 0%, transparent 70%)`
                }}
              />
              
              {/* Main card with glassmorphism effect */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                
                {/* Animated background shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="mb-6"
                    animate={{ 
                      y: [-2, 2, -2],
                      rotate: [-0.5, 0.5, -0.5]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.colors} backdrop-blur-sm`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-200 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.colors} opacity-0 group-hover:opacity-100`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
        />
      </div>
    </motion.section>
  );
};
