import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Configurações CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Tipos para os dados de entrada
interface ClienteInput {
  nome_completo: string;
  // Outros campos opcionais podem ser adicionados aqui
}

Deno.serve(async (req) => {
  // Tratar requisições CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { ...corsHeaders }
    });
  }

  try {
    // 1. Validar método HTTP
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido. Use POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Obter parâmetros da URL
    const url = new URL(req.url);
    const cliente_id = url.searchParams.get('cliente_id');
    const filial_id = url.searchParams.get('filial_id');

    // 3. Validar parâmetros obrigatórios
    if (!cliente_id) {
      return new Response(
        JSON.stringify({ error: 'cliente_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!filial_id) {
      return new Response(
        JSON.stringify({ error: 'filial_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validar e converter filial_id para número
    const filialIdNum = parseInt(filial_id, 10);
    if (isNaN(filialIdNum)) {
      return new Response(
        JSON.stringify({ error: 'filial_id deve ser um número' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Obter dados do corpo da requisição
    const requestData: ClienteInput = await req.json();
    
    if (!requestData.nome_completo) {
      return new Response(
        JSON.stringify({ error: 'nome_completo é obrigatório no corpo da requisição' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Inicializar cliente Supabase
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(
        JSON.stringify({ error: 'Configuração do Supabase ausente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 7. Verificar se o cliente já existe
    const { data: clienteExistente, error: erroClienteExistente } = await supabase
      .from('clientes')
      .select('cliente_uuid')
      .eq('cliente_id', cliente_id)
      .maybeSingle();

    if (erroClienteExistente) {
      console.error('Erro ao verificar cliente existente:', erroClienteExistente);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar cliente existente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (clienteExistente) {
      return new Response(
        JSON.stringify({ error: 'Já existe um cliente com este cliente_id' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Verificar se a filial existe
    const { data: filial, error: erroFilial } = await supabase
      .from('filiais')
      .select('filial_uuid')
      .eq('filial_id', filialIdNum)
      .single();

    if (erroFilial || !filial) {
      return new Response(
        JSON.stringify({ error: 'Filial não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const filial_uuid = filial.filial_uuid;

    // 9. Iniciar transação para criar cliente e associação
    const { data: novoCliente, error: erroCriarCliente } = await supabase
      .from('clientes')
      .insert({
        cliente_id,
        nome_completo: requestData.nome_completo,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      })
      .select('cliente_uuid')
      .single();

    if (erroCriarCliente || !novoCliente) {
      console.error('Erro ao criar cliente:', erroCriarCliente);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar cliente', details: erroCriarCliente?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 10. Criar associação com a filial
    const { error: erroAssociacao } = await supabase
      .from('filiais_clientes')
      .insert({
        cliente_id: novoCliente.cliente_uuid,
        filial_id: filial_uuid,
        data_criacao: new Date().toISOString()
      });

    if (erroAssociacao) {
      console.error('Erro ao associar cliente à filial:', erroAssociacao);
      // Tentativa de limpar o cliente criado em caso de falha na associação
      await supabase
        .from('clientes')
        .delete()
        .eq('cliente_uuid', novoCliente.cliente_uuid);
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao associar cliente à filial', 
          details: erroAssociacao.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 11. Retornar sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cliente cadastrado e associado à filial com sucesso',
        cliente: {
          cliente_id,
          cliente_uuid: novoCliente.cliente_uuid,
          nome_completo: requestData.nome_completo,
          filial_id: filialIdNum,
          filial_uuid
        }
      }),
      { 
        status: 201, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Erro não tratado:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
