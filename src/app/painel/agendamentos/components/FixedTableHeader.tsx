'use client';

import React from 'react';

export function FixedTableHeader() {
  return (
    <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
      <div className="flex">
        <div className="w-[20%] py-3 px-4">
          <span className="text-xs font-medium text-gray-500 uppercase">Horário</span>
        </div>
        <div className="w-[35%] py-3 px-4">
          <span className="text-xs font-medium text-gray-500 uppercase">Nome</span>
        </div>
        <div className="w-[35%] py-3 px-4">
          <span className="text-xs font-medium text-gray-500 uppercase">Telefone</span>
        </div>
        <div className="w-[10%] py-3 px-4">
          <span className="text-xs font-medium text-gray-500 uppercase">Contato</span>
        </div>
        <div className="w-[10%] py-3 px-4">
          <span className="text-xs font-medium text-gray-500 uppercase">Agendar</span>
        </div>
      </div>
    </div>
  );
}
