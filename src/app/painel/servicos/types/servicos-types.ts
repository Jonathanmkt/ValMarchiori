// Interface para serviços
export interface Servico {
  servico_id: string;
  servico_code: string;
  nome_servico: string;
  descricao?: string;
  disponivel: boolean;
  necessita_preparo?: boolean;
  disponivel_delivery?: boolean;
  valor?: number;
  duracao_minutos?: number;
  filial_id: string;
  tipo_do_servico?: string;
  instrucoes_preparo?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}
