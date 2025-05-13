# Comparativo entre Git e Supabase CLI: Um Guia Didático

Este comparativo visa facilitar o entendimento do Supabase CLI para desenvolvedores já familiarizados com Git, mostrando equivalências conceituais entre os dois sistemas.

## `git add .`

**O que o Git faz:**

Adiciona todas as alterações de arquivos do diretório atual para a área de staging, preparando-os para serem commitados. Isso não altera o repositório, apenas marca quais alterações serão incluídas no próximo commit.

**Equivalente no Supabase CLI:**

`bashnpx supabase db diff --file migrations/$(date +%Y%m%d%H%M%S)_nome_da_migracao.sql`

**Explicação:**

- Este comando detecta todas as alterações feitas no banco de dados local desde o último estado conhecido
- Gera um arquivo de migração com as alterações, semelhante a como o Git prepara arquivos para commit
- O arquivo é colocado na pasta `migrations/` com timestamp, mas ainda não foi aplicado ao banco remoto
- Como no Git, é uma etapa preparatória que não afeta o ambiente remoto

## `git commit -m "Nome da Atualização"`

**O que o Git faz:**

Salva as alterações que foram adicionadas à área de staging, criando um ponto na história do projeto com uma mensagem descritiva. O commit é salvo apenas localmente.

**Equivalente no Supabase CLI:**

`bash*# Não existe um equivalente direto, mas conceitualmente seria:# 1. Revisar o arquivo de migração gerado*
nano supabase/migrations/[timestamp]_nome_da_migracao.sql

*# 2. Adicionar comentários ao arquivo para documentar a mudança*
-- Descrição: Nome da Atualização
-- Data: 2025-04-13
-- Autor: Seu Nome`

**Explicação:**

- O Supabase não tem um comando separado para "commitar" alterações
- O arquivo de migração gerado pelo `db diff` já contém as alterações
- A adição de comentários ao arquivo serve como documentação similar à mensagem de commit
- O timestamp no nome do arquivo funciona como um identificador da "revisão"

## `git push`

**O que o Git faz:**

Envia os commits locais para o repositório remoto, atualizando a branch remota com as alterações locais.

**Equivalente no Supabase CLI:**

`bashnpx supabase db push`

**Explicação:**

- Este comando envia as migrações pendentes para o banco de dados remoto
- Aplica apenas as migrações que ainda não foram executadas no ambiente remoto
- Registra cada migração aplicada na tabela `schema_migrations` do banco remoto
- Como o Git push, sincroniza as alterações do ambiente local com o remoto

## `git pull`

**O que o Git faz:**

Obtém as alterações do repositório remoto e mescla-as com o repositório local, trazendo seu ambiente local para o mesmo estado do remoto.

**Equivalente no Supabase CLI:**

`bashnpx supabase db pull`

**Explicação:**

- Este comando obtém o estado atual do esquema do banco de dados remoto
- Gera um arquivo de migração representando a estrutura remota
- Ao contrário do Git, não aplica automaticamente as alterações ao banco local
- Para aplicar as alterações obtidas, é necessário executar um comando adicional:
    
    `bashnpx supabase migration up`
    
    ou
    
    `bashnpx supabase db reset`
    

## `git merge`

**O que o Git faz:**

Combina alterações de diferentes branches, integrando linhas de desenvolvimento separadas.

**Equivalente no Supabase CLI:**

`bash*# Não existe um equivalente direto único, mas o processo seria:# 1. Obter alterações remotas*
npx supabase db pull

*# 2. Resolver conflitos manualmente (se existirem)*
nano supabase/migrations/[timestamp]_remote_schema.sql

*# 3. Aplicar alterações combinadas*
npx supabase db reset

*# 4. Gerar nova migração com estado combinado*
npx supabase db diff --file migrations/$(date +%Y%m%d%H%M%S)_merged_changes.sql

*# 5. Enviar ao remoto*
npx supabase db push`

**Explicação:**

- O Supabase CLI não tem um comando específico para merge automático
- O processo de merge é mais manual, exigindo revisão e resolução de conflitos
- Você precisa identificar diferenças, resolver conflitos e gerar uma nova migração
- Este fluxo é mais complexo porque bancos de dados têm restrições que arquivos de código não têm

## Comparação Conceitual Adicional

| Conceito Git | Equivalente Supabase | Observações |
| --- | --- | --- |
| Repositório | Banco de dados | Local onde toda a estrutura e histórico são armazenados |
| Branch | Não tem equivalente direto | Supabase não suporta nativamente múltiplas linhas de desenvolvimento paralelas |
| Staging area | Arquivo de migração | Área intermediária antes de confirmar mudanças |
| Commit | Arquivo de migração aplicado | Ponto na história do desenvolvimento |
| Clone | `supabase db pull` + `migration up` | Obter cópia completa do ambiente remoto |
| Stash | Não tem equivalente direto | Não há como "guardar temporariamente" alterações |
| Rebase | Não tem equivalente direto | Reescrever histórico é complexo em bancos de dados |
| Tag | Não tem equivalente nativo | Poderia ser simulado com comentários em migrações específicas |

## Conclusão

Enquanto o Git gerencia código-fonte como arquivos de texto, o Supabase CLI gerencia estruturas de banco de dados que têm restrições diferentes. O fluxo do Supabase é geralmente mais linear e menos flexível que o Git, mas os conceitos fundamentais de controle de versão permanecem: você desenvolve localmente, prepara alterações, documenta-as e sincroniza com um ambiente remoto.

A principal diferença é que bancos de dados têm dependências relacionais e restrições de integridade que tornam certas operações (como merges e branches) muito mais complexas do que com arquivos de texto plano.

---

# Clonando Projeto Remoto (Migration)

Após instalar o Supabase CLI e linkar o banco de dados local com o remoto, o primeiro comando que você deve executar para trazer o schema do banco de dados remoto para o local é:

`npx supabase db pull`

Este comando realiza as seguintes ações:

1. Conecta-se ao banco de dados remoto do Supabase.
2. Analisa a estrutura atual do banco de dados remoto (tabelas, colunas, índices, funções, etc.).
3. Gera um arquivo de migração SQL no diretório `supabase/migrations` do seu projeto local.
4. Este arquivo conterá todos os comandos SQL necessários para recriar a estrutura do banco de dados remoto localmente.

Após executar este comando `npx supabase db pull`  , você terá o schema do banco de dados remoto disponível localmente. No entanto, é importante notar que este comando não aplica automaticamente as alterações ao seu banco de dados local. Para aplicar as alterações, você precisará executar um dos dois comandos: 

`npx supabase migration up` ou `npx supabase db reset`

`npx supabase db reset`

**O que faz:**

- Destrói completamente o banco de dados local
- Recria o banco do zero
- Executa todas as migrações em ordem
- Executa o arquivo **`seed.sql`** para popular o banco com dados iniciais
- Redefine completamente o estado do banco

**Quando usar:**

- Quando você quer um ambiente local limpo, sem resquícios de dados antigos
- Ao iniciar um novo desenvolvimento ou feature
- Quando há muitas diferenças entre local e remoto
- Quando quer garantir que o banco local está 100% idêntico ao remoto em termos de esquema

**Exemplo de cenário:**

No início de um projeto ou quando você quer recomeçar com um ambiente limpo que reflete exatamente o schema remoto, inclusive com dados iniciais do seed.

`npx supabase migration up`

**O que faz:**

- Aplica somente as migrações pendentes que ainda não foram executadas localmente
- Mantém os dados existentes nas tabelas que não forem modificadas
- Executa as migrações em ordem cronológica (por timestamp)
- Registra cada migração aplicada na tabela **`schema_migrations`**

**Quando usar:**

- Quando você quer preservar dados existentes no banco local
- Em desenvolvimento contínuo, onde você adiciona novas migrações incrementalmente
- Quando apenas partes específicas do schema foram alteradas

**Exemplo de cenário:**

Se você já tem tabelas com dados no banco local e deseja adicionar apenas novas tabelas ou colunas do remoto, sem perder os dados existentes.

## **Resumo das Diferenças**

- **`migration up`**: Incremental, preserva dados existentes, aplica apenas novas migrações
- **`db reset`**: Destrutivo, limpa tudo, recria do zero, aplica todas as migrações e seed

Escolha com base na sua necessidade de preservar dados versus ter um ambiente totalmente limpo.

---

# Populando inicialmente o  Projeto Local com dados fictícios

Explicando detalhadamente como popular banco de dados Supabase local com dados fictícios após estabelecer o link entre os ambientes local e remoto.

## Contexto

Você já completou as seguintes etapas:

1. Instalou o Supabase CLI
2. Executou `supabase init` para criar a estrutura do projeto
3. Vinculou o projeto local ao remoto usando `supabase link`
4. Trouxe o esquema remoto para o local com `supabase db pull`
5. Aplicou o esquema localmente com `supabase migration up` ou `supabase db reset`

Agora, você precisa popular o banco local com dados fictícios para desenvolvimento e testes. Vamos fazer isso!

## Método 1: Usando o arquivo seed.sql (Recomendado)

Este é o método padrão e mais simples:

1. **Crie ou edite o arquivo seed.sql**:
    
    `bash*# Navegue até a pasta do projeto e abra o arquivo*
    nano supabase/seed.sql`
    
2. **Adicione instruções SQL para inserir dados fictícios**:
    
    `sql*-- Limpe dados existentes (opcional)*
    TRUNCATE TABLE users CASCADE;
    TRUNCATE TABLE products CASCADE;
    
    *-- Insira usuários fictícios*
    INSERT INTO users (id, name, email) VALUES 
    ('d0516eee-a32b-40e5-b840-17990f9a8d12', 'João Silva', 'joao@exemplo.com'),
    ('8b2d6f5d-c6b2-4525-a398-4d2e8759f5e3', 'Maria Oliveira', 'maria@exemplo.com'),
    ('3a7d5e2f-231a-4598-b40c-c3d73f9b1d9a', 'Pedro Santos', 'pedro@exemplo.com');
    
    *-- Insira produtos fictícios*
    INSERT INTO products (id, name, price, description) VALUES 
    ('f4d7e8c3-b2a1-4509-87d6-5e3f2a1b9c0d', 'Smartphone X', 999.99, 'Último modelo com câmera incrível'),
    ('e3c2d1b0-a9f8-47e6-b5d4-c3b2a1d0e9f8', 'Laptop Pro', 1499.99, 'Ideal para trabalho e jogos'),
    ('b1a0c9d8-e7f6-45d3-b2c1-a0d9e8f7c6b5', 'Fones Wireless', 199.99, 'Som cristalino e bateria de longa duração');
    
    *-- Adicione mais tabelas e dados conforme necessário...*`
    
3. **Aplique os dados fictícios**:
    
    `bashnpx supabase db reset`
    
    Este comando tem o seguinte efeito:
    
    - Recria o banco de dados local
    - Aplica todas as migrações
    - Executa o arquivo `seed.sql`
4. **Verifique se os dados foram inseridos corretamente**:
    
    `bashnpx supabase db connect
    
    *# No prompt do PostgreSQL:*
    SELECT * FROM users;
    SELECT * FROM products;`
    

## Método 2: Usando script de geração de dados (Para dados mais complexos)

Se você precisa de muitos dados ou dados mais realistas:

1. **Crie um script para gerar o arquivo seed.sql**:
    
    `bash*# Instale as dependências necessárias*
    npm install @faker-js/faker fs
    
    *# Crie o arquivo de script*
    touch scripts/generate-seed.js`
    
2. **Adicione o código para gerar dados fictícios**:
    
    `javascript*// scripts/generate-seed.js*
    const { faker } = require('@faker-js/faker');
    const fs = require('fs');
    
    *// Configurações*
    const USER_COUNT = 50;
    const PRODUCT_COUNT = 100;
    const ORDER_COUNT = 200;
    
    *// Iniciar arquivo SQL*
    let sqlContent = `-- Arquivo seed.sql gerado automaticamente em ${new Date().toISOString()}
    
    -- Limpar dados existentes
    TRUNCATE TABLE users CASCADE;
    TRUNCATE TABLE products CASCADE;
    TRUNCATE TABLE orders CASCADE;
    
    `;
    
    *// Gerar usuários*
    sqlContent += `-- Inserir usuários\nINSERT INTO users (id, name, email, phone) VALUES\n`;
    
    const userIds = [];
    for (let i = 0; i < USER_COUNT; i++) {
      const id = faker.string.uuid();
      const name = faker.person.fullName();
      const email = faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] });
      const phone = faker.phone.number();
      
      userIds.push(id);
      sqlContent += `('${id}', '${name}', '${email}', '${phone}')`;
      sqlContent += i < USER_COUNT - 1 ? ',\n' : ';\n\n';
    }
    
    *// Gerar produtos*
    sqlContent += `-- Inserir produtos\nINSERT INTO products (id, name, price, description) VALUES\n`;
    
    const productIds = [];
    for (let i = 0; i < PRODUCT_COUNT; i++) {
      const id = faker.string.uuid();
      const name = faker.commerce.productName();
      const price = faker.commerce.price();
      const description = faker.commerce.productDescription().replace(/'/g, "''");
      
      productIds.push(id);
      sqlContent += `('${id}', '${name}', ${price}, '${description}')`;
      sqlContent += i < PRODUCT_COUNT - 1 ? ',\n' : ';\n\n';
    }
    
    *// Gerar pedidos*
    sqlContent += `-- Inserir pedidos\nINSERT INTO orders (id, user_id, product_id, quantity, order_date) VALUES\n`;
    
    for (let i = 0; i < ORDER_COUNT; i++) {
      const id = faker.string.uuid();
      const user_id = userIds[Math.floor(Math.random() * userIds.length)];
      const product_id = productIds[Math.floor(Math.random() * productIds.length)];
      const quantity = faker.number.int({ min: 1, max: 5 });
      const order_date = faker.date.past({ years: 1 }).toISOString();
      
      sqlContent += `('${id}', '${user_id}', '${product_id}', ${quantity}, '${order_date}')`;
      sqlContent += i < ORDER_COUNT - 1 ? ',\n' : ';\n\n';
    }
    
    *// Salvar o arquivo SQL*
    fs.writeFileSync('supabase/seed.sql', sqlContent);
    console.log('Arquivo seed.sql gerado com sucesso!');`
    
3. **Execute o script para gerar o arquivo seed.sql**:
    
    `bashnode scripts/generate-seed.js`
    
4. **Aplique os dados gerados**:
    
    `bashnpx supabase db reset`
    

## Método 3: Inserindo dados diretamente via SQL (Para testes rápidos)

Se você precisa apenas de alguns dados para testes rápidos:

1. **Conecte-se ao banco de dados local**:
    
    `bashnpx supabase db connect`
    
2. **Execute comandos SQL para inserir dados diretamente**:
    
    `sqlINSERT INTO users (name, email) VALUES ('Teste', 'teste@exemplo.com');
    INSERT INTO products (name, price) VALUES ('Produto Teste', 10.99);
    
    *-- Verifique se os dados foram inseridos*
    SELECT * FROM users;
    SELECT * FROM products;`
    

## Dicas Importantes

1. **Adaptação às suas tabelas**: Certifique-se de adaptar os exemplos SQL para corresponder exatamente à estrutura das suas tabelas.
2. **Relacionamentos**: Mantenha a integridade referencial criando primeiro as tabelas pai e depois as tabelas filho.
3. **IDs**: Se você usa UUID, utilize a função `gen_random_uuid()` ou gere UUIDs válidos.
4. **Sequências**: Se suas tabelas usam sequências para IDs numéricos, você pode precisar ajustar as sequências após inserir dados:
    
    `sqlSELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`
    
5. **Desenvolvimento contínuo**: Atualize seu `seed.sql` conforme seu schema evolui para manter os dados de teste úteis.

---

# Adicionando Funcionalidades (Ex.: Perfil de Usuário)

## 1. Usuário cria uma nova funcionalidade

O usuário faz alterações no banco de dados local. Por exemplo:

`bash*# Conectar ao banco de dados local*
npx supabase db connect

*# Executar comandos SQL para adicionar a nova funcionalidade*
SQL> CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

SQL> CREATE TRIGGER set_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

SQL> ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

SQL> CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

SQL> CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

SQL> \q`

## 2. Preparar alterações para migração (equivalente a `git add .`)

`bash*# Gerar um arquivo de migração com as alterações*
npx supabase db diff --file migrations/$(date +%Y%m%d%H%M%S)_add_user_profiles.sql`

Este comando detecta as alterações feitas no banco de dados local e cria um arquivo de migração, similar a como o `git add .` prepara os arquivos para commit.

## 3. Revisar e documentar alterações (equivalente a `git commit -m "..."`)

`bash*# Abrir o arquivo de migração para revisão e adição de comentários*
nano supabase/migrations/[timestamp]_add_user_profiles.sql`

Adicione comentários explicativos no topo do arquivo, similar a uma mensagem de commit:

`sql*-- Migration: Add User Profiles-- Description: Adds user_profiles table with RLS policies-- Author: [Seu Nome]-- Date: 2025-04-13-- Resto do conteúdo gerado automaticamente...*`

Não há um comando específico para "commitar" no Supabase CLI. A revisão e documentação manual do arquivo de migração serve como o equivalente conceitual de um commit.

## 4. Enviar alterações para o ambiente remoto (equivalente a `git push`)

`bash*# Aplicar as migrações ao banco de dados remoto*
npx supabase db push`

Este comando envia e aplica as migrações pendentes (incluindo a que acabamos de criar) ao banco de dados remoto do Supabase.

## 5. Verificar se as alterações foram aplicadas com sucesso

`bash*# Conectar ao banco de dados remoto*
npx supabase db connect --db-url "sua_url_de_conexao_remota"

*# Verificar se a nova tabela foi criada*
SQL> \dt user_profiles

*# Verificar a estrutura da tabela*
SQL> \d user_profiles

*# Verificar as políticas RLS*
SQL> SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

SQL> \q`

## Fluxo completo em comandos

Aqui está o fluxo completo em uma sequência de comandos:

`bash*# 1. Fazer alterações (presumindo que você já fez as alterações no banco local)# 2. Gerar migração*
npx supabase db diff --file migrations/$(date +%Y%m%d%H%M%S)_add_user_profiles.sql

*# 3. Revisar e documentar migração*
nano supabase/migrations/[timestamp]_add_user_profiles.sql

*# 4. Enviar alterações para o remoto*
npx supabase db push

*# 5. Verificar alterações (opcional)*
npx supabase db connect --db-url "sua_url_de_conexao_remota"
*# Execute os comandos SQL de verificação mencionados acima*`

Este fluxo no Supabase CLI corresponde conceitualmente ao fluxo Git de criar uma nova funcionalidade, preparar as alterações, commitar com uma descrição e fazer push para o repositório remoto. A principal diferença é que, no Supabase, você está gerenciando estruturas de banco de dados em vez de arquivos de código, e o processo de "commit" é implícito na criação e documentação do arquivo de migração.

---

# Usando `supabase gen types` para TypeScript

Para acessar o schema de uma tabela específica do seu projeto Supabase local via CLI com o propósito de criar schemas para o frontend, você tem várias opções excelentes:

O método mais direto e recomendado para desenvolvimento frontend:

`bash*# Gerar tipos TypeScript para todo o banco*
npx supabase gen types typescript --local > src/types/database.ts

*# Opcionalmente, filtrar por schema específico*
npx supabase gen types typescript --local --schema public > src/types/public-schema.ts`

Este comando gera definições de tipos TypeScript que você pode importar diretamente no seu código frontend.

## 2. Inspecionar estrutura específica via psql

Para visualizar o schema de uma tabela específica:

`bash*# Conectar ao banco local*
npx supabase db connect

*# No prompt do PostgreSQL, use:*
\d nome_da_tabela

*# Para saída em formato mais estruturado:*
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'nome_da_tabela';

*# Para exportar para um arquivo:*
\o schema_tabela.txt
\d nome_da_tabela
\o`

## 3. Exportar schema em formato JSON

Para obter uma representação mais amigável para frontend:

`bashnpx supabase db connect -c "
SELECT 
  json_agg(
    json_build_object(
      'column_name', column_name,
      'data_type', data_type,
      'is_nullable', is_nullable,
      'column_default', column_default
    )
  )
FROM information_schema.columns 
WHERE table_name = 'nome_da_tabela'
" > tabela_schema.json`

## 4. Script de automação para seu workflow

Crie um script utilitário para facilitar seu desenvolvimento com IA:

`javascript*// generate-schema.js*
const { execSync } = require('child_process');
const fs = require('fs');

const tableName = process.argv[2];
if (!tableName) {
  console.error('Por favor, forneça um nome de tabela');
  process.exit(1);
}

try {
  *// Executar consulta e salvar resultado*
  const result = execSync(`npx supabase db connect -c "
    SELECT 
      json_agg(
        json_build_object(
          'column_name', column_name,
          'data_type', data_type,
          'is_nullable', is_nullable = 'YES',
          'column_default', column_default
        )
      )
    FROM information_schema.columns 
    WHERE table_name = '${tableName}'
  "`).toString();

  *// Parsear o resultado JSON*
  const schema = JSON.parse(result);
  
  *// Salvar em arquivo*
  fs.writeFileSync(`schemas/${tableName}.json`, JSON.stringify(schema, null, 2));
  
  console.log(`Schema para tabela '${tableName}' gerado com sucesso em schemas/${tableName}.json`);
} catch (error) {
  console.error(`Erro ao gerar schema: ${error.message}`);
}`

Use o script:

`bashnode generate-schema.js nome_da_tabela`

## 5. Usar o endpoint de metadados do PostgREST

O Supabase local expõe um endpoint de metadados que pode ser consultado:

`bashcurl http://localhost:54321/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0 | jq '.definitions.nome_da_tabela.properties'`

## Dica para integração com IA no desenvolvimento

Para trabalhar eficientemente com IA no desenvolvimento, você pode criar um comando personalizado que:

1. Extrai o schema
2. Formata-o adequadamente
3. Automaticamente copia para a área de transferência para colar em prompts de IA

`bash*# Adicione ao seu .bashrc ou .zshrc*
function schema-for-ai() {
  npx supabase db connect -c "
  SELECT 
    json_agg(
      json_build_object(
        'column_name', column_name,
        'data_type', data_type,
        'is_nullable', is_nullable = 'YES',
        'column_default', column_default
      )
    )
  FROM information_schema.columns 
  WHERE table_name = '$1'
  " | jq -r | xclip -selection clipboard  *# Para Linux (instale xclip)# Para macOS, use: | pbcopy*

  echo "Schema for table '$1' copied to clipboard, ready to paste into AI prompt!"
}

*# Uso: schema-for-ai nome_da_tabela*`

Estas abordagens permitem que você acesse facilmente o schema das tabelas locais para desenvolvimento frontend, especialmente quando trabalhando com assistência de IA.

---