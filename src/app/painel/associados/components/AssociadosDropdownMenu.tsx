import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { MoreVertical, Edit, Trash, Eye, FileText, Phone } from 'lucide-react';
import { Associado } from '../types/associados-types';

interface AssociadosDropdownMenuProps {
  item: Associado;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onContact?: () => void;
  onViewDocuments?: () => void;
  children?: React.ReactNode;
  mode?: 'dropdown' | 'context';
}

export function AssociadosDropdownMenu({ 
  item,
  onEdit, 
  onDelete, 
  onView, 
  onContact,
  onViewDocuments,
  children, 
  mode = 'dropdown' 
}: AssociadosDropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    if (action) action();
  };

  if (mode === 'context') {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleAction(onView || (() => {/* TODO: Implementar visualização */}))}>
            Visualizar
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAction(onEdit || (() => {/* TODO: Implementar edição */}))}>
            Editar
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAction(onViewDocuments || (() => {/* TODO: Implementar visualização de documentos */}))}>
            Documentos
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAction(onContact || (() => {/* TODO: Implementar contato */}))}>
            Contatar
          </ContextMenuItem>
          <ContextMenuItem 
            className="text-red-600 focus:text-red-600" 
            onClick={() => handleAction(onDelete || (() => {/* TODO: Implementar exclusão */}))}
          >
            Excluir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 flex items-center justify-center p-0 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleAction(onView || (() => {/* TODO: Implementar visualização */}))}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Visualizar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onEdit || (() => {/* TODO: Implementar edição */}))}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onViewDocuments || (() => {/* TODO: Implementar visualização de documentos */}))}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Documentos</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onContact || (() => {/* TODO: Implementar contato */}))}>
          <Phone className="mr-2 h-4 w-4" />
          <span>Contatar</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => handleAction(onDelete || (() => {/* TODO: Implementar exclusão */}))}
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
