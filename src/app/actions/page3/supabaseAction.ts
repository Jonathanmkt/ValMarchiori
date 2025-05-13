"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";

//
// Exemplo de tipagem — troque pelos campos da sua tabela
//
type YourTableRow = {
  // • id?: number;           // se for insert sem id
  // • name: string;
  // • created_at?: string;    // datas podem ser strings ISO
};

//
// DADOS de insert/update — defina conforme o seu formulário ou payload
//
type Payload = Partial<YourTableRow>;

/**
 * Exemplo genérico de Server Action Supabase
 *
 * @param payload  objeto com os campos que serão inseridos/atualizados
 * @returns        resultado da operação no Supabase ou lança erro
 */
export async function supabaseAction(payload: Payload) {
  // 1) Cria o cliente no servidor (SSR, Middleware ou RSC)
  const supabase = await createServerClient();

  // 2) Escolha a operação: insert, update, delete ou select
  //    a) Insert:
  const { data: insertResult, error: insertError } = await supabase
    .from<YourTableRow>("your_table_name")   // <- substitua pelo nome da tabela
    .insert([payload]);

  if (insertError) {
    // Trate erros conforme sua necessidade (logging, UI, etc.)
    throw new Error(`Insert falhou: ${insertError.message}`);
  }

  // 3) (Opcional) Update:
  // const { data: updateResult, error: updateError } = await supabase
  //   .from<YourTableRow>("your_table_name")
  //   .update(payload)
  //   .eq("id", payload.id);                  // <- ajuste campo de filtro

  // 4) (Opcional) Delete:
  // const { error: deleteError } = await supabase
  //   .from("your_table_name")
  //   .delete()
  //   .eq("id", payload.id);

  // 5) (Opcional) Select:
  // const { data: rows, error: selectError } = await supabase
  //   .from<YourTableRow>("your_table_name")
  //   .select("*")
  //   .eq("id", payload.id);

  // Retorna o resultado de INSERT (ou de UPDATE/SELECT, se você descomentar acima)
  return insertResult;
}