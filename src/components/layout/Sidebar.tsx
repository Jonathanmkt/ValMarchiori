'use client'

import React from 'react';
import { motion as m } from 'framer-motion';
const motion = m;
import Link from 'next/link';
import { cn } from '@/lib/utils/utils';
import { useSidebar } from './SidebarContext';
import { useNavigation } from '@/hooks/useNavigation/useNavigation';
import { LucideIcon, CalendarDays } from 'lucide-react';

interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  links: SidebarLink[];
}

export function Sidebar({ links }: SidebarProps) {
  const { collapsed, animationStage, handleMouseEnter, handleMouseLeave } = useSidebar();
  const { pathname } = useNavigation();



  return (
    <motion.div
      className="bg-primary flex flex-col relative"
      {...(collapsed ? 
        // Fechamento em duas etapas com velocidades diferentes
        {
          initial: { width: 280 },
          animate: { width: animationStage === 1 ? 81 : 80 },
          transition: {
            duration: animationStage === 1 ? 0.22 : 0.5, // Primeira etapa 20% menos rápida
            ease: "linear"
          }
        } : {
          initial: { width: 80 },
          animate: { width: 280 },
          transition: {
            type: 'spring',
            stiffness: 120,
            damping: 18
          }
        }
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo e título - Altura fixa */}
      <div className='h-24 px-3 pt-3'>
        <div className='flex items-start gap-4 pt-0'>
          <motion.div 
            className="relative ml-[6px]"
            {...(collapsed ? 
              {
                initial: { width: 80 },
                animate: { width: animationStage === 1 ? 56 : 52 },
                transition: {
                  duration: animationStage === 1 ? 0.22 : 0.5,
                  ease: "linear"
                }
              } : {
                initial: { width: 52 },
                animate: { width: 80 },
                transition: {
                  type: 'spring',
                  stiffness: 120,
                  damping: 18
                }
              }
            )}
          >
            <motion.div 
              className="absolute left-0 top-0 w-[80px] h-[80px]"
              style={{ transformOrigin: '0% 0%' }}
              {...(collapsed ? 
                {
                  initial: { scale: 1, x: 0 },
                  animate: { 
                    scale: animationStage === 1 ? 0.75 : 0.65, 
                    x: animationStage === 1 ? -5 : -8 
                  },
                  transition: {
                    duration: animationStage === 1 ? 0.22 : 0.5,
                    ease: "linear"
                  }
                } : {
                  initial: { scale: 0.65, x: -8 },
                  animate: { scale: 1, x: 0 },
                  transition: {
                    type: 'spring',
                    stiffness: 120,
                    damping: 18
                  }
                }
              )}
            >
              <div className="flex items-center justify-center w-[80px] h-[80px] bg-gray-400 rounded-full">
                <CalendarDays size={60} className="text-primary" />
              </div>
            </motion.div>
          </motion.div>
          <motion.div 
            className="overflow-hidden mt-4"
            {...(collapsed ? 
              {
                initial: { width: 180 },
                animate: { width: animationStage === 1 ? 0 : 0 },
                transition: {
                  duration: animationStage === 1 ? 0.22 : 0.5,
                  ease: "linear"
                }
              } : {
                initial: { width: 0 },
                animate: { width: 180 },
                transition: {
                  type: 'spring',
                  stiffness: 120,
                  damping: 18
                }
              }
            )}
          >
            <div className="w-[180px] flex flex-col whitespace-nowrap">
              <h1 className='text-2xl font-semibold text-gray-400 leading-none font-playfair'>
                Agendamentos
              </h1>
              <span className='text-sm text-white/60'>Organização e tecnologia</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-3 pt-10 pb-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              'flex items-center rounded-lg mb-1 relative h-10',
              'p-2',
              'text-white/70 hover:text-white/90 hover:bg-white/10',
              pathname.includes(link.href) && 'text-white bg-white/20 hover:bg-white/25'
            )}
            style={{ width: collapsed ? 48 : 256, paddingRight: collapsed ? 8 : 16 }}
          >
            {/* Container fixo para o ícone sempre na mesma posição */}
            <div className="w-6 h-6 flex items-center justify-center ml-1">
              <link.icon size={24} />
            </div>
            
            {/* Container para o texto com efeito de máscara */}
            <motion.div 
              className="overflow-hidden"
              {...(collapsed ? 
                {
                  initial: { width: 180 },
                  animate: { width: animationStage === 1 ? 90 : 0 },
                  transition: {
                    duration: animationStage === 1 ? 0.22 : 0.5,
                    ease: "linear"
                  }
                } : {
                  initial: { width: 0 },
                  animate: { width: 180 },
                  transition: {
                    type: 'spring',
                    stiffness: 120,
                    damping: 18
                  }
                }
              )}
            >
              <motion.div 
                className="w-[180px] whitespace-nowrap ml-4 flex items-center"
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {link.title}
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}
