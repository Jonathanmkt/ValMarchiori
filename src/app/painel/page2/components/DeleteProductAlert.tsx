import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Product } from '../hooks/useProductsData';

interface DeleteProductAlertProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function DeleteProductAlert({ isOpen, onClose, product }: DeleteProductAlertProps) {
  // Como não temos o hook useDeleteProduct ainda, vamos criar uma função temporária
  const handleDelete = async (id: string) => {
    // Implementação temporária
    console.log('Excluindo produto:', id);
    // Aqui virá a implementação real com a action de deletar produto
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o produto <span className="font-semibold text-foreground">{product.nome}</span>?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onClose();
              handleDelete(product.id);
            }}
            type="button"
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
