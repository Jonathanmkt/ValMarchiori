import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Servico } from '../types/servicos-types';

const supabaseClient = createClient();

interface PageData {
  items: Servico[];
  nextPage: number | undefined;
  totalCount: number;
}

// Interface para uso futuro em implementações mais avançadas
// Removida temporariamente para evitar erros de lint

export function useServicosData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState<string>('todos');

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery<PageData, Error>({
    queryKey: ['servicos', searchQuery, itemTypeFilter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const startRow = (pageParam as number) * 100;
      const endRow = startRow + 100 - 1;

      // Consulta principal para obter serviços
      let query = supabaseClient
        .from('servicos')
        .select('*', { count: 'exact' })
        .range(startRow, endRow)
        .order('nome_servico', { ascending: true });

      // Aplicar filtro de pesquisa se houver
      if (searchQuery) {
        const term = `%${searchQuery}%`;
        query = query.or(`nome_servico.ilike.${term},servico_code.ilike.${term},descricao.ilike.${term}`);
      }
      
      // Aplicar filtro por tipo de serviço
      if (itemTypeFilter !== 'todos') {
        switch (itemTypeFilter) {
          case 'disponivel':
            query = query.eq('disponivel', true);
            break;
          case 'indisponivel':
            query = query.eq('disponivel', false);
            break;
          case 'delivery':
            query = query.eq('disponivel_delivery', true);
            break;
        }
      }

      const { data: servicos, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        items: servicos || [],
        nextPage: servicos.length === 100 ? (pageParam as number) + 1 : undefined,
        totalCount: count || 0
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const allItems = data?.pages.flatMap(page => page.items) || [];
  
  // Filtra serviços com IDs duplicados - mantendo apenas a primeira ocorrência de cada ID
  const uniqueItems = allItems
    .filter((item, index, self) => index === self.findIndex(t => t.servico_id === item.servico_id))
    .sort((a, b) => a.nome_servico.localeCompare(b.nome_servico));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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
    setItemTypeFilter,
    totalCount: data?.pages[0]?.totalCount || 0
  };
}
