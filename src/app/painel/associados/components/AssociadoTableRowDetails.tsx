import { Associado, EnderecoData } from '../types/associados-types';
import { MapPin, Phone, Calendar } from 'lucide-react';

interface AssociadoTableRowDetailsProps {
  associado: Associado;
}

export function AssociadoTableRowDetails({ associado }: AssociadoTableRowDetailsProps) {
  // Extrair dados do endereço do objeto JSON
  const endereco: EnderecoData | undefined = associado.endereco_data;

  return (
    <div className="flex w-[calc(100%-12px)] py-6 px-6 mx-1.5 mb-0.5 bg-transparent rounded-b-lg border-x-2 border-b-2 border-primary">
      <div className="flex w-full">
        {/* Coluna 1: Informações Básicas */}
        <div className="w-[35%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500">Nome Completo</div>
          <div className="font-medium">{associado.nome_completo}</div>
          
          <div className="text-sm text-gray-500 mt-2">Email</div>
          <div className="font-medium">{associado.email || 'Não informado'}</div>

          <div className="text-sm text-gray-500 mt-2">Telefone</div>
          <div className="font-medium flex items-center gap-1">
            <Phone size={14} className="text-gray-500" />
            {associado.telefone || 'Não informado'}
          </div>
          
          <div className="text-sm text-gray-500 mt-2">Matrícula</div>
          <div className="font-medium">{associado.matricula}</div>
          
          <div className="text-sm text-gray-500 mt-2">CPF</div>
          <div className="font-medium">{associado.cpf}</div>
        </div>

        {/* Coluna 2: Endereço */}
        <div className="w-[65%] px-4 flex flex-col gap-2">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin size={14} className="text-gray-500" />
            Endereço
          </div>
          
          {endereco ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Logradouro</div>
                <div className="font-medium">{endereco.logradouro || 'Não informado'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Número / Complemento</div>
                <div className="font-medium">
                  {endereco.numero || '-'}
                  {endereco.complemento ? ` - ${endereco.complemento}` : ''}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Bairro</div>
                <div className="font-medium">{endereco.bairro || 'Não informado'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Cidade</div>
                <div className="font-medium">{endereco.cidade || 'Não informada'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">CEP</div>
                <div className="font-medium">{endereco.cep || 'Não informado'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">UF</div>
                <div className="font-medium">{endereco.uf || 'Não informado'}</div>
              </div>
            </div>
          ) : (
            <div className="font-medium text-gray-500">Endereço não cadastrado</div>
          )}
          
          {associado.created_at && (
            <div className="mt-2 flex items-center gap-1">
              <Calendar size={14} className="text-gray-500" />
              <div className="text-xs text-gray-500">Cadastrado em:</div>
              <div className="text-xs">
                {new Date(associado.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
