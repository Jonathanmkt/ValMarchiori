import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClienteTableRowDetails } from './ClienteTableRowDetails';
import { Cliente } from '../types/clientes-types';

interface ProductsTableRowProps {
  item: Cliente;
  isExpanded: boolean;
  onExpand: () => void;
}

export function ProductsTableRow({ 
  item, 
  isExpanded, 
  onExpand,
}: ProductsTableRowProps) {
  return (
    <div className="overflow-hidden mx-0 py-0">
      <motion.div 
        className={`relative flex w-[calc(100%-12px)] cursor-pointer mx-1.5 ${isExpanded ? 'bg-[var(--secondary-50)] rounded-t-lg mb-0 border-x border-t border-[#162D404D]' : 'rounded-lg mb-0.5 border border-[#162D404D]'} hover:bg-[var(--secondary-50)]` }
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

        <div className='md:w-[35%] w-full py-3 px-4 items-center gap-3 flex'>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.div>
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src="" alt={item.nome_completo} />
            <AvatarFallback>
              <User className="w-5 h-5 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{item.nome_completo}</span>
        </div>
        <div className='w-[20%] py-3 px-4 items-center md:block hidden'>
          <div className="text-sm font-medium">{item.email}</div>
        </div>
        <div className='w-[20%] py-3 px-4 items-center md:block hidden'>
          <div className="text-sm font-medium">{item.cliente_id ? item.cliente_id.replace(/^55/, '') : 'Não informado'}</div>
        </div>
        <div className='w-[15%] py-3 px-4 items-center md:block hidden'>
          <div className="text-sm font-medium">Cliente</div>
        </div>
        <div className='w-[10%] py-3 px-4 justify-center md:block hidden'>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-green-100 text-green-600"
              onClick={() => {
                const phoneNumber = item.cliente_id ? item.cliente_id.replace(/\D/g, '') : '';
                if (phoneNumber) {
                  window.open(`https://wa.me/${phoneNumber}`, '_blank');
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
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
            <ClienteTableRowDetails lead={item} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
