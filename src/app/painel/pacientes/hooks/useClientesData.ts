import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Cliente } from '../types/clientes-types';

const supabaseClient = createClient();

interface PageData {
  items: Cliente[];
  nextPage: number | undefined;
  totalCount: number;
}

interface UseClientesDataOptions {
  pageSize?: number;
  searchQuery?: string;
  orderBy?: { column: string; ascending: boolean };
}

export function useClientesData() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery<PageData, Error>({
    queryKey: ['clientes', searchQuery],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const startRow = (pageParam as number) * 100;
      const endRow = startRow + 100 - 1;

      // Consulta principal para obter clientes
      let query = supabaseClient
        .from('clientes')
        .select('*', { count: 'exact' })
        .range(startRow, endRow)
        .order('nome_completo', { ascending: true });

      // Aplicar filtro de pesquisa se houver
      if (searchQuery) {
        const term = `%${searchQuery}%`;
        query = query.or(`nome_completo.ilike.${term},cliente_id.ilike.${term},email.ilike.${term}`);
      }

      const { data: clientes, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Para cada cliente, buscar seus agendamentos
      const clientesComAgendamentos = await Promise.all(
        clientes.map(async (cliente) => {
          const { data: agendamentos } = await supabaseClient
            .from('agendamentos')
            .select('data_agendamento, hora_agendamento')
            .eq('cliente', cliente.cliente_uuid)
            .order('data_agendamento', { ascending: true });

          return {
            ...cliente,
            agendamentos: agendamentos || []
          };
        })
      );

      return {
        items: clientesComAgendamentos,
        nextPage: clientes.length === 100 ? (pageParam as number) + 1 : undefined,
        totalCount: count || 0
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const allItems = data?.pages.flatMap(page => page.items) || [];
  
  // Filtra clientes com IDs duplicados - mantendo apenas a primeira ocorrência de cada ID
  const uniqueItems = allItems
    .filter((item, index, self) => index === self.findIndex(t => t.cliente_uuid === item.cliente_uuid))
    .sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));

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
    totalCount: data?.pages[0]?.totalCount || 0
  };
}
