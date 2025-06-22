import { useInfiniteQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Associado } from '../types/associados-types';

const supabaseClient = createClient();

interface PageData {
  items: Associado[];
  nextPage: number | undefined;
  totalCount: number;
}

interface UseInfiniteScrollOptions {
  pageSize?: number;
  searchQuery?: string;
  situacaoFilter?: string;
  orderBy?: { column: string; ascending: boolean };
}

export function useAssociadosInfiniteScroll(
  queryKey: string[],
  options: UseInfiniteScrollOptions = {}
) {
  const {
    pageSize = 100,
    searchQuery = '',
    situacaoFilter = 'todos',
    orderBy = { column: 'nome_completo', ascending: true }
  } = options;

  return useInfiniteQuery<PageData, Error>({
    queryKey: [...queryKey, searchQuery, situacaoFilter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const startRow = (pageParam as number) * pageSize;
      const endRow = startRow + pageSize - 1;

      let query = supabaseClient
        .from('associados')
        .select('*', { count: 'exact' })
        .range(startRow, endRow)
        .order(orderBy.column, { ascending: orderBy.ascending });

      // Aplicar filtro de pesquisa se houver
      if (searchQuery) {
        const term = `%${searchQuery}%`;
        query = query.or(`nome_completo.ilike.${term},cpf.ilike.${term},matricula.ilike.${term},email.ilike.${term}`);
      }

      // Aplicar filtro por situação
      if (situacaoFilter !== 'todos') {
        if (situacaoFilter === 'inadimplente') {
          query = query.eq('inadimplente', true);
        } else if (['ativo', 'inativo', 'pendente'].includes(situacaoFilter)) {
          query = query.eq('situacao', situacaoFilter);
        }
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        items: data || [],
        nextPage: data && data.length === pageSize ? (pageParam as number) + 1 : undefined,
        totalCount: count || 0
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 5, // 5 minutos
  });
}
