'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  scrollToSection: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ scrollToSection }) => {
  return (
    <motion.nav 
      className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-sm border-b border-white/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <CalendarDays className="w-8 h-8 text-accent" />
            </div>
            <span className="text-2xl font-bold text-white">Agendamento Virtuetech</span>
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {[
              { id: 'servicos', label: 'Serviços' },
              { id: 'sobre', label: 'Sobre nós' },
              { id: 'contato', label: 'Contato' }
            ].map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-white hover:text-accent transition-colors relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                {section.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>

          <div className="flex space-x-4">
            <Link href="/login" passHref>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white text-white hover:bg-white hover:text-primary transition-colors"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
