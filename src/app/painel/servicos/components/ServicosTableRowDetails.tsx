import { Product } from '../types/produtos-types';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { StatusBadge } from '@/components/ui/status-badge';

interface ProductsTableRowDetailsProps {
  product: Product;
}

export function ProductsTableRowDetails({ product }: ProductsTableRowDetailsProps) {
  const hasMultipleImages = Array.isArray(product.imagens) && product.imagens.length > 1;

  return (
    <div className="flex w-[calc(100%-12px)] py-6 px-6 mx-1.5 mb-0.5 bg-[var(--secondary-50)] rounded-b-lg border-x border-b border-[#162D404D]">

      <div className="flex w-full">
        {/* Coluna 1: Carrossel (alinhado com Avatar - w-10 + gap-3) */}
        <div className="w-[35%] px-4 flex items-start gap-3">
          <div className="w-8" />
          <div className="w-[150px]">
            {/* Carrossel de Imagens */}
          <Carousel className="w-[150px] mx-auto">
            <CarouselContent>
              {Array.isArray(product.imagens) && product.imagens.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square rounded-lg overflow-hidden border border-white/20 shadow-sm">
                    <img 
                      src={url} 
                      alt={`${product.nome} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hasMultipleImages && (
              <>
                <CarouselPrevious className="-left-8 h-8 w-8" />
                <CarouselNext className="-right-8 h-8 w-8" />
              </>
            )}
          </Carousel>
          </div>
        </div>

        {/* Descrição (alinhada com Preço de Custo - 20%) */}
        <div className="w-[20%] px-4">
          <h4 className="text-sm font-medium mb-3">Descrição do Produto</h4>
          <p className="text-sm text-gray-600">{product.descricao || 'Sem descrição disponível'}</p>
        </div>

        {/* Coluna 1: Tags, Materiais e Fretes (alinhada com Preço de Custo - 20%) */}
        <div className="w-[20%] px-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <p className="text-sm text-gray-600">{Array.isArray(product.tags) ? product.tags.join(', ') : '-'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Materiais</h4>
              <p className="text-sm text-gray-600">{Array.isArray(product.materiais) ? product.materiais.join(', ') : '-'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Fretes</h4>
              <p className="text-sm text-gray-600">{Array.isArray(product.fretes) ? product.fretes.join(', ') : '-'}</p>
            </div>
          </div>
        </div>

        {/* Coluna 2: Ocasiões, Público Alvo e Categoria (alinhada com Preço de Venda - 20%) */}
        <div className="w-[20%] px-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Ocasiões</h4>
              <p className="text-sm text-gray-600">{Array.isArray(product.ocasioes) ? product.ocasioes.join(', ') : '-'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Público Alvo</h4>
              <p className="text-sm text-gray-600">{Array.isArray(product.publico_alvo) ? product.publico_alvo.join(', ') : '-'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Categoria</h4>
              <p className="text-sm text-gray-600">{Array.isArray(product.categorias) ? product.categorias.join(', ') : '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
