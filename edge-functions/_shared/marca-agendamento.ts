import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// CORS Headers
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
export async function marcaAgendamentoQuery(req: Request) {
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
    const servico_code = params.get('servico_code');

    // Validação dos parâmetros obrigatórios
    if (!agendamento_code || !filial_id || !cliente_id || !servico_code) {
      return new Response(
        JSON.stringify({ 
          error: 'Parâmetros obrigatórios ausentes',
          required: ['agendamento_code', 'filial_id', 'cliente_id', 'servico_code']
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

    // 3. Buscar o agendamento disponível
    const { data: agendamento, error: agendamentoError } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('agendamento_code', agendamento_code)
      .eq('filial', filial_uuid)
      .eq('disponivel', true)
      .single();

    if (agendamentoError || !agendamento) {
      return new Response(
        JSON.stringify({ 
          error: 'Agendamento não disponível ou já reservado',
          details: 'Não foi possível encontrar um horário disponível para a data e hora solicitadas'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 3. Buscar o(s) serviço(s) com o código fornecido
    const { data: servicos, error: servicosError } = await supabase
      .from('servicos')
      .select('*')
      .eq('servico_code', servico_code);

    if (servicosError || !servicos || servicos.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Serviço não encontrado',
          details: 'Nenhum serviço encontrado com o código fornecido'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verificar se o serviço está disponível na filial
    const { data: servicoFilial, error: sfError } = await supabase
      .from('filiais_servicos')
      .select('servico_id')
      .eq('filial_uuid', filial_uuid)
      .in('servico_id', servicos.map(s => s.servico_id))
      .eq('ativo', true)
      .single();

    if (sfError || !servicoFilial) {
      return new Response(
        JSON.stringify({ 
          error: 'Serviço não disponível',
          details: 'O serviço não está disponível nesta filial ou está inativo'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Encontrar os dados completos do serviço
    const servico = servicos.find(s => s.servico_id === servicoFilial.servico_id);
    if (!servico) {
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao processar o serviço',
          details: 'Dados do serviço inconsistentes'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 4. Atualizar o agendamento
    const { data: agendamentoAtualizado, error: updateError } = await supabase
      .from('agendamentos')
      .update({
        cliente: cliente_uuid,  // Usando o UUID do cliente desambiguado
        servico: servico.servico_id,
        disponivel: false,
        data_atualizacao: new Date().toISOString()
      })
      .eq('agendamento_id', agendamento.agendamento_id)
      .select(`
        *,
        servicos(*),
        clientes:cliente(nome_completo, email)
      `)
      .single();

    if (updateError || !agendamentoAtualizado) {
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao atualizar agendamento',
          details: updateError?.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Formatar a resposta
    const dataHora = new Date(`${agendamentoAtualizado.data_agendamento}T${agendamentoAtualizado.hora_agendamento}`);
    const dataFormatada = formatarDataBrasileira(dataHora.toISOString());
    const horaFormatada = agendamentoAtualizado.hora_agendamento.substring(0, 5); // Formato HH:MM

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Agendamento realizado com sucesso!',
        agendamento: {
          codigo: agendamentoAtualizado.agendamento_code,
          data: dataFormatada,
          hora: horaFormatada,
          servico: agendamentoAtualizado.servicos?.nome_servico,
          profissional: agendamentoAtualizado.profissional_nome,
          status: 'confirmado'
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro ao processar agendamento:', error);
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
  return await marcaAgendamentoQuery(req);
});
