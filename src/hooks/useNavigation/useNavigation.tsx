'use client'

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Define os tipos para as tabs
type TabType = 'page1' | 'page2' | 'page3';

type NavItem = {
  id: TabType;
  label: string;
  icon: any;
  path: string;
};

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Define os itens de navegação
  const navItems = [
    { id: 'page1', label: 'Página 1', icon: 'FileText', path: '/painel/page1' },
    { id: 'page2', label: 'Página 2', icon: 'GitBranch', path: '/painel/page2' },
    { id: 'page3', label: 'Página 3', icon: 'Package2', path: '/painel/page3' },
  ];

  // Lista de tabs disponíveis na ordem que aparecem
  const tabs: TabType[] = ['page1', 'page2', 'page3'];

  // Redireciona para a URL do primeiro botão quando estiver na rota raiz
  useEffect(() => {
    if (pathname === '/painel') {
      const firstNavItem = navItems[0];
      router.push(firstNavItem.path);
    }
  }, [pathname, router, navItems]);

  // Determina qual tab está ativa baseado na URL
  const activeTab = pathname === '/painel' 
    ? tabs[0] // Sempre seleciona o primeiro da lista
    : pathname.includes('/page1')
    ? 'page1'
    : pathname.includes('/page2')
    ? 'page2'
    : pathname.includes('/page3')
    ? 'page3'
    : 'page1';

  const handleTabChange = (tab: TabType) => {
    if (tab === 'page1') {
      router.push('/painel/page1');
    } else if (tab === 'page2') {
      router.push('/painel/page2');
    } else if (tab === 'page3') {
      router.push('/painel/page3');
    }
  };

  return {
    navItems,
    tabs,
    activeTab,
    handleTabChange,
    pathname
  };
}
