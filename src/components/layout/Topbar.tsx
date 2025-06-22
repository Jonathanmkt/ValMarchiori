'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { UserProfile } from './UserProfile';

interface TopBarProps {
  pageTitle?: string;
}

export function TopBar({ pageTitle }: TopBarProps) {
  const pathname = usePathname();
  
  // Função para determinar o título baseado no caminho atual
  const getCurrentPageTitle = () => {
    if (pathname?.includes('/product')) return 'Produtos';
    if (pathname?.includes('/clientes')) return 'Clientes';
    
    // Título padrão para outras páginas
    return pageTitle || '';
  };
  
  return (
    <header className='flex h-14 items-center justify-between bg-tertiary px-6'>
      <h1 className='text-xl font-semibold text-tertiary-foreground'>
        {getCurrentPageTitle()}
      </h1>
      <div className='flex h-full items-center gap-4'>
        <div className='flex h-full items-center'>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
