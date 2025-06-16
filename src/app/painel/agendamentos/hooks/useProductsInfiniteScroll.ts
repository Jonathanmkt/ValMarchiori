import { useInfiniteQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Lead } from '../types/produtos-types';

const supabaseClient = createClient();

interface PageData {
  items: Lead[];
  nextPage: number | undefined;
  totalCount: number;
}

interface UseInfiniteScrollOptions {
  pageSize?: number;
  searchQuery?: string;
  typeFilter?: string;
  orderBy?: { column: string; ascending: boolean };
}

export function useProductsInfiniteScroll(
  queryKey: string[],
  options: UseInfiniteScrollOptions = {}
) {
  const {
    pageSize = 100,
    searchQuery = '',
    typeFilter = 'todos',
    orderBy = { column: 'created_at', ascending: false }
  } = options;

  return useInfiniteQuery<PageData, Error>({
    queryKey: [...queryKey, searchQuery, typeFilter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const startRow = (pageParam as number) * pageSize;
      const endRow = startRow + pageSize - 1;

      let query = supabaseClient
        .from('leads')
        .select('*', { count: 'exact' })
        .range(startRow, endRow)
        .order(orderBy.column, { ascending: orderBy.ascending });

      // Aplicar filtro de pesquisa se houver
      if (searchQuery) {
        const term = `%${searchQuery}%`;
        query = query.or(`nome_completo.ilike.${term},email.ilike.${term},chat_id.ilike.${term}`);
      }

      // Aplicar filtro por status
      if (typeFilter !== 'todos') {
        query = query.eq('status', typeFilter);
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
