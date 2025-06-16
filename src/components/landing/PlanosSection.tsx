'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export const PlanosSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="planos" ref={ref} className="py-20 bg-gradient-to-br from-light/30 to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Escolha seu plano
          </h2>
          <p className="text-xl text-gray-600">
            Implantação em 1 hora por nossa equipe especializada
          </p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
          }}
        >
          {/* Plano Básico */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
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
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-secondary">
                  Começar agora
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Plano Profissional */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1.05, transition: { duration: 0.8 } }
            }}
          >
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
                  <span>Personalização avançada</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Relatórios de desempenho</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>API para integrações</span>
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-white hover:bg-gray-100 text-primary">
                  Escolher este plano
                </Button>
              </Link>

              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </motion.div>

          {/* Plano Empresarial */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Empresarial</h3>
              <p className="text-gray-600 mb-6">Para empresas consolidadas</p>
              <div className="text-4xl font-bold text-primary mb-6">
                R$ 997<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Tudo do plano Profissional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Múltiplos atendentes virtuais</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Integração com CRM/ERP</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-accent mr-3" />
                  <span>IA treinada com dados próprios</span>
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-secondary">
                  Começar agora
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Todos os planos incluem implantação gratuita pela nossa equipe especializada.
            <br />
            <span className="text-primary font-semibold">
              Cancelamento a qualquer momento sem multa.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
