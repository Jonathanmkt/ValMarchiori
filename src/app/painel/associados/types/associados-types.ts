// Interface para dados do RG (formato JSON)
export interface RgData {
  numero: string;
  orgao_emissor: string;
}

// Interface para dados do Título de Eleitor (formato JSON)
export interface TituloEleitorData {
  numero?: string;
  zona?: string;
  secao?: string;
}

// Interface para dados da CTPS (formato JSON)
export interface CtpsData {
  numero?: string;
  serie?: string;
}

// Interface para dados de endereço (formato JSON)
export interface EnderecoData {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

// Enums para valores fixos
export enum Sexo {
  MASCULINO = 'M',
  FEMININO = 'F',
  OUTRO = 'O'
}

export enum EstadoCivil {
  SOLTEIRO = 'solteiro',
  CASADO = 'casado',
  DIVORCIADO = 'divorciado',
  VIUVO = 'viuvo',
  SEPARADO = 'separado'
}

export enum SituacaoAssociado {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso'
}

// Interface principal do Associado
export interface Associado {
  // Identificação
  id: string;
  cpf: string;
  matricula: number;
  drt: number;
  
  // Dados Pessoais
  nome_completo: string;
  nome_mae?: string;
  nome_pai?: string;
  data_nascimento?: string; // formato ISO 'YYYY-MM-DD'
  sexo?: string;
  tipo_sanguineo?: string;
  estado_civil?: string;
  nacionalidade?: string;
  naturalidade?: string;
  
  // Documentos (objetos JSON)
  rg_data: RgData;
  titulo_eleitor_data?: TituloEleitorData;
  ctps_data?: CtpsData;
  endereco_data?: EnderecoData;
  
  // Outros documentos
  certificado_reservista?: string;
  inss?: string;
  
  // Datas importantes
  data_admissao?: string; // formato ISO 'YYYY-MM-DD'
  data_desligamento?: string | null; // formato ISO 'YYYY-MM-DD'
  data_drt?: string; // formato ISO 'YYYY-MM-DD'
  data_expedicao?: string; // formato ISO 'YYYY-MM-DD'
  data_registro?: string; // formato ISO 'YYYY-MM-DD'
  
  // Dados administrativos
  processo?: string;
  folha?: string;
  livro?: string;
  
  // Status
  situacao: string; // default: 'ativo'
  inadimplente: boolean; // default: false
  encarregado_tambem: boolean; // default: false
  
  // Contato
  email?: string;
  telefone?: string;
  
  // Mídia
  foto?: string;
  qr_code_cracha?: string;
  
  // Outros
  observacao?: string;
  
  // Timestamps (gerenciados pelo Supabase)
  created_at: string;
  updated_at: string;
}

// Interface para criar um novo associado (omite campos gerados automaticamente)
export type NovoAssociado = Omit<Associado, 'id' | 'created_at' | 'updated_at'>;

// Interface para atualização parcial de um associado
export type AtualizacaoAssociado = Partial<NovoAssociado>;

// Interface para filtros de busca
export interface FiltrosAssociado {
  nome?: string;
  cpf?: string;
  matricula?: number;
  drt?: number;
  situacao?: string;
  inadimplente?: boolean;
}

// Interface para resposta da API
export interface RespostaAPI<T> {
  success: boolean;
  message: string;
  data?: T;
}
