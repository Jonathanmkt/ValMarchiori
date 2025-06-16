import { useState, useCallback } from 'react';
import { ServicosActionsHeader } from './ServicosActionsHeader';
import { ServicosTable } from './ServicosTable';
import { ServicosTableHeader } from './ServicosTableHeader';
import { useServicosData } from '../hooks/useServicosData';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NovoServicoModal } from '../modals/NovoServicoModal';

export function ServicosContent() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isNovoServicoModalOpen, setIsNovoServicoModalOpen] = useState(false);
  
  const { 
    items: servicos, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    itemTypeFilter,
    setItemTypeFilter
  } = useServicosData();

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);
  
  const handleOpenNovoServicoModal = useCallback(() => {
    setIsNovoServicoModalOpen(true);
  }, []);

  const handleCloseNovoServicoModal = useCallback(() => {
    setIsNovoServicoModalOpen(false);
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
              <ServicosActionsHeader 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                itemTypeFilter={itemTypeFilter}
                onItemTypeFilterChange={setItemTypeFilter}
              />
              <Button 
                onClick={handleOpenNovoServicoModal}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Novo Serviço
              </Button>
            </div>
          </div>

          {/* Cabeçalho da tabela - fixo abaixo dos filtros */}
          <div className='p-6 pt-3 pb-0'>
            <ServicosTableHeader />
          </div>

          {/* Tabela com scroll infinito */}
          <ServicosTable 
            items={servicos}
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

      {/* Modal para adicionar novo serviço */}
      <NovoServicoModal 
        isOpen={isNovoServicoModalOpen} 
        onClose={handleCloseNovoServicoModal} 
      />
    </>
  );
}
