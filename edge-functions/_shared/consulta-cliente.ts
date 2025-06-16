import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Configurações CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const url = new URL(req.url);
    const cliente_id = url.searchParams.get('cliente_id');
    const filial_id = url.searchParams.get('filial_id');
    // Validar se cliente_id e filial_id foram fornecidos
    if (!cliente_id) {
      return new Response(JSON.stringify({
        error: 'cliente_id é obrigatório'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    if (!filial_id) {
      return new Response(JSON.stringify({
        error: 'filial_id é obrigatório'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://lhgnhwmslmaafcgvtddg.supabase.co';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // Passo 1: Buscar TODOS os clientes com o cliente_id fornecido
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('cliente_uuid')
      .eq('cliente_id', cliente_id);

    if (clientesError || !clientes || clientes.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        cliente_encontrado: false,
        message: 'Cliente ainda não cadastrado, pergunte a ele seu nome_completo e cadastre-o imediatamente.',
        acao_requerida: 'cadastrar_cliente'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Se tiver apenas um cliente, usa ele
    let cliente_uuid = clientes[0].cliente_uuid;

    // Se tiver mais de um cliente, verifica qual tem relação com a filial
    if (clientes.length > 1) {
      // Converte filial_id para número
      const filial_id_num = parseInt(filial_id, 10);
      if (isNaN(filial_id_num)) {
        return new Response(JSON.stringify({
          error: 'filial_id inválido'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      // Primeiro, busca o filial_uuid usando o filial_id numérico
      const { data: filialData, error: filialError } = await supabase
        .from('filiais')
        .select('filial_uuid')
        .eq('filial_id', filial_id_num)
        .single();

      if (filialError || !filialData) {
        return new Response(JSON.stringify({
          error: 'Filial não encontrada'
        }), {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      // Busca o cliente que tem relação com a filial
      const { data: filialCliente, error: fcError } = await supabase
        .from('filiais_clientes')
        .select('cliente_id')
        .eq('filial_id', filialData.filial_uuid)
        .in('cliente_id', clientes.map(c => c.cliente_uuid))
        .single();

      if (fcError || !filialCliente) {
        return new Response(JSON.stringify({
          success: true,
          cliente_encontrado: false,
          message: 'Cliente ainda não cadastrado, pergunte a ele seu nome_completo e cadastre-o imediatamente.',
          acao_requerida: 'cadastrar_cliente',
          detalhes: 'Cliente existe em outra filial, mas não está associado a esta filial.'
        }), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      
      cliente_uuid = filialCliente.cliente_id;
    }
    // Passo 2: Buscar o filial_uuid pelo filial_id (agora convertendo para número)
    const filial_id_num = parseInt(filial_id, 10);
    if (isNaN(filial_id_num)) {
      return new Response(JSON.stringify({
        error: 'filial_id inválido'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    const { data: filialUUIDData, error: filialUUIDError } = await supabase
      .from('filiais')
      .select('filial_uuid')
      .eq('filial_id', filial_id_num)
      .single();
    if (filialUUIDError || !filialUUIDData) {
      console.error('Erro ao buscar UUID da filial:', filialUUIDError);
      return new Response(JSON.stringify({
        error: 'Filial não encontrada'
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const filial_uuid = filialUUIDData.filial_uuid;
    // Passo 3: Buscar os dados do cliente (incluindo o campo endereco JSONB)
    const { data: clienteData, error: clienteError } = await supabase.from('clientes').select(`
        cliente_id,
        nome_completo,
        endereco
      `).eq('cliente_uuid', cliente_uuid).single();
    if (clienteError) {
      return new Response(JSON.stringify({
        error: 'Erro ao buscar informações do cliente'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Passo 4: Buscar agendamentos do cliente
    // Vamos corrigir o filtro para incluir corretamente os agendamentos de hoje
    const dataAtual = new Date();
    const dataAtualFormatada = dataAtual.toISOString().split('T')[0] // Já está em UTC
    ;
    // Ajusta para o fuso de Brasília (UTC-3)
    const horaAtualBrasilia = new Date(dataAtual.getTime() - 3 * 60 * 60 * 1000) // Subtrai 3 horas
    ;
    const horaAtualFormatada = horaAtualBrasilia.toTimeString().slice(0, 8) // HH:MM:SS
    ;
    // Consulta com filtro corrigido para incluir todos os agendamentos futuros
    const { data: agendamentosData, error: agendamentosError } = await supabase.from('agendamentos').select(`
        agendamento_code,
        data_agendamento,
        hora_agendamento,
        turno
      `).eq('cliente', cliente_uuid).eq('filial', filial_uuid).or(`data_agendamento.gt.${dataAtualFormatada},and(data_agendamento.eq.${dataAtualFormatada},hora_agendamento.gte.${horaAtualFormatada})`).order('data_agendamento').order('hora_agendamento');
    if (agendamentosError) {
      console.error('Erro ao buscar agendamentos:', agendamentosError);
    }
    // Funções auxiliares
    const formatarData = (data)=>{
      if (!data) return null;
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    };
    const formatarHora = (hora)=>{
      if (!hora) return null;
      return hora.substring(0, 5) // Retorna apenas HH:mm
      ;
    };
    // Formatar agendamentos
    const agendamentosFormatados = agendamentosData ? agendamentosData.map((ag)=>({
        agendamento_code: ag.agendamento_code,
        data_agendamento: formatarData(ag.data_agendamento),
        hora_agendamento: formatarHora(ag.hora_agendamento),
        turno: ag.turno
      })) : [];
    // Formatar o endereço (caso exista)
    const enderecoFormatado = clienteData.endereco ? {
      logradouro: clienteData.endereco.logradouro,
      numero: clienteData.endereco.numero,
      complemento: clienteData.endereco.complemento,
      bairro: clienteData.endereco.bairro,
      cidade: clienteData.endereco.cidade,
      uf: clienteData.endereco.uf,
      cep: clienteData.endereco.cep
    } : null;
    // Indicar se tem endereço cadastrado
    const tem_endereco = enderecoFormatado !== null;
    const total_agendamentos = agendamentosFormatados.length;
    // Montar a resposta na ordem solicitada
    const mensagem = agendamentosFormatados.length > 0 ? 'Cliente encontrado com sucesso' : 'Cliente encontrado, mas sem agendamentos futuros';
    // Criar o objeto de resposta na ordem solicitada
    const responseData = {
      success: true,
      cliente_encontrado: true,
      message: mensagem,
      filial_id: filial_id,
      cliente_id: clienteData.cliente_id,
      nome_completo: clienteData.nome_completo,
      total_agendamentos: total_agendamentos,
      agendamentos: agendamentosFormatados,
      tem_endereco: tem_endereco,
      endereco: enderecoFormatado,
      acao_requerida: agendamentosFormatados.length > 0 ? 'consultar_agendamentos' : 'oferecer_agendamento'
    };
    // Remover campos vazios
    const removerCamposVazios = (obj)=>{
      if (!obj) return obj;
      Object.keys(obj).forEach((key)=>{
        if (obj[key] === null || obj[key] === undefined) {
          delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          removerCamposVazios(obj[key]);
        }
      });
      return obj;
    };
    const cleanResponseData = removerCamposVazios(responseData);
    return new Response(JSON.stringify(cleanResponseData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch {
    // Erro não tratado - retorna mensagem genérica
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
