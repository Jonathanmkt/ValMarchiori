import { Lead } from '../types/produtos-types';

interface LeadTableRowDetailsProps {
  lead: Lead;
}

export function LeadTableRowDetails({ lead }: LeadTableRowDetailsProps) {
  return (
    <div className="flex w-[calc(100%-12px)] py-6 px-6 mx-1.5 mb-0.5 bg-[var(--secondary-50)] rounded-b-lg border-x border-b border-secondary/30">
      <div className="flex w-full">
        {/* Coluna 1: Informações Básicas */}
        <div className="w-[35%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500">Nome Completo</div>
          <div className="font-medium">{lead.nome_completo}</div>
          
          <div className="text-sm text-gray-500 mt-2">Email</div>
          <div className="font-medium">{lead.email}</div>
        </div>

        {/* Coluna 2: Contato e Status */}
        <div className="w-[35%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500">Telefone</div>
          <div className="font-medium">{lead.chat_id}</div>
          
          <div className="text-sm text-gray-500 mt-2">Status</div>
          <div className="font-medium capitalize">{lead.status}</div>
        </div>

        {/* Coluna 3: Objetivo e Detalhes */}
        <div className="w-[30%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500">Objetivo</div>
          <div className="font-medium">{lead.objetivo}</div>
          
          {lead.created_at && (
            <>
              <div className="text-sm text-gray-500 mt-2">Data de Cadastro</div>
              <div className="font-medium">
                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
