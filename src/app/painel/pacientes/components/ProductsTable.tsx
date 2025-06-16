import { PatientRow } from './PatientRow';
import { Cliente } from '../types/clientes-types';

interface ProductsTableProps {
  items: Cliente[];
  expandedItem?: string | null;
  onItemExpand?: (id: string) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  className?: string;
}

export function ProductsTable({ 
  items,
  expandedItem,
  onItemExpand,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  className = ''
}: ProductsTableProps) {
  // Adiciona o manipulador de scroll para paginação infinita
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage();
      }
    }
  };
  
  return (
    <div 
      className={`overflow-y-auto flex-1 px-0 py-0 min-h-[200px] ${className}
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-200 
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-gray-300`}
      onScroll={handleScroll}
    >
      {items.map((cliente) => (
        <PatientRow 
          key={cliente.cliente_uuid} 
          item={cliente}
          isExpanded={expandedItem === cliente.cliente_uuid}
          onExpand={() => onItemExpand?.(cliente.cliente_uuid)}
        />
      ))}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <span className="text-sm text-gray-500">Carregando mais...</span>
        </div>
      )}
    </div>
  );
}
