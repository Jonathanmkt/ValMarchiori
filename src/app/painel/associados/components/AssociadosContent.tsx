import { useState, useCallback } from 'react';
import { AssociadosActionsHeader } from './AssociadosActionsHeader';
import { AssociadosTable } from './AssociadosTable';
import { AssociadosTableHeader } from './AssociadosTableHeader';
import { useAssociadosData } from '../hooks/useAssociadosData';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NovoAssociadoModal } from './NovoAssociadoModal';

export function AssociadosContent() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isNovoAssociadoModalOpen, setIsNovoAssociadoModalOpen] = useState(false);
  
  const {
    items: associados,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    totalCount
  } = useAssociadosData();

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);
  
  const handleOpenNovoAssociadoModal = useCallback(() => {
    setIsNovoAssociadoModalOpen(true);
  }, []);

  const handleCloseNovoAssociadoModal = useCallback(() => {
    setIsNovoAssociadoModalOpen(false);
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
              <AssociadosActionsHeader 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
              <Button 
                onClick={handleOpenNovoAssociadoModal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Novo Associado
              </Button>
            </div>
          </div>

          {/* Cabeçalho da tabela - fixo abaixo dos filtros */}
          <div className='p-6 pt-3 pb-0'>
            <AssociadosTableHeader />
          </div>

          {/* Tabela com scroll infinito */}
          <AssociadosTable 
            items={associados}
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

      {/* Modal para adicionar novo associado */}
      <NovoAssociadoModal 
        isOpen={isNovoAssociadoModalOpen} 
        onClose={handleCloseNovoAssociadoModal} 
      />
    </>
  );
}
