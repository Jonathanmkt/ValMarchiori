'use client';

import { useScroll } from 'framer-motion';

// Componentes da landing page
import { BackgroundElements } from "@/components/landing/BackgroundElements";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { DiferenciaisSection } from "@/components/landing/DiferenciaisSection";
import { TechPartnersSection } from "@/components/landing/TechPartnersSection";
import { ComoFuncionaSection } from "@/components/landing/ComoFuncionaSection";
import { BeneficiosSection } from "@/components/landing/BeneficiosSection";
import { PlanosSection } from "@/components/landing/PlanosSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'login') {
      window.location.href = '/login';
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-tertiary relative overflow-hidden">
      <BackgroundElements scrollYProgress={scrollYProgress} />
      
      <Navigation scrollToSection={scrollToSection} />
      
      {/* Hero Section */}
      <div className="pt-16 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-7xl px-4 flex items-center justify-center">
          <HeroSection scrollToSection={scrollToSection} />
        </div>
      </div>

      {/* Diferenciais Section */}
      <DiferenciaisSection />

      {/* Como Funciona Section */}
      <ComoFuncionaSection />

      {/* Beneficios Section */}
      <BeneficiosSection />

      {/* Tech Partners Section */}
      <TechPartnersSection />

      {/* Planos Section */}
      <PlanosSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
