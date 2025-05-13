'use client'

import React from 'react';
import Link from 'next/link';
import { useNavigation } from '@/hooks/useNavigation/useNavigation';
import { Users, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

export function MobileNavBar() {
  const { pathname } = useNavigation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary h-16 flex items-center justify-center gap-16 md:hidden">
      <Link
        href="/painel/page1"
        className={cn(
          'flex flex-col items-center justify-center gap-1 text-white/70 hover:text-white/90',
          pathname.includes('/painel/page1') && 'text-white'
        )}
      >
        <Users size={24} />
        <span className="text-xs">Leads</span>
      </Link>

      <Link
        href="/painel/page2"
        className={cn(
          'flex flex-col items-center justify-center gap-1 text-white/70 hover:text-white/90',
          pathname.includes('/painel/page2') && 'text-white'
        )}
      >
        <CalendarDays size={24} />
        <span className="text-xs">Agenda</span>
      </Link>
    </nav>
  );
}
