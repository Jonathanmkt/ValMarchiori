import React from 'react';
import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Calendar, Settings, Bot, Clock, BrainCircuit, ArrowRightLeft, Wallet, TrendingDown, TrendingUp, Smile, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Navigation } from '@/components/landing/Navigation';
import { BackgroundElements } from '@/components/landing/BackgroundElements';
import { HeroSection } from '@/components/landing/HeroSection';
import { DiferenciaisSection } from '@/components/landing/DiferenciaisSection';

export const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  
  const heroRef = useRef(null);
  const comoFunciona = useRef(null);
  const beneficios = useRef(null);
  const planos = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const comoFuncionaInView = useInView(comoFunciona, { once: true, amount: 0.2 });
  const beneficiosInView = useInView(beneficios, { once: true, amount: 0.2 });
  const planosInView = useInView(planos, { once: true, amount: 0.2 });

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'login') {
      navigate('/login');
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
      <motion.div 
        ref={heroRef}
        className="pt-16 flex items-center justify-center p-4 min-h-screen"
      >
        <div className="w-full max-w-7xl px-4 flex items-center justify-center">
          <HeroSection scrollToSection={scrollToSection} />
        </div>
      </motion.div>

      {/* Diferenciais Section */}
      <DiferenciaisSection />

      {/* Como Funciona Section - Melhorada */}
      <section id="como-funciona" ref={comoFunciona} className="py-20 bg-gradient-to-br from-primary via-secondary to-tertiary relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-accent/30 to-light/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-light/20 to-accent/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={comoFuncionaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              animate={comoFuncionaInView ? { scale: [0.9, 1.05, 1] } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Como funciona nossa solução
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={comoFuncionaInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Atendimento 24/7 sem interrupções, fins de semana ou feriados
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={comoFuncionaInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
          >
            {[
              { 
                icon: Calendar, 
                step: "1",
                title: "Agendamento da Implantação", 
                desc: "Agendamos uma reunião de 1 hora para implantar sua IA. Nossa equipe cuida de tudo para você.",
                colors: "from-accent/20 to-primary/20",
                glowColor: "accent"
              },
              { 
                icon: Settings, 
                step: "2",
                title: "Configuração Personalizada", 
                desc: "Configuramos a IA com seus serviços, profissionais, horários e políticas específicas da sua empresa.",
                colors: "from-secondary/20 to-light/20",
                glowColor: "secondary"
              },
              { 
                icon: Bot, 
                step: "3",
                title: "Atendimento Ativo", 
                desc: "Sua IA começa a atender clientes imediatamente, 24 horas por dia, integrada perfeitamente com sua equipe.",
                colors: "from-light/20 to-accent/20",
                glowColor: "accent"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={comoFuncionaInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.2 }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${item.colors} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, hsl(var(--${item.glowColor})) 0%, transparent 70%)`
                  }}
                />
                
                {/* Main card with glassmorphism effect */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl overflow-hidden h-full">
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
                  <div className="relative z-10 text-center h-full flex flex-col">
                    {/* Step number with icon */}
                    <motion.div
                      className="mb-6 flex flex-col items-center"
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
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.colors} backdrop-blur-sm mb-4`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{item.step}</span>
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-200 leading-relaxed group-hover:text-white transition-colors duration-300 flex-grow">
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

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={comoFuncionaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Pronto para começar?
              </h3>
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                Nossa equipe especializada faz toda a configuração em apenas 1 hora. 
                Você não precisa se preocupar com nada técnico.
              </p>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8"
                onClick={() => scrollToSection('planos')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Implantação Agora
              </Button>
            </div>
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            className="mt-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={comoFuncionaInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
        </div>
      </section>

      {/* Benefícios Section - Design System Award Edition */}
      <section id="beneficios" ref={beneficios} className="py-24 sm:py-32 bg-gradient-to-br from-light/50 via-accent/20 to-light/70 relative overflow-hidden">
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
            animate={beneficiosInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              Por que AppointNexus é a escolha certa?
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Nós não apenas automatizamos. Nós elevamos seu atendimento a um novo patamar de excelência e eficiência.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-20"
            initial="hidden"
            animate={beneficiosInView ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {[
              { icon: Clock, title: "Atendimento 24/7 Ininterrupto", desc: "Nunca mais perca clientes por estar fechado. Atendimento contínuo, inclusive fins de semana e feriados." },
              { icon: BrainCircuit, title: "Conhecimento Total do Negócio", desc: "IA que sabe tudo sobre seus serviços, profissionais, horários e políticas específicas." },
              { icon: ArrowRightLeft, title: "Transição Humano-IA Perfeita", desc: "Colaboração fluida entre IA e equipe humana, começando e transferindo atendimentos quando necessário." },
              { icon: Wallet, title: "Economia Significativa", desc: "Equipe completa de IA por menos que o custo de um funcionário com salário mínimo." }
            ].map((item, index) => (
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
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-3">{item.title}</h3>
                    <p className="text-secondary/90 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={beneficiosInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-primary mb-3">Resultados que Falam por Si</h3>
            <div className="h-1 w-24 bg-accent mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            animate={beneficiosInView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } }
            }}
          >
            {[
              { icon: TrendingDown, value: "-70%", label: "em custos operacionais" },
              { icon: TrendingUp, value: "+85%", label: "em conversões de vendas" },
              { icon: Smile, value: "+92%", label: "em satisfação do cliente" },
              { icon: Server, value: "24/7", label: "de disponibilidade total" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                }}
              >
                <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/40 shadow-lg h-full flex flex-col justify-center items-center">
                  <item.icon className="w-8 h-8 text-accent mb-3" />
                  <span className="text-4xl font-bold text-primary">{item.value}</span>
                  <p className="mt-1 text-secondary/80 text-sm">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" ref={planos} className="py-20 bg-gradient-to-br from-light/30 to-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-gray-600">
              Implantação em 1 hora por nossa equipe especializada
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Básico</h3>
              <p className="text-gray-600 mb-6">Ideal para pequenas empresas</p>
              <div className="text-4xl font-bold text-primary mb-6">
                R$ 297<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>IA integrada ao WhatsApp</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Implantação em 1 hora</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Atendimento 24/7</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Suporte técnico</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-secondary">
                Começar agora
              </Button>
            </div>

            {/* Plano Profissional */}
            <div className="bg-gradient-to-br from-accent to-primary rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Profissional</h3>
              <p className="text-white/80 mb-6">Para empresas em crescimento</p>
              <div className="text-4xl font-bold mb-6">
                R$ 497<span className="text-lg text-white/70">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Tudo do plano Básico</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Integração com equipe humana</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Personalização total</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-primary hover:bg-white/90">
                Começar agora
              </Button>
            </div>

            {/* Plano Enterprise */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Para grandes empresas</p>
              <div className="text-4xl font-bold text-primary mb-6">
                R$ 897<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Tudo do plano Profissional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Múltiplas empresas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>API personalizada</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-secondary">
                Falar com consultor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-tertiary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para revolucionar seu atendimento?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Implantação em apenas 1 hora por nossa equipe especializada. 
            Comece a atender seus clientes 24/7 ainda hoje!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white font-semibold px-8"
              onClick={() => scrollToSection('planos')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Agendar Implantação
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8"
              onClick={() => scrollToSection('login')}
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold">AppointNexus</span>
              </div>
              <p className="text-gray-300">
                IA integrada para atendimento e agendamentos 24/7
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-accent">Recursos</a></li>
                <li><a href="#" className="hover:text-accent">Integrações</a></li>
                <li><a href="#" className="hover:text-accent">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-accent">Sobre</a></li>
                <li><a href="#" className="hover:text-accent">Contato</a></li>
                <li><a href="#" className="hover:text-accent">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-300">
                <li>suporte@appointnexus.com</li>
                <li>(11) 9999-9999</li>
                <li>Segunda à Sexta, 9h às 18h</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 AppointNexus. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
