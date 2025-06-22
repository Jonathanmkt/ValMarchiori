import { Associado } from '../types/associados-types';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, MapPin, Phone, CreditCard, Award, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AssociadosTableRowDetailsProps {
  associado: Associado;
}

export function AssociadosTableRowDetails({ associado }: AssociadosTableRowDetailsProps) {
  // Função para formatar data
  const formatarData = (dataString: string | null) => {
    if (!dataString) return 'Não informada';
    try {
      return format(new Date(dataString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para extrair informações do endereço
  const formatarEndereco = () => {
    const endereco = associado.endereco_data;
    if (!endereco) return 'Endereço não informado';

    const parts = [
      endereco.logradouro,
      endereco.numero ? `nº ${endereco.numero}` : '',
      endereco.complemento,
      endereco.bairro ? `${endereco.bairro},` : '',
      endereco.cidade,
      endereco.uf
    ].filter(Boolean);

    return parts.join(' ');
  };

  return (
    <div className="flex w-[calc(100%-12px)] py-6 px-6 mx-1.5 mb-0.5 bg-[var(--secondary-50)] rounded-b-lg border-x border-b border-gray-200">
      <div className="flex flex-wrap w-full">
        {/* Coluna 1: Informações pessoais */}
        <div className="w-full md:w-[33%] px-4 mb-4 md:mb-0">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Informações Pessoais
          </h4>
          
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500">CPF</span>
              <p className="text-sm">{associado.cpf || 'Não informado'}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">RG</span>
              <p className="text-sm">
                {associado.rg_data?.numero || 'Não informado'}
                {associado.rg_data?.orgao_emissor && ` - ${associado.rg_data.orgao_emissor}`}
              </p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">Data de Nascimento</span>
              <p className="text-sm">{formatarData(associado.data_nascimento)}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">Estado Civil</span>
              <p className="text-sm">{associado.estado_civil || 'Não informado'}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">Sexo</span>
              <p className="text-sm">{associado.sexo || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Coluna 2: Contato e Endereço */}
        <div className="w-full md:w-[33%] px-4 mb-4 md:mb-0">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
            <Phone className="h-4 w-4" />
            Contato e Endereço
          </h4>
          
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500">Telefone</span>
              <p className="text-sm">{associado.telefone || 'Não informado'}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">E-mail</span>
              <p className="text-sm">{associado.email || 'Não informado'}</p>
            </div>
            
            <div className="pt-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Endereço
              </span>
              <p className="text-sm">{formatarEndereco()}</p>
            </div>
            
            {associado.endereco_data?.cep && (
              <div>
                <span className="text-xs text-gray-500">CEP</span>
                <p className="text-sm">{associado.endereco_data.cep}</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna 3: Associação e Situação */}
        <div className="w-full md:w-[33%] px-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
            <Award className="h-4 w-4" />
            Dados da Associação
          </h4>
          
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500">Matrícula</span>
              <p className="text-sm font-medium">{associado.matricula}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">DRT</span>
              <p className="text-sm">{associado.drt || 'Não informado'}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">Data de Associação</span>
              <p className="text-sm">{formatarData(associado.data_associacao)}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">Situação</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={
                  associado.situacao === 'ativo' ? 'default' : 
                  associado.situacao === 'inativo' ? 'secondary' : 
                  'outline'
                }>
                  {associado.situacao?.charAt(0).toUpperCase() + associado.situacao?.slice(1) || 'Não definido'}
                </Badge>
                
                {associado.inadimplente && (
                  <Badge variant="destructive">Inadimplente</Badge>
                )}
              </div>
            </div>
          </div>
          
          {associado.observacao && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Observações
              </h4>
              <p className="text-sm text-gray-600 border-l-2 border-gray-300 pl-2 italic">
                {associado.observacao}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
