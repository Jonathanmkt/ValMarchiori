'use client';

import React, { useState, useEffect } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface BackgroundElementsProps {
  scrollYProgress: MotionValue<number>;
}

export const BackgroundElements: React.FC<BackgroundElementsProps> = ({ scrollYProgress }) => {
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  
  // Estado para controlar se estamos no cliente
  const [isClient, setIsClient] = useState(false);
  
  // Estado para armazenar as posições das partículas
  const [particles, setParticles] = useState<Array<{x: number, y: number, duration: number}>>([]);
  
  // Efeito que só executa no cliente
  useEffect(() => {
    setIsClient(true);
    
    // Gerar posições aleatórias para as partículas
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const newParticles = Array(6).fill(0).map(() => ({
      x: Math.random() * windowWidth,
      y: Math.random() * windowHeight,
      duration: 8 + Math.random() * 4
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <>
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
      </motion.div>

      {/* Floating Particles - Só renderiza no cliente */}
      {isClient && particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-accent rounded-full opacity-60"
          initial={{ 
            x: particle.x, 
            y: particle.y
          }}
          animate={{
            y: [particle.y, particle.y - 100, particle.y],
            x: [particle.x, particle.x + (Math.random() * 50 - 25), particle.x],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};
