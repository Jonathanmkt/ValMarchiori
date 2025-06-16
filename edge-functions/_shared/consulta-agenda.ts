import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from './_shared/cors.ts';
// Função para normalizar texto (remover acentos e converter para minúsculas)
const normalizarTexto = (texto)=>{
  if (!texto) return '';
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
};
// Função para formatar horário em formato legível
const formatarHorarioLegivel = (dataISO)=>{
  const data = new Date(dataISO);
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const hora = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
};
// Converte o turno normalizado para o formato armazenado no banco
const mapearTurnoParaBanco = (turnoNormalizado)=>{
  if (turnoNormalizado === 'manha') return 'manha';
  if (turnoNormalizado === 'tarde') return 'tarde';
  if (turnoNormalizado === 'noite') return 'noite';
  return turnoNormalizado;
};
// Verifica se a data/turno é válido para consulta (não é passado)
const validarDataTurno = (data, turno)=>{
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.getMonth() + 1;
  const diaAtual = dataAtual.getDate();
  const horaAtual = dataAtual.getHours();
  const minutosAtual = dataAtual.getMinutes();
  // Converte a data de consulta para comparação
  const [ano, mes, dia] = data.split('-').map(Number);
  // Caso 2: Se a data for anterior à atual, recusa a busca
  if (ano < anoAtual || ano === anoAtual && mes < mesAtual || ano === anoAtual && mes === mesAtual && dia < diaAtual) {
    return {
      valido: false,
      mensagem: "Não é permitido consultar data/turno anteriores à data/atual atual."
    };
  }
  // Caso 1: Se a data for posterior à atual, a busca é válida
  if (ano > anoAtual || ano === anoAtual && mes > mesAtual || ano === anoAtual && mes === mesAtual && dia > diaAtual) {
    return {
      valido: true
    };
  }
  // Caso 3: Se a data for igual à atual, verificar turno e hora
  // Definir hora máxima para cada turno conforme o trigger
  const horaMaximaTurno = {
    'manha': 11,
    'tarde': 17,
    'noite': 23 // 23:59:59
  };
  // Se não for um turno válido, considerar válido por segurança
  if (!horaMaximaTurno[turno]) {
    return {
      valido: true
    };
  }
  // Verifica se a hora atual já ultrapassou o horário máximo do turno
  if (horaAtual > horaMaximaTurno[turno]) {
    return {
      valido: false,
      mensagem: "Não é permitido consultar data/turno anteriores à data/atual atual."
    };
  }
  // Se a hora atual for exatamente o limite do turno, verificar minutos
  if (horaAtual === horaMaximaTurno[turno] && minutosAtual >= 59) {
    return {
      valido: false,
      mensagem: "Não é permitido consultar data/turno anteriores à data/atual atual."
    };
  }
  // A consulta é válida
  return {
    valido: true
  };
};
Deno.serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  // Verifica se a requisição é do tipo GET
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({
      error: 'Método não permitido'
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  try {
    // Obtém os parâmetros da URL
    const url = new URL(req.url);
    const data_agendamento = url.searchParams.get('data_agendamento'); // Formato esperado: YYYY-MM-DD
    const turno = url.searchParams.get('turno'); // manha, tarde ou noite
    const filial_id = url.searchParams.get('filial_id'); // ID da filial
    // Validação básica dos parâmetros
    if (!data_agendamento || !turno || !filial_id) {
      return new Response(JSON.stringify({
        error: 'Parâmetros obrigatórios ausentes',
        required_params: [
          'data_agendamento',
          'turno',
          'filial_id'
        ]
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Normaliza o turno para corresponder ao formato do banco
    const turnoNormalizado = normalizarTexto(turno);
    const turnoBanco = mapearTurnoParaBanco(turnoNormalizado);
    // Validar se a consulta para a data/turno é permitida (não é passada)
    const validacao = validarDataTurno(data_agendamento, turnoBanco);
    if (!validacao.valido) {
      return new Response(JSON.stringify({
        success: true,
        message: validacao.mensagem,
        horarios_disponiveis: []
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Inicializa o cliente Supabase
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://lhgnhwmslmaafcgvtddg.supabase.co';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZ25od21zbG1hYWZjZ3Z0ZGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTUzNjcsImV4cCI6MjA2MTE5MTM2N30.pZNudhWRyKL6zxGYtw';
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // Buscar o UUID da filial
    const { data: filialData, error: filialError } = await supabaseClient.from('filiais').select('filial_uuid').eq('filial_id', filial_id).single();
    if (filialError || !filialData) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Filial não encontrada',
        details: filialError?.message
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const filial_uuid = filialData.filial_uuid;
    // Executar a consulta principal
    const { data: agendamentosDisponiveis, error: agendamentosError } = await supabaseClient.from('agendamentos').select('agendamento_code, data_agendamento, hora_agendamento, turno').eq('data_agendamento', data_agendamento).eq('turno', turnoBanco).eq('filial', filial_uuid).eq('disponivel', true).order('hora_agendamento');
    if (agendamentosError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Erro ao consultar agenda',
        details: agendamentosError.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Se não encontrar resultados, retorna mensagem específica
    if (!agendamentosDisponiveis || agendamentosDisponiveis.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: "Não foram encontrados horários disponíveis para essa data e turno.",
        horarios_disponiveis: []
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Formata os horários disponíveis
    const horariosFormatados = agendamentosDisponiveis.map((ag)=>({
        agendamento_code: ag.agendamento_code,
        horario_formatado_br: formatarHorarioLegivel(`${ag.data_agendamento}T${ag.hora_agendamento}`)
      }));
    // Prepara a resposta simplificada
    const response = horariosFormatados;
    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erro não tratado:', error);
    return new Response(JSON.stringify({
      error: 'Erro interno do servidor'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
