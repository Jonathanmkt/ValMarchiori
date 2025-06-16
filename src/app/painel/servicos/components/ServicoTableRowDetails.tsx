import { Servico } from '../types/servicos-types';
import { Clock, DollarSign, Calendar, Info, Truck } from 'lucide-react';

interface ServicoTableRowDetailsProps {
  servico: Servico;
}

export function ServicoTableRowDetails({ servico }: ServicoTableRowDetailsProps) {
  return (
    <div className="flex w-[calc(100%-12px)] py-6 px-6 mx-1.5 mb-0.5 bg-[var(--secondary-50)] rounded-b-lg border-x border-b border-[#162D404D]">
      <div className="flex w-full">
        {/* Coluna 1: Informações Básicas */}
        <div className="w-[35%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500">Nome do Serviço</div>
          <div className="font-medium">{servico.nome_servico}</div>
          
          <div className="text-sm text-gray-500 mt-2">Código</div>
          <div className="font-medium">{servico.servico_code || 'Não informado'}</div>

          <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <DollarSign size={14} className="text-gray-500" />
            Valor
          </div>
          <div className="font-medium">
            {servico.valor ? `R$ ${servico.valor.toFixed(2)}` : 'Não informado'}
          </div>

          <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <Clock size={14} className="text-gray-500" />
            Duração
          </div>
          <div className="font-medium">
            {servico.duracao_minutos ? `${servico.duracao_minutos} minutos` : 'Não informado'}
          </div>
        </div>

        {/* Coluna 2: Detalhes */}
        <div className="w-[65%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Info size={14} className="text-gray-500" />
            Descrição
          </div>
          <div className="font-medium">
            {servico.descricao || 'Sem descrição'}
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div>
              <div className="text-xs text-gray-500">Tipo do Serviço</div>
              <div className="font-medium">{servico.tipo_do_servico || 'Não informado'}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-medium">
                {servico.disponivel ? 'Disponível' : 'Indisponível'}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500">Necessita Preparo</div>
              <div className="font-medium">{servico.necessita_preparo ? 'Sim' : 'Não'}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Truck size={12} className="text-gray-500" />
                Disponível para Delivery
              </div>
              <div className="font-medium">{servico.disponivel_delivery ? 'Sim' : 'Não'}</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <Calendar size={14} className="text-gray-500" />
            Data de Cadastro
          </div>
          <div className="font-medium">
            {servico.data_criacao ? new Date(servico.data_criacao).toLocaleDateString('pt-BR') : 'Não informado'}
          </div>
        </div>
      </div>
    </div>
  );
}
