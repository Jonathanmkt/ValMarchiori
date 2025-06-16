const fetch = require('node-fetch');
require('dotenv').config();

// URL da função Edge
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
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(novoEndereco)
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error;
  }
}

// Executa o teste
console.log('Iniciando teste de atualização de endereço...');
testaAtualizaEndereco()
  .then(() => console.log('Teste concluído!'))
  .catch(error => console.error('Erro no teste:', error));
