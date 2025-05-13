import * as z from 'zod';

// Enums para tipos de status
export enum ProdutoStatus {
  NULL = 'null',
  RASCUNHO = 'rascunho',
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  ESGOTADO = 'esgotado'
}

// Passo 1: Informações Básicas
export const passo1Schema = z.object({
  // Tabela: produtos
  nome: z.string().min(1, 'Nome é obrigatório'),
  status: z.enum([ProdutoStatus.NULL, ProdutoStatus.RASCUNHO, ProdutoStatus.ATIVO, 
                  ProdutoStatus.INATIVO, ProdutoStatus.ESGOTADO])
         .default(ProdutoStatus.ATIVO),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  imagens: z.array(z.string()).optional(),

  // Tabela: estoque_lancamentos
  estoque_inicial: z.number().int().min(0, 'Estoque inicial deve ser zero ou positivo').default(1)
});

// Passo 2: Especificações do Produto (todos da tabela produtos)
export const passo2Schema = z.object({
  codigo_sku: z.string().optional(),
  garantia: z.number().int().min(0, 'Garantia deve ser zero ou mais meses').default(0),
  preco_custo: z.number().positive('Preço de custo deve ser positivo'),
  preco_venda: z.number().positive('Preço de venda deve ser positivo'),
  peso: z.number().nonnegative('Peso deve ser positivo ou zero'),
  dimensoes: z.object({
    altura: z.number().nonnegative('Altura deve ser positiva ou zero'),
    largura: z.number().nonnegative('Largura deve ser positiva ou zero'),
    profundidade: z.number().nonnegative('Profundidade deve ser positiva ou zero')
  })
});

// Passo 3: Informações Complementares
export const passo3Schema = z.object({
  // Tabela: produtos
  destaque: z.boolean().default(false),

  // Campos para tabelas relacionais (IDs são números inteiros)
  categorias: z.array(z.number().int('ID de categoria deve ser um número inteiro')).optional(),
  tags: z.array(z.number().int('ID de tag deve ser um número inteiro')).optional(),
  ocasioes: z.array(z.number().int('ID de ocasião deve ser um número inteiro')).optional(),
  publico_alvo: z.array(z.number().int('ID de público alvo deve ser um número inteiro')).optional(),
  condicao_frete: z.array(z.number().int('ID de condição de frete deve ser um número inteiro')).optional(),
  materiais: z.array(z.number().int('ID de material deve ser um número inteiro')).optional()
});

// Schema completo do formulário de produto
export const produtoFormSchema = passo1Schema.merge(passo2Schema).merge(passo3Schema);

// Interface para dimensões do produto
export interface Dimensoes {
  altura: number;
  largura: number;
  profundidade: number;
}

// Tipo inferido do schema completo
export type ProdutoData = z.infer<typeof produtoFormSchema>;

// Tipo para os dados do produto retornados pelo banco
export type ProdutoRecord = ProdutoData & {
  id: string;
  data_criacao: string;
  data_atualizacao: string;
};