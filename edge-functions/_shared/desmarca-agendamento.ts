import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Configurações CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Função para formatar data no padrão brasileiro
function formatarDataBrasileira(dataString: string): string {
  const data = new Date(dataString);
  const opcoes: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  
  // Formata a data e capitaliza o mês
  const dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
  return dataFormatada;
}

// Função principal
export async function desmarcaAgendamento(req: Request) {
  // Trata requisições OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Aceita apenas POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido. Use POST.' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obtém os parâmetros da query string
    const url = new URL(req.url);
    const params = url.searchParams;
    
    const agendamento_code = params.get('agendamento_code');
    const filial_id = params.get('filial_id');
    const cliente_id = params.get('cliente_id');

    // Validação dos parâmetros obrigatórios
    if (!agendamento_code || !filial_id || !cliente_id) {
      return new Response(
        JSON.stringify({ 
          error: 'Parâmetros obrigatórios ausentes',
          required: ['agendamento_code', 'filial_id', 'cliente_id']
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Inicializa o cliente Supabase
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Variáveis de ambiente não configuradas');
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. Buscar o UUID da filial
    const { data: filial, error: filialError } = await supabase
      .from('filiais')
      .select('filial_uuid')
      .eq('filial_id', filial_id)
      .single();

    if (filialError || !filial) {
      return new Response(
        JSON.stringify({ error: 'Filial não encontrada' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const filial_uuid = filial.filial_uuid;

    // 2. Buscar o(s) cliente(s) com o cliente_id fornecido
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('cliente_uuid')
      .eq('cliente_id', cliente_id);

    if (clientesError || !clientes || clientes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cliente não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let cliente_uuid = clientes[0].cliente_uuid;

    // Se houver mais de um cliente com o mesmo ID, desambigua pela filial
    if (clientes.length > 1) {
      const { data: filialCliente, error: fcError } = await supabase
        .from('filiais_clientes')
        .select('cliente_id')
        .eq('filial_id', filial_uuid)
        .in('cliente_id', clientes.map(c => c.cliente_uuid))
        .single();

      if (fcError || !filialCliente) {
        return new Response(
          JSON.stringify({ 
            error: 'Cliente não encontrado para esta filial',
            details: 'Existem múltiplos clientes com este ID, mas nenhum está associado a esta filial'
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      cliente_uuid = filialCliente.cliente_id;
    }

    // 3. Buscar o agendamento ativo do cliente especificado
    const { data: agendamento, error: agendamentoError } = await supabase
      .from('agendamentos')
      .select('agendamento_id, data_agendamento, hora_agendamento, servico, disponivel, filial')
      .eq('agendamento_code', agendamento_code)
      .eq('cliente', cliente_uuid)
      .eq('disponivel', false)
      .single();

    if (agendamentoError || !agendamento) {
      return new Response(
        JSON.stringify({ 
          error: 'Agendamento não encontrado ou já está disponível',
          details: agendamentoError?.message
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 4. Buscar informações do serviço para incluir na resposta
    const { data: servico, error: servicoError } = await supabase
      .from('servicos')
      .select('nome_servico')
      .eq('servico_id', agendamento.servico)
      .single();

    if (servicoError || !servico) {
      return new Response(
        JSON.stringify({ error: 'Erro ao obter detalhes do serviço' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const nome_servico = servico.nome_servico;

    // 5. Atualizar o agendamento para disponível e remover as associações de cliente, serviço e colaborador
    const { data: agendamentoAtualizado, error: updateError } = await supabase
      .from('agendamentos')
      .update({
        cliente: null,        // Remove associação com o cliente
        servico: null,        // Remove associação com o serviço
        colaborador: null,    // Remove associação com o colaborador
        disponivel: true,     // Marca como disponível para novo agendamento
        data_atualizacao: new Date().toISOString()
        // Mantém a filial para que o horário continue disponível na mesma filial
      })
      .eq('agendamento_id', agendamento.agendamento_id)
      .eq('disponivel', false) // Garante que só atualiza se ainda estiver indisponível
      .select()
      .single();

    if (updateError || !agendamentoAtualizado) {
      return new Response(
        JSON.stringify({ 
          error: 'Falha ao desmarcar o agendamento',
          details: updateError?.message
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 6. Retornar sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Agendamento desmarcado com sucesso',
        agendamento: {
          data_agendamento: formatarDataBrasileira(agendamento.data_agendamento),
          hora_agendamento: agendamento.hora_agendamento,
          nome_servico: nome_servico
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Handler para o Deno.serve
Deno.serve(async (req) => {
  return await desmarcaAgendamento(req);
});
