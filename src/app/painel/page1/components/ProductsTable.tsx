import { ProductsTableHeader } from './ProductsTableHeader';
import { ProductsTableRow } from './ProductsTableRow';
import { Lead } from '../types/produtos-types';

interface ProductsTableProps {
  items: Lead[];
  expandedItem?: string | null;
  onItemExpand?: (id: string) => void;
  onEditItem?: (lead: Lead) => void;
  onDeleteItem?: (lead: Lead) => void;
  onViewItem?: (lead: Lead) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function ProductsTable({ 
  items,
  expandedItem,
  onItemExpand,
  onEditItem,
  onDeleteItem,
  onViewItem,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: ProductsTableProps) {
  // Adiciona o manipulador de scroll para paginacu00e7u00e3o infinita
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage();
      }
    }
  };
  return (
    <div className='relative h-full flex flex-col'>
      <ProductsTableHeader />

      <div
        className='overflow-y-auto flex-1 px-0 py-0 min-h-[200px]
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-200 
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-gray-300'
        onScroll={handleScroll}
      >
            {items.map((lead) => (
              <ProductsTableRow 
                key={lead.id} 
                item={lead}
                isExpanded={expandedItem === lead.id}
                onExpand={() => onItemExpand?.(lead.id)}
                onEdit={() => onEditItem?.(lead)}
                onDelete={() => onDeleteItem?.(lead)}
                onView={() => onViewItem?.(lead)}
              />
            ))}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <span className="text-sm text-gray-500">Carregando mais...</span>
              </div>
            )}
      </div>
    </div>
  );
}
