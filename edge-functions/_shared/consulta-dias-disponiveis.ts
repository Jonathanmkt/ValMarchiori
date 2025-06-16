import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Configurações CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Função para formatar data no padrão brasileiro
function formatarDataBrasileira(data: Date): string {
  const opcoes: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  return data.toLocaleDateString('pt-BR', opcoes);
}

// Função para obter o dia da semana em português
function obterDiaSemana(data: Date): string {
  const dias = [
    'domingo', 'segunda-feira', 'terça-feira', 
    'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'
  ];
  return dias[data.getDay()];
}

// Função para validar e processar as datas de entrada
function processarDatasEntrada(dataInicioStr?: string, dataLimiteStr?: string) {
  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0); // Normaliza para meia-noite

  // Se não informou data de início, usa hoje
  const dataInicio = dataInicioStr 
    ? new Date(dataInicioStr + 'T00:00:00-03:00')
    : new Date(dataAtual);
  
  // Se não informou data limite, usa 30 dias após a data de início
  let dataLimite = dataLimiteStr 
    ? new Date(dataLimiteStr + 'T23:59:59-03:00')
    : new Date(dataInicio);
  
  if (!dataLimiteStr) {
    dataLimite.setDate(dataInicio.getDate() + 30);
  }

  // Validações
  if (isNaN(dataInicio.getTime()) || isNaN(dataLimite.getTime())) {
    throw new Error('Formato de data inválido. Use YYYY-MM-DD');
  }

  if (dataInicio > dataLimite) {
    throw new Error('A data de início não pode ser posterior à data limite');
  }

  // Calcula diferença em dias
  const diffTime = Math.abs(dataLimite.getTime() - dataInicio.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return {
    dataInicio,
    dataLimite,
    diffDays
  };
}

// Função principal
export async function consultaDiasDisponiveis(req: Request) {
  // Trata requisições OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Aceita apenas GET
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido. Use GET.' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obtém os parâmetros da URL
    const url = new URL(req.url);
    const filialId = url.searchParams.get('filial_id');
    const dataInicioStr = url.searchParams.get('data_inicio') || undefined;
    const dataLimiteStr = url.searchParams.get('data_limite') || undefined;

    // Validação do parâmetro obrigatório
    if (!filialId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'O parâmetro filial_id é obrigatório' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Processa as datas
    const { dataInicio, dataLimite, diffDays } = processarDatasEntrada(dataInicioStr, dataLimiteStr);
    
    // Configuração do Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Busca o UUID da filial
    const { data: filialData, error: filialError } = await supabase
      .from('filiais')
      .select('filial_uuid')
      .eq('filial_id', filialId)
      .single();

    if (filialError || !filialData) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Filial não encontrada',
          details: filialError?.message
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const filialUuid = filialData.filial_uuid;

    // Consulta os agendamentos disponíveis no período
    const { data: agendamentos, error: agendamentosError } = await supabase
      .from('agendamentos')
      .select('data_agendamento, turno')
      .eq('filial', filialUuid)
      .eq('disponivel', true)
      .gte('data_agendamento', dataInicio.toISOString().split('T')[0])
      .lte('data_agendamento', dataLimite.toISOString().split('T')[0])
      .order('data_agendamento', { ascending: true });

    if (agendamentosError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Erro ao consultar agendamentos',
          details: agendamentosError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Processa os resultados para agrupar por data
    const disponibilidadePorData: Record<string, Set<string>> = {};
    
    agendamentos?.forEach(agendamento => {
      const data = agendamento.data_agendamento;
      if (!disponibilidadePorData[data]) {
        disponibilidadePorData[data] = new Set();
      }
      disponibilidadePorData[data].add(agendamento.turno);
    });

    // Formata os dados de disponibilidade
    const disponibilidade = Object.entries(disponibilidadePorData).map(([data, turnosSet]) => {
      const dataObj = new Date(data + 'T00:00:00-03:00');
      return {
        data,
        data_formatada: formatarDataBrasileira(dataObj),
        dia_semana: obterDiaSemana(dataObj),
        turnos_disponiveis: Array.from(turnosSet)
      };
    }).sort((a, b) => a.data.localeCompare(b.data));

    // Formata a resposta
    const resposta = {
      success: true,
      mensagem: disponibilidade.length === 0 
        ? 'Não há horários disponíveis nesse intervalo de datas' 
        : 'Consulta realizada com sucesso',
      ...(diffDays > 30 && {
        aviso: 'Para melhor desempenho, recomendamos consultar no máximo 30 dias por vez.'
      }),
      periodo: {
        inicio: dataInicio.toISOString().split('T')[0],
        fim: dataLimite.toISOString().split('T')[0],
        total_dias: diffDays
      },
      disponibilidade
    };

    return new Response(
      JSON.stringify(resposta),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Erro ao processar a requisição',
        ...(error.details && { details: error.details })
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Handler para o Deno.serve
Deno.serve(async (req) => {
  return await consultaDiasDisponiveis(req);
});
