'use client'

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Users, Calendar, Package2 } from 'lucide-react';

// Define os tipos para as tabs
type TabType = 'pacientes' | 'agendamentos' | 'page3';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  path: string;
}

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Define os itens de navegação
  const navItems = useMemo<NavItem[]>(() => [
    { id: 'pacientes', label: 'Pacientes', icon: Users, path: '/painel/pacientes' },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar, path: '/painel/agendamentos' },
    { id: 'page3', label: 'Página 3', icon: Package2, path: '/painel/page3' },
  ], []);

  // Lista de tabs disponíveis na ordem que aparecem
  const tabs: TabType[] = ['pacientes', 'agendamentos', 'page3'];

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
    : pathname.includes('/pacientes')
    ? 'pacientes'
    : pathname.includes('/agendamentos')
    ? 'agendamentos'
    : pathname.includes('/page3')
    ? 'page3'
    : 'pacientes';

  const handleTabChange = (tab: TabType) => {
    if (tab === 'pacientes') {
      router.push('/painel/pacientes');
    } else if (tab === 'agendamentos') {
      router.push('/painel/agendamentos');
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
