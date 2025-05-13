import { useState, useCallback } from 'react';
import { ProductsActionsHeader } from './ProductsActionsHeader';
import { ProductsTable } from './ProductsTable';
import { useProductsData } from '../hooks/useProductsData';

export function ProductsContent() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const {
    items: leads,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    itemTypeFilter,
    setItemTypeFilter,
    totalCount
  } = useProductsData();

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);

  const handleItemExpand = useCallback((id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  }, [expandedItem]);

  const handleEditItem = useCallback(() => {
    // TODO: Implementar edição
  }, []);

  const handleDeleteItem = useCallback(() => {
    // TODO: Implementar exclusão
  }, []);

  const handleViewItem = useCallback(() => {
    // TODO: Implementar visualização
  }, []);

  return (
    <div className='h-full md:p-6 p-2 bg-white rounded-lg shadow flex flex-col overflow-hidden'>


        {/* Header com filtros - deve ter flexbox definido como shrink-0 para não ser comprimido */}
        <div className="shrink-0 md:px-4 px-2">
          <ProductsActionsHeader 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            itemTypeFilter={itemTypeFilter}
            onItemTypeFilterChange={setItemTypeFilter}
          />
        </div>

        {/* Linha divisória entre filtros e tabela */}
        <div className="shrink-0 border-b border-gray-200 md:mx-4 mx-2 md:my-4 my-2"></div>

        {/* Tabela de produtos - deve ter flex-1 e min-h-0 para permitir scroll */}
        <div className="flex-1 min-h-0 overflow-hidden md:mt-4 mt-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Carregando leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Nenhum lead encontrado</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="md:px-4 px-2 md:py-2 py-1 text-sm text-gray-600">
                Total de leads: {totalCount}
              </div>
            <ProductsTable 
              items={leads}
              expandedItem={expandedItem}
              onItemExpand={handleItemExpand}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onViewItem={handleViewItem}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
            </div>
          )}
        </div>
    </div>
  );
}
