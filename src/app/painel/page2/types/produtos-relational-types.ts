// Interfaces para as tabelas relacionais
// Nomes das interfaces correspondem exatamente aos nomes das tabelas no banco de dados

export interface produtos_categorias {
  produto_id: string; // UUID
  categoria_id: number;
}

export interface produtos_condicao_frete {
  produto_id: string; // UUID
  condicao_frete_id: number;
}

export interface produtos_materiais {
  produto_id: string; // UUID
  material_id: number;
}

export interface produtos_ocasioes {
  produto_id: string; // UUID
  ocasiao_id: number;
}

export interface produtos_tags {
  produto_id: string; // UUID
  tag_id: number;
}

export interface produtos_publico_alvo {
  produto_id: string; // UUID
  publico_alvo_id: number;
}
