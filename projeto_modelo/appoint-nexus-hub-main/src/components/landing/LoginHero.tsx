
import React from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from '@/components/ui/TypewriterText';

export const LoginHero: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col justify-center h-full text-white px-8 lg:px-16"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
          Transforme seu
          <br />
          <TypewriterText 
            texts={[
              "atendimento", 
              "agendamento", 
              "relacionamento", 
              "crescimento"
            ]}
            className="text-accent block"
            typingSpeed={150}
            deletingSpeed={100}
            pauseDuration={2000}
          />
        </h1>
        
        <motion.p 
          className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          IA integrada que conhece seu negócio e atende seus clientes 24/7, 
          sem parar para almoço, férias ou feriados.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="text-lg">Implantação em 1 hora</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="text-lg">WhatsApp integrado</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="text-lg">Zero configuração</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="text-lg">Custo menor que um funcionário</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
