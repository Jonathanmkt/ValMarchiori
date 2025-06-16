import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from './cors.ts';

// Interface para o serviço formatado
interface ServicoFormatado {
  nome_servico: string;
  servico_code: string;
}

// Interface para o grupo de serviços
interface GrupoServicos {
  tipo_do_servico: string;
  servicos: ServicoFormatado[];
}

// Interface para a resposta completa
interface RespostaServicos {
  servicos: GrupoServicos[];
}

// Função principal
export async function listaServicos(req: Request) {
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

    const url = new URL(req.url);
    const filialId = url.searchParams.get('filial_id');

    // Validação de parâmetros
    if (!filialId) {
      return new Response(
        JSON.stringify({ error: 'Parâmetro filial_id é obrigatório' }),
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

    // 1. Busca o UUID da filial
    const { data: filial, error: erroBuscarFilial } = await supabase
      .from('filiais')
      .select('filial_uuid')
      .eq('filial_id', filialId)
      .single();

    if (erroBuscarFilial || !filial) {
      console.error('Filial não encontrada:', erroBuscarFilial);
      return new Response(
        JSON.stringify({ error: 'Filial não encontrada' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 2. Busca os serviços da filial que estão ativos e disponíveis
    const { data: servicos, error: erroBuscarServicos } = await supabase
      .from('filiais_servicos')
      .select(`
        ativo,
        servicos:servico_id (
          nome_servico,
          servico_code,
          tipo_do_servico,
          disponivel
        )
      `)
      .eq('filial_uuid', filial.filial_uuid)
      .eq('ativo', true)
      .eq('servicos.disponivel', true);

    if (erroBuscarServicos) {
      console.error('Erro ao buscar serviços:', erroBuscarServicos);
      throw new Error('Erro ao buscar serviços');
    }

    // 3. Processa e formata os resultados
    const servicosPorTipo: { [tipo: string]: ServicoFormatado[] } = {};

    servicos?.forEach(item => {
      if (item.servicos) {
        const servico = item.servicos;
        const tipo = servico.tipo_do_servico?.toLowerCase() || 'outros';
        
        if (!servicosPorTipo[tipo]) {
          servicosPorTipo[tipo] = [];
        }
        
        servicosPorTipo[tipo].push({
          nome_servico: servico.nome_servico,
          servico_code: servico.servico_code
        });
      }
    });

    // 4. Formata a resposta final
    const resultado: RespostaServicos = {
      servicos: Object.entries(servicosPorTipo)
        .sort(([tipoA], [tipoB]) => tipoA.localeCompare(tipoB))
        .map(([tipo, itens]) => ({
          tipo_do_servico: tipo,
          servicos: itens.sort((a, b) => 
            a.nome_servico.localeCompare(b.nome_servico)
          )
        }))
    };

    // 5. Retorna o resultado como JSON
    return new Response(
      JSON.stringify(resultado, null, 2),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json; charset=utf-8'
        } 
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
  return await listaServicos(req);
});
