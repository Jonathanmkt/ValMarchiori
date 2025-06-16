
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { CalendarLines } from "@/components/ui/CalendarLines";
import { ArrowRight, ArrowDown, Clock } from 'lucide-react';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
  const typewriterTexts = [
    "inteligência artificial",
    "total controle", 
    "personalização",
    "funções sob medida",
    "flexibilidade",
    "velocidade",
    "facilidade"
  ];

  const partners = [
    {
      name: 'OpenAI',
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F"/>
        </svg>
      )
    },
    {
      name: 'NVIDIA',
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <defs>
            <linearGradient id="nvidia-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#76B900"/>
              <stop offset="100%" stopColor="#5DAF00"/>
            </linearGradient>
          </defs>
          <path d="M2.21 9.68l6.88-4.02c.94-.54 2.1-.54 3.04 0l6.88 4.02c.94.54 1.52 1.54 1.52 2.62v8.04c0 1.08-.58 2.08-1.52 2.62l-6.88 4.02c-.94.54-2.1.54-3.04 0L2.21 22.96c-.94-.54-1.52-1.54-1.52-2.62V12.3c0-1.08.58-2.08 1.52-2.62z" fill="url(#nvidia-gradient)"/>
          <path d="M12 8.5l-6.5 3.75v7.5L12 23.5l6.5-3.75v-7.5L12 8.5zm0 3.25l4.33 2.5v5L12 21.75l-4.33-2.5v-5L12 11.75z" fill="#ffffff"/>
        </svg>
      )
    },
    {
      name: 'Google',
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )
    },
    {
      name: 'Supabase',
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" fill="#3ECF8E"/>
        </svg>
      )
    },
    {
      name: 'Microsoft',
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00BCF2"/>
        </svg>
      )
    },
    {
      name: 'Meta',
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <defs>
            <linearGradient id="meta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0084ff"/>
              <stop offset="50%" stopColor="#ff00ff"/>
              <stop offset="100%" stopColor="#ff4500"/>
            </linearGradient>
          </defs>
          <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.98 3.66 9.1 8.42 9.84v-6.96H7.9v-2.88h2.56V9.85c0-2.53 1.5-3.93 3.82-3.93 1.11 0 2.26.2 2.26.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.88h-2.34v6.96C18.34 21.1 22 16.98 22 11.96 22 6.5 17.5 2.04 12 2.04z" fill="url(#meta-gradient)"/>
        </svg>
      )
    }
  ];

  return (
    <div className="relative text-white text-center max-w-4xl mx-auto">
      {/* Calendar Lines Background - Fixed positioned behind everything */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <CalendarLines 
          className="w-full h-full opacity-10" 
          variant="grid" 
          animated={true}
        />
      </div>

      <motion.div 
        className="relative z-10 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
      >
        {/* Highlight Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center"
        >
          <motion.div
            className="bg-gradient-to-r from-accent/20 to-accent/30 backdrop-blur-sm border border-accent/40 rounded-full px-6 py-3 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-accent font-semibold text-sm">Em apenas uma hora</span>
          </motion.div>
        </motion.div>

        {/* Hero Title and Description */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Seus agendamentos with{' '}
            <motion.div
              className="text-accent block mt-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <TypewriterText 
                texts={typewriterTexts}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={1500}
                className="text-accent"
              />
            </motion.div>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          >
            IA integrada que atende seus clientes 24/7, conhece seus serviços, profissionais e horários.
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-semibold relative overflow-hidden group px-8 py-3 rounded-full shadow-lg shadow-accent/25"
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            >
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 mr-2 text-white/80 relative z-10 group-hover:text-white transition-colors duration-300"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488"/>
              </svg>
              <span className="relative z-10">Fale Conosco</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="py-12 relative"
        >
          <p className="text-lg text-gray-300 mb-10">
            O melhor do mundo da tecnologia trabalhando pra você!
          </p>
          
          {/* Sophisticated Background Elements */}
          <div className="relative">
            {/* Glowing orb background */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-96 h-96 rounded-full bg-gradient-to-r from-accent/10 via-primary/20 to-accent/10 blur-3xl"></div>
            </div>
            
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent"/>
                  <stop offset="50%" stopColor="hsl(var(--accent))"/>
                  <stop offset="100%" stopColor="transparent"/>
                </linearGradient>
              </defs>
              {/* Horizontal connection lines */}
              <motion.path
                d="M50,100 Q400,80 750,100"
                stroke="url(#connectionGradient)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <motion.path
                d="M50,100 Q400,120 750,100"
                stroke="url(#connectionGradient)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 2, delay: 1.2 }}
              />
            </svg>
            
            {/* Partners Grid */}
            <motion.div
              className="relative flex flex-wrap justify-center items-center gap-8 opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="flex flex-col items-center group cursor-pointer relative"
                >
                  {/* Glowing background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-16 h-16 -translate-x-4 -translate-y-4"></div>
                  
                  <div className="group-hover:scale-110 transition-transform duration-300 mb-2 relative z-10">
                    {partner.logo}
                  </div>
                  <span className="text-xs font-medium text-white/50 group-hover:text-accent transition-colors duration-300 relative z-10">
                    {partner.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Bottom highlight line */}
            <motion.div
              className="mt-8 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            ></motion.div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};
