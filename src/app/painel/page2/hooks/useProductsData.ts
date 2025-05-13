import { useState } from 'react';
import { useProductsInfiniteScroll } from './useProductsInfiniteScroll';
import { Lead } from '../types/produtos-types';

export function useProductsData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('todos');

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useProductsInfiniteScroll(['leads'], {
    pageSize: 100,
    searchQuery,
    typeFilter: itemTypeFilter,
    orderBy: { column: 'created_at', ascending: false }
  });

  const allItems = data?.pages.flatMap(page => page.items) || [];
  
  // Filtra leads com IDs duplicados - mantendo apenas a primeira ocorrência de cada ID
  const uniqueItems = allItems.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id)
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    refetch();
  };

  const handleFilterChange = (value: string) => {
    setItemTypeFilter(value);
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
    itemTypeFilter,
    setItemTypeFilter: handleFilterChange,
    totalCount: data?.pages[0]?.totalCount || 0
  };
}
