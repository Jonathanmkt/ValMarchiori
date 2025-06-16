import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Valida o formato do CEP
function validarCEP(cep: string): { valido: boolean, erro?: string } {
  if (!cep) return { valido: true }; // CEP é opcional
  
  const cepLimpo = cep.replace(/\D/g, '');
  if (!/^\d{8}$/.test(cepLimpo)) {
    return {
      valido: false,
      erro: 'CEP deve conter 8 dígitos numéricos'
    };
  }
  return { valido: true };
}

// Função principal
async function atualizaEndereco(req: Request) {
  // Trata requisições OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Aceita apenas POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Método não permitido. Use POST.'
      }), {
        status: 405,
        headers: corsHeaders
      });
    }

    const url = new URL(req.url);
    const params = url.searchParams;

    // Parâmetros obrigatórios
    const cliente_id = params.get('cliente_id');
    const filial_id = params.get('filial_id');

    // Parâmetros opcionais de endereço
    const endereco = {
      logradouro: params.get('logradouro') || undefined,
      numero: params.get('numero') || undefined,
      complemento: params.get('complemento') || undefined,
      bairro: params.get('bairro') || undefined,
      cidade: params.get('cidade') || undefined,
      cep: params.get('cep') ? params.get('cep')?.replace(/\D/g, '') : undefined,
      uf: params.get('uf') || undefined
    };

    // Validação de parâmetros obrigatórios
    if (!cliente_id || !filial_id) {
      return new Response(JSON.stringify({
        error: 'Parâmetros obrigatórios ausentes',
        required: ['cliente_id', 'filial_id']
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Valida o CEP se fornecido
    if (endereco.cep) {
      const validacaoCEP = validarCEP(endereco.cep);
      if (!validacaoCEP.valido) {
        return new Response(JSON.stringify({
          error: 'CEP inválido',
          details: validacaoCEP.erro
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
    }

    // Inicializa o cliente Supabase
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({
        error: 'Configuração do Supabase ausente'
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. Buscar o UUID da filial
    const { data: filial, error: filialError } = await supabase
      .from('filiais')
      .select('filial_uuid')
      .eq('filial_id', filial_id)
      .single();

    if (filialError || !filial) {
      return new Response(JSON.stringify({
        error: 'Filial não encontrada'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    const filial_uuid = filial.filial_uuid;

    // 2. Buscar o cliente desambiguando pela filial
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('cliente_uuid, endereco')
      .eq('cliente_id', cliente_id);

    if (clientesError || !clientes || clientes.length === 0) {
      return new Response(JSON.stringify({
        error: 'Cliente não encontrado'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    let cliente_uuid: string;
    let endereco_atual: Record<string, any> = {};

    // Se houver apenas um cliente, usa ele
    if (clientes.length === 1) {
      cliente_uuid = clientes[0].cliente_uuid;
      endereco_atual = clientes[0].endereco || {};
    } 
    // Se houver mais de um cliente, desambiguar pela filial
    else {
      const { data: filialCliente, error: fcError } = await supabase
        .from('filiais_clientes')
        .select('cliente_id')
        .eq('filial_id', filial_uuid)
        .in('cliente_id', clientes.map(c => c.cliente_uuid))
        .single();

      if (fcError || !filialCliente) {
        return new Response(JSON.stringify({
          error: 'Cliente não encontrado na filial especificada',
          details: 'Existem múltiplos clientes com este ID e nenhum está associado à filial informada'
        }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const clienteEncontrado = clientes.find(c => c.cliente_uuid === filialCliente.cliente_id);
      if (!clienteEncontrado) {
        return new Response(JSON.stringify({
          error: 'Erro ao localizar os dados do cliente',
          details: 'Cliente encontrado na filial mas não na tabela de clientes'
        }), {
          status: 500,
          headers: corsHeaders
        });
      }

      cliente_uuid = clienteEncontrado.cliente_uuid;
      endereco_atual = clienteEncontrado.endereco || {};
    }


    // 2. Verifica se todos os campos do endereço estão vazios
    const camposPreenchidos = Object.values(endereco).some(valor => valor !== undefined && valor !== '');
    
    if (!camposPreenchidos) {
      // Se todos os campos estiverem vazios, limpa o endereço
      const { error: updateError } = await supabase
        .from('clientes')
        .update({
          endereco: null,
          data_atualizacao: new Date().toISOString()
        })
        .eq('cliente_uuid', cliente_uuid);

      if (updateError) {
        return new Response(JSON.stringify({
          error: 'Erro ao limpar o endereço',
          details: updateError.message
        }), {
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Endereço removido com sucesso',
        endereco: null
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // 3. Atualiza o endereço
    const enderecoAtualizado = {
      ...endereco_atual,
      ...endereco
    };

    const { data: clienteAtualizado, error: updateError } = await supabase
      .from('clientes')
      .update({
        endereco: enderecoAtualizado,
        data_atualizacao: new Date().toISOString()
      })
      .eq('cliente_uuid', cliente_uuid)
      .select('endereco')
      .single();

    if (updateError || !clienteAtualizado) {
      return new Response(JSON.stringify({
        error: 'Erro ao atualizar o endereço',
        details: updateError?.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Endereço atualizado com sucesso',
      endereco: clienteAtualizado.endereco
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Erro interno do servidor',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Handler para o Deno.serve
Deno.serve(async (req) => {
  return await atualizaEndereco(req);
});
