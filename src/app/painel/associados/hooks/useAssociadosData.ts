import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Associado } from '../types/associados-types';

const supabaseClient = createClient();

interface PageData {
  items: Associado[];
  nextPage: number | undefined;
  totalCount: number;
}

interface UseAssociadosDataOptions {
  pageSize?: number;
  searchQuery?: string;
  situacao?: string;
  orderBy?: { column: string; ascending: boolean };
}

export function useAssociadosData(options?: UseAssociadosDataOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [situacaoFilter, setSituacaoFilter] = useState<string | undefined>(options?.situacao);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery<PageData, Error>({
    queryKey: ['associados', searchQuery, situacaoFilter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const startRow = (pageParam as number) * 100;
      const endRow = startRow + 100 - 1;

      // Consulta principal para obter associados
      let query = supabaseClient
        .from('associados')
        .select('*', { count: 'exact' })
        .range(startRow, endRow)
        .order('nome_completo', { ascending: true });

      // Aplicar filtro de pesquisa se houver
      if (searchQuery) {
        const term = `%${searchQuery}%`;
        query = query.or(`nome_completo.ilike.${term},cpf.ilike.${term},matricula.ilike.${term},email.ilike.${term}`);
      }

      // Aplicar filtro de situação se houver
      if (situacaoFilter) {
        if (situacaoFilter === 'inadimplente') {
          query = query.eq('inadimplente', true);
        } else if (['ativo', 'inativo', 'pendente'].includes(situacaoFilter)) {
          query = query.eq('situacao', situacaoFilter);
        }
      }

      const { data: associados, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Para cada associado, buscar seus agendamentos (se necessário)
      // Neste exemplo, vamos apenas retornar os associados sem buscar agendamentos
      // caso seja necessário, você pode implementar a busca similar ao useClientesData
      
      return {
        items: associados,
        nextPage: associados.length === 100 ? (pageParam as number) + 1 : undefined,
        totalCount: count || 0
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage
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

  const handleSituacaoFilterChange = (value: string | undefined) => {
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
    setSituacaoFilter: handleSituacaoFilterChange,
    totalCount: data?.pages[0]?.totalCount || 0,
    refetch
  };
}
