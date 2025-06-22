import { useState } from 'react';
import { useAssociadosInfiniteScroll } from './useAssociadosInfiniteScroll';

export function useAssociadosTableData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [situacaoFilter, setSituacaoFilter] = useState('todos');

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useAssociadosInfiniteScroll(['associados'], {
    pageSize: 100,
    searchQuery,
    situacaoFilter,
    orderBy: { column: 'nome_completo', ascending: true }
  });

  const allItems = data?.pages.flatMap(page => page.items) || [];
  
  // Filtra associados com IDs duplicados - mantendo apenas a primeira ocorrência de cada ID
  const uniqueItems = allItems
    .filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
    .sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    refetch();
  };

  const handleFilterChange = (value: string) => {
    setSituacaoFilter(value);
    refetch();
  };

  return {
    items: uniqueItems,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery: handleSearchChange,
    situacaoFilter,
    setSituacaoFilter: handleFilterChange,
    totalCount: data?.pages[0]?.totalCount || 0,
    refetch
  };
}
