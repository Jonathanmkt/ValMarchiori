import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, User, Phone, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssociadoTableRowDetails } from './AssociadoTableRowDetails';
import { Associado } from '../types/associados-types';


interface AssociadoRowProps {
  item: Associado;
  isExpanded: boolean;
  onExpand: () => void;
}

export function AssociadoRow({ 
  item, 
  isExpanded, 
  onExpand,
}: AssociadoRowProps) {
  return (
    <div className="overflow-hidden mx-0 py-0">
      <motion.div 
        className={`relative flex w-[calc(100%-12px)] cursor-pointer mx-1.5 bg-transparent ${isExpanded ? 'rounded-t-lg mb-0 border-x-2 border-t-2 border-primary' : 'rounded-lg mb-0.5 border-2 border-primary hover:bg-white/40'}` }
        onClick={onExpand}
        layout
        initial={{ borderRadius: "8px" }}
        animate={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottomLeftRadius: isExpanded ? "0px" : "8px",
          borderBottomRightRadius: isExpanded ? "0px" : "8px"
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {/* Nome do Associado */}
        <div className='md:w-[35%] w-full py-3 px-4 flex items-center gap-3'>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-gray-100 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>

          <Avatar className="h-10 w-10 flex-shrink-0">
            {item.foto ? (
              <AvatarImage src={item.foto} alt={item.nome_completo} />
            ) : (
              <AvatarFallback className="bg-primary text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-medium">{item.nome_completo}</span>
          </div>
        </div>
        
        {/* Matrícula */}
        <div className='md:w-[10%] hidden md:flex items-center py-3 px-4'>
          <div className="flex items-center gap-1">
            <span className="text-sm">{item.matricula}</span>
          </div>
        </div>

        {/* DRT */}
        <div className='md:w-[10%] hidden md:flex items-center py-3 px-4'>
          <div className="flex items-center gap-1">
            <span className="text-sm">{item.drt || '-'}</span>
          </div>
        </div>

        {/* Telefone */}
        <div className='md:w-[25%] hidden md:flex items-center py-3 px-4'>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{item.telefone || 'Não informado'}</span>
          </div>
        </div>
        
        {/* Mensalidades */}
        <div className='md:w-[20%] hidden md:flex items-center py-3 px-4'>
          {item.inadimplente ? (
            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
              Inadimplente
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Em dia
            </span>
          )}
        </div>
        
        {/* Ações */}
        <div className='hidden md:flex md:w-[10%] py-3 px-4 items-center justify-center'>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => {
                // Ação do menu
              }}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            style={{ overflow: 'hidden', transformOrigin: 'top' }}
          >
            <AssociadoTableRowDetails associado={item} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
