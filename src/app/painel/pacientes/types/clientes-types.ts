// Interface para o endereço do cliente (formato JSON)
export interface Endereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
}

// Interface para agendamentos do cliente
export interface Agendamento {
  data_agendamento: string;
  hora_agendamento: string;
}

// Interface do cliente
export interface Cliente {
  cliente_uuid: string;
  nome_completo: string;
  cliente_id: string; // Telefone com 55 no início
  email?: string;
  observacoes?: string;
  data_nascimento?: string;
  endereco?: Endereco;
  data_criacao?: string;
  data_atualizacao?: string;
  agendamentos?: Agendamento[]; // Campo adicional para armazenar os agendamentos
}
