'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">YouLab</span>
            </div>
            <p className="text-gray-300">
              IA integrada para atendimento e agendamentos 24/7
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#diferenciais" className="hover:text-accent">Recursos</Link></li>
              <li><Link href="#como-funciona" className="hover:text-accent">Integrações</Link></li>
              <li><Link href="#beneficios" className="hover:text-accent">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-accent">Sobre</Link></li>
              <li><Link href="#" className="hover:text-accent">Contato</Link></li>
              <li><Link href="#" className="hover:text-accent">Suporte</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-300">
              <li>suporte@youlab.com.br</li>
              <li>(11) 9999-9999</li>
              <li>Segunda à Sexta, 9h às 18h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} YouLab. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
