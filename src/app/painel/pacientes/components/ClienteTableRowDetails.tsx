import { Cliente } from '../types/clientes-types';
import { MapPin, Phone, Calendar } from 'lucide-react';

interface ClienteTableRowDetailsProps {
  lead: Cliente;
}

export function ClienteTableRowDetails({ lead }: ClienteTableRowDetailsProps) {
  return (
    <div className="flex w-[calc(100%-12px)] py-6 px-6 mx-1.5 mb-0.5 bg-[var(--secondary-50)] rounded-b-lg border-x border-b border-[#162D404D]">
      <div className="flex w-full">
        {/* Coluna 1: Informações Básicas */}
        <div className="w-[35%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500">Nome Completo</div>
          <div className="font-medium">{lead.nome_completo}</div>
          
          <div className="text-sm text-gray-500 mt-2">Email</div>
          <div className="font-medium">{lead.email || 'Não informado'}</div>

          <div className="text-sm text-gray-500 mt-2">Telefone</div>
          <div className="font-medium flex items-center gap-1">
            <Phone size={14} className="text-gray-500" />
            {lead.cliente_id ? lead.cliente_id.replace(/^55/, '') : 'Não informado'}
          </div>
        </div>

        {/* Coluna 2: Endereço */}
        <div className="w-[65%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin size={14} className="text-gray-500" />
            Endereço
          </div>
          
          {lead.endereco ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Logradouro</div>
                <div className="font-medium">{lead.endereco.logradouro || 'Não informado'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Número / Complemento</div>
                <div className="font-medium">
                  {lead.endereco.numero || '-'}
                  {lead.endereco.complemento ? ` - ${lead.endereco.complemento}` : ''}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Bairro</div>
                <div className="font-medium">{lead.endereco.bairro || 'Não informado'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Cidade</div>
                <div className="font-medium">{lead.endereco.cidade || 'Não informada'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">CEP</div>
                <div className="font-medium">{lead.endereco.cep || 'Não informado'}</div>
              </div>
            </div>
          ) : (
            <div className="font-medium text-gray-500">Endereço não cadastrado</div>
          )}
          
          {lead.data_criacao && (
            <div className="mt-2 flex items-center gap-1">
              <Calendar size={14} className="text-gray-500" />
              <div className="text-xs text-gray-500">Cadastrado em:</div>
              <div className="text-xs">
                {new Date(lead.data_criacao).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
