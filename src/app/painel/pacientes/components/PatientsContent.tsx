import { useState, useCallback } from 'react';
import { ProductsActionsHeader } from './ProductsActionsHeader';
import { ProductsTable } from './ProductsTable';
import { ProductsTableHeader } from './ProductsTableHeader';
import { useClientesData } from '../hooks/useClientesData';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NovoClienteModal } from './NovoClienteModal';

export function PatientsContent() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isNovoClienteModalOpen, setIsNovoClienteModalOpen] = useState(false);
  
  const {
    items: clientes,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    totalCount
  } = useClientesData();

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);
  
  const handleOpenNovoClienteModal = useCallback(() => {
    setIsNovoClienteModalOpen(true);
  }, []);

  const handleCloseNovoClienteModal = useCallback(() => {
    setIsNovoClienteModalOpen(false);
  }, []);

  const handleExpandItem = useCallback((id: string) => {
    setExpandedItem(prev => prev === id ? null : id);
  }, []);

  return (
    <>
      <div className='h-full flex flex-col overflow-hidden'>
        <div className='h-full flex flex-col bg-gray-200 rounded-lg shadow'>
          {/* Header com filtros e contador - fixo no topo */}
          <div className='shrink-0 p-6 pb-0'>
            <div className='flex justify-between items-center'>
              <ProductsActionsHeader 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
              <Button 
                onClick={handleOpenNovoClienteModal}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Novo Cliente
              </Button>
            </div>
          </div>

          {/* Cabeçalho da tabela - fixo abaixo dos filtros */}
          <div className='p-6 pt-3 pb-0'>
            <ProductsTableHeader />
          </div>

          {/* Tabela com scroll infinito */}
          <ProductsTable 
            items={clientes}
            expandedItem={expandedItem}
            onItemExpand={handleExpandItem}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            className='p-6 pt-0'
          />

          {/* Rodapé - deve ter shrink-0 para não ser comprimido */}
          <div className='shrink-0 pt-4 border-t border-gray-200 mt-4'>
            <div className='flex justify-end items-center text-sm text-gray-500 px-6 pb-4'>
              {isFetchingNextPage && (
                <span>Carregando mais itens...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar novo cliente */}
      <NovoClienteModal 
        isOpen={isNovoClienteModalOpen} 
        onClose={handleCloseNovoClienteModal} 
      />
    </>
  );
}
