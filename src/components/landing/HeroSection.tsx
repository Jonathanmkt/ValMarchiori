'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
  const [typingText, setTypingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(75); // Velocidade dobrada (metade do tempo)
  
  // Usando useMemo para evitar recriação do array a cada renderização
  const textArray = useMemo(() => [
    "Inteligência Artificial", 
    "Velocidade", 
    "Baixo custo", 
    "Excelência"
  ], []);
  
  const period = 1000; // pausa entre palavras reduzida pela metade

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % textArray.length;
      const fullText = textArray[i];

      setTypingText(
        isDeleting
          ? fullText.substring(0, typingText.length - 1)
          : fullText.substring(0, typingText.length + 1)
      );

      setTypingSpeed(isDeleting ? 40 : 75); // Velocidade dobrada (metade do tempo)

      if (!isDeleting && typingText === fullText) {
        // Pausa após digitar completamente
        setTimeout(() => setIsDeleting(true), period);
      } else if (isDeleting && typingText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typingText, isDeleting, loopNum, typingSpeed, textArray]);
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12">
      {/* Left - Text Content */}
      <motion.div
        className="text-left lg:pr-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="whitespace-nowrap">Agendamentos com</div>
          <motion.div
            className="text-accent min-h-[1.2em] inline-flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{ minWidth: '100%' }}
          >
            {typingText}
            <span className="text-accent animate-pulse">|</span>
          </motion.div>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-200 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Integramos as tecnologias mais avançadas do mundo em uma solução simples.
          <span className="font-semibold"> Sem complicações. Sem configurações complexas.</span>
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            size="lg"
            onClick={() => scrollToSection('servicos')}
            className="bg-accent hover:bg-accent/90 text-primary font-semibold"
          >
            Conheça nossos serviços
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection('contato')}
            className="border-white text-white hover:bg-white/10"
          >
            Entre em contato
          </Button>
        </motion.div>
      </motion.div>

      {/* Right - Animated Graphics */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl h-[400px] lg:h-[500px]">
          {/* Calendar illustration placeholder */}
          <div className="absolute inset-0 flex flex-col p-8 rounded-2xl overflow-hidden">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-t-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="text-white font-semibold">Junho 2025</div>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded-full bg-white/30"></div>
                  <div className="w-6 h-6 rounded-full bg-white/30"></div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-xs font-medium text-white/70">{day}</div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-b from-white/10 to-primary/20 backdrop-blur-sm p-4 overflow-y-auto rounded-b-lg">
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {Array.from({ length: 30 }, (_, i) => (
                  <motion.div 
                    key={i}
                    className={`w-full aspect-square flex items-center justify-center rounded-full 
                      ${i === 15 ? 'bg-accent text-primary' : 'hover:bg-white/20'} 
                      text-sm cursor-pointer text-white transition duration-200`}
                    whileHover={{ scale: 1.15 }}
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3 mt-6">
                {[
                  { time: '09:00', title: 'Consulta', client: 'Maria Silva' },
                  { time: '11:30', title: 'Procedimento', client: 'João Santos' },
                  { time: '14:15', title: 'Avaliação', client: 'Ana Oliveira' }
                ].map((appt, i) => (
                  <motion.div 
                    key={i} 
                    className="bg-white/15 backdrop-blur-md p-3 rounded-lg border border-white/20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (i * 0.2), duration: 0.5 }}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <div className="flex justify-between">
                      <span className="text-white font-medium">{appt.time}</span>
                      <span className="text-accent/90 text-sm">{appt.title}</span>
                    </div>
                    <div className="text-white/70 text-sm">{appt.client}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
