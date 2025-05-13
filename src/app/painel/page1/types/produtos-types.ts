// Tipos para o estado do formulário

// Estados possíveis do lead
export enum LeadState {
  INICIAL = 0,     // Começo/Reset
  PROCESSANDO = 1, // Salvando...
  SUCESSO = 2,     // Deu certo!
  ERRO = 3,        // Ops, erro!
  DELETING = 4,    // Excluindo lead...
  DELETED = 5,     // Lead excluído com sucesso!
  DELETE_ERROR = 6 // Erro ao excluir lead
}

// Enumeração das etapas do formulário
export enum FormStep {
  CLOSED_RESETED = 0,
  BASIC_INFO = 1,
  SUBMITTED = 2
}

// Tipos de erros por etapa
export type StepErrors = Record<FormStep, string[]>;

// Estado do formulário
export interface FormState {
  currentStep: FormStep;
  isSubmitting: boolean;
  hasError: boolean;
  errorMessage: string | null;
  errors: StepErrors;
}

// Interface do lead
export interface Lead {
  id: string;
  created_at: string;
  nome_completo: string;
  email: string;
  chat_id: string;
  objetivo: string;
  participou_primeiro_jantar: boolean;
  cidade: string;
  estado: string | null;
  is_empresario: boolean;
  fonte: string;
  referencia: string;
  status: string;
  updated_at: string;
  chatwoot_id: string | null;
  atividades: any | null;
  interacao: any | null;
}

// Dados mockados para uso temporário nos componentes (não mais utilizados)
export const mockLeadsData: Lead[] = [
  { id: '1', created_at: '11/03/2024', nome_completo: 'Lead Premium', email: 'lead.premium@example.com', chat_id: '123456', objetivo: 'Objetivo 1', participou_primeiro_jantar: true, cidade: 'Cidade 1', estado: 'Estado 1', is_empresario: true, fonte: 'Fonte 1', referencia: 'Referencia 1', status: 'active', updated_at: '11/03/2024', chatwoot_id: '123456', atividades: null, interacao: null },
  { id: '2', created_at: '10/03/2024', nome_completo: 'Lead Basic', email: 'lead.basic@example.com', chat_id: '789012', objetivo: 'Objetivo 2', participou_primeiro_jantar: false, cidade: 'Cidade 2', estado: 'Estado 2', is_empresario: false, fonte: 'Fonte 2', referencia: 'Referencia 2', status: 'inactive', updated_at: '10/03/2024', chatwoot_id: '789012', atividades: null, interacao: null },
  { id: '3', created_at: '09/03/2024', nome_completo: 'Lead Plus', email: 'lead.plus@example.com', chat_id: '345678', objetivo: 'Objetivo 3', participou_primeiro_jantar: true, cidade: 'Cidade 3', estado: 'Estado 3', is_empresario: true, fonte: 'Fonte 3', referencia: 'Referencia 3', status: 'active', updated_at: '09/03/2024', chatwoot_id: '345678', atividades: null, interacao: null }
];
