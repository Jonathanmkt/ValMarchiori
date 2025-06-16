import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ProductsActionsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  itemTypeFilter?: string;
  onItemTypeFilterChange?: (value: string) => void;
}

export function ProductsActionsHeader({ searchQuery, onSearchChange, itemTypeFilter = 'todos', onItemTypeFilterChange }: ProductsActionsHeaderProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return (
    <div className='py-2 flex items-center gap-2'>
        <div className='flex items-center md:gap-3 gap-2'>
          {/* Grupo da esquerda: busca e filtros */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 w-4 h-4' />
            <Input
              type="search"
              placeholder={isDesktop ? 'Buscar por nome, email ou telefone...' : 'Buscar...'}
              className='pl-9 h-10 md:w-[250px] w-[160px] rounded-md border border-input bg-background hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 border-input hover:border-primary hover:text-primary focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('todos')}
                className={itemTypeFilter === 'todos' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/10 hover:text-primary'}
              >
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('novo')}
                className={itemTypeFilter === 'novo' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/10 hover:text-primary'}
              >
                Novo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('agendado')}
                className={itemTypeFilter === 'agendado' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/10 hover:text-primary'}
              >
                Agendado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onItemTypeFilterChange?.('comunicado')}
                className={itemTypeFilter === 'comunicado' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/10 hover:text-primary'}
              >
                Comunicado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
        </div>
    </div>
  );
}
