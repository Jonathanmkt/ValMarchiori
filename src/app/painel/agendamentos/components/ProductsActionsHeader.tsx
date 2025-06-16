import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface ProductsActionsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  itemTypeFilter?: string;
  onItemTypeFilterChange?: (value: string) => void;
}

export function ProductsActionsHeader({ searchQuery, onSearchChange, itemTypeFilter = 'todos', onItemTypeFilterChange }: ProductsActionsHeaderProps) {
  return (
    <div className='py-4 flex items-center'>
        <div className='flex items-center gap-3'>
          {/* Grupo da esquerda: busca e filtros */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 w-4 h-4' />
            <Input
              type="search"
              placeholder='Buscar por nome, email ou telefone...'
              className='pl-9 h-10 w-[250px] rounded-md border border-input bg-background'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('todos')}
                className={itemTypeFilter === 'todos' ? 'bg-accent font-medium' : ''}
              >
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('novo')}
                className={itemTypeFilter === 'novo' ? 'bg-accent font-medium' : ''}
              >
                Novo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('agendado')}
                className={itemTypeFilter === 'agendado' ? 'bg-accent font-medium' : ''}
              >
                Agendado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('comunicado')}
                className={itemTypeFilter === 'comunicado' ? 'bg-accent font-medium' : ''}
              >
                Comunicado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
        </div>
    </div>
  );
}
