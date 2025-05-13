'use client'

import React from 'react';
import { Toast } from '@/components/ui/toast';
import { Sidebar } from './Sidebar';
import { TopBar } from './Topbar';
import { SidebarProvider } from './SidebarContext';
import { CalendarDays, Users } from 'lucide-react';
import { MobileNavBar } from './MobileNavBar';

interface PainelLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  {
    title: 'Leads',
    href: '/painel/page1',
    icon: Users
  },
  {
    title: 'Agendamentos',
    href: '/painel/page2',
    icon: CalendarDays
  }
];

export default function PainelLayout({ children }: PainelLayoutProps) {
  return (
    <SidebarProvider>
      <>
        {/* Desktop Layout */}
        <div className='min-h-screen bg-secondary flex md:flex hidden'>
          <Sidebar links={sidebarLinks} />

          {/* Main Content */}
          <div className='flex-1 flex flex-col'>
            <TopBar />

            {/* Page Content */}
            <div className="flex-1 w-full">
              {children}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='min-h-screen bg-secondary flex flex-col md:hidden'>
          <div className='flex-1 w-full pb-16'>
            {children}
          </div>
          <MobileNavBar />
        </div>

        <Toast />
      </>
    </SidebarProvider>
  );
}
