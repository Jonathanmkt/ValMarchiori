import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// URL da função Edge (substitua pela URL correta da sua função)
const EDGE_FUNCTION_URL = 'https://lhgnhwmslmaafcgvtddg.supabase.co/functions/v1/atualiza-endereco';

// Dados do endereço para atualização
const novoEndereco = {
  cep: '66666666',
  logradouro: 'Avenida Paulista',
  numero: '1000',
  complemento: 'Sala 101',
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  uf: 'SP'
};

// Função para testar a atualização de endereço
async function testaAtualizaEndereco() {
  // Parâmetros da URL
  const params = new URLSearchParams({
    cliente_id: '5522988341238',
    filial_id: '1'
  });

  // URL completa com parâmetros
  const url = `${EDGE_FUNCTION_URL}?${params.toString()}`;

  try {
    console.log('Enviando requisição para:', url);
    console.log('Dados do endereço:', novoEndereco);

    // Faz a requisição POST
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify(novoEndereco)
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    
    return data;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error;
  }
}

// Executa o teste
if (import.meta.main) {
  // Verifica se a chave de API está definida
  if (!Deno.env.get('SUPABASE_ANON_KEY')) {
    console.error('Erro: A variável de ambiente SUPABASE_ANON_KEY não está definida');
    console.log('Execute o script com: deno run --allow-net --allow-env testes/testa-atualiza-endereco.ts');
    Deno.exit(1);
  }

  console.log('Iniciando teste de atualização de endereço...');
  await testaAtualizaEndereco();
}
