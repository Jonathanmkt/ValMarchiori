# Checklist de Implementação do Schema

Este documento serve como guia passo a passo para implementação da nova estrutura de banco de dados para o sistema de agendamento de serviços.


## Camada 1: Tabelas Fundamentais (Sem Dependências)

### Empresas
- [x] Verificar se já existe
- [x] Caso exista, modificar conforme abaixo
- [ ] Caso não exista, criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS empresas (
    empresa_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_empresa TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

### Planos
- [x] Criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS planos (
    plano_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_plano TEXT NOT NULL,
    descricao TEXT,
    valor_mensal DECIMAL(10, 2),
    max_filiais INTEGER DEFAULT 1,
    max_colaboradores INTEGER DEFAULT 5,
    max_servicos INTEGER DEFAULT 20,
    recursos_ativos JSONB DEFAULT '{}',
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

## Camada 2: Tabelas com Dependência Simples

### Filiais
- [x] Verificar se já existe
- [ ] Caso exista, modificar conforme abaixo
- [x] Caso não exista, criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS filiais (
    filial_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(empresa_id) ON DELETE CASCADE,
    nome_filial TEXT NOT NULL,
    endereco_completo TEXT,
    telefone TEXT,
    email_contato TEXT,
    chatwoot_account_id INTEGER UNIQUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

### Usuários do Sistema
- [x] Criar tabela (base para administradores e colaboradores):
  ```sql
  CREATE TABLE IF NOT EXISTS usuarios_sistema (
    usuario_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nome_completo TEXT NOT NULL,
    senha_hash TEXT, -- Armazenar apenas referência, autenticação pelo Supabase
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
    ultimo_login TIMESTAMP WITH TIME ZONE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

## Camada 3: Tabelas com Dependências de Segundo Nível

### Administradores
- [x] Criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS administradores (
    administrador_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios_sistema(usuario_id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES empresas(empresa_id) ON DELETE CASCADE,
    filial_id UUID REFERENCES filiais(filial_id) ON DELETE CASCADE, -- NULL para admin corporativo
    is_principal BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (empresa_id, filial_id, is_principal) -- Apenas um admin principal por filial
  );
  ```

### Colaboradores
- [x] Criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS colaboradores (
    colaborador_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios_sistema(usuario_id) ON DELETE CASCADE,
    filial_id UUID NOT NULL REFERENCES filiais(filial_id) ON DELETE CASCADE,
    cargo TEXT,
    especialidade TEXT,
    chatwoot_assignee_id INTEGER,
    nivel_permissao TEXT DEFAULT 'basico' CHECK (nivel_permissao IN ('basico', 'intermediario', 'avancado')),
    is_administrador BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias', 'licenca')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

### Serviços
- [x] Verificar se já existe
- [x] Caso exista, modificar conforme abaixo
- [x] Caso não exista, criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS servicos (
    servico_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filial_id UUID NOT NULL REFERENCES filiais(filial_id) ON DELETE CASCADE,
    servico_code TEXT UNIQUE NOT NULL, -- Código para referência pela IA
    nome_servico TEXT NOT NULL,
    tipo_do_servico TEXT,
    descricao TEXT,
    duracao_minutos INTEGER DEFAULT 60,
    valor DECIMAL(10, 2),
    disponivel_delivery BOOLEAN DEFAULT FALSE,
    necessita_preparo BOOLEAN DEFAULT FALSE,
    instrucoes_preparo TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

### Agente de IA
- [x] Criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS agente_ia (
    agente_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filial_id UUID NOT NULL REFERENCES filiais(filial_id) ON DELETE CASCADE,
    system_message TEXT,
    persona TEXT,
    objetivo TEXT,
    frases_apresentacao TEXT[],
    frases_despedida TEXT[],
    instrucoes_especiais TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (filial_id) -- Um agente por filial
  );
  ```

## Camada 4: Tabelas com Dependências de Terceiro Nível

### Clientes
- [x] Verificar se já existe (tabela "usuarios")
- [x] Caso exista, migrar e remodelar conforme abaixo
- [x] Caso não exista, criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS clientes (
    cliente_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo TEXT NOT NULL,
    identifier TEXT NOT NULL, -- Normalizado do WhatsApp
    email TEXT,
    telefone TEXT,
    data_nascimento DATE,
    observacoes TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

### Filiais Clientes (Mapeamento N:N)
- [x] Criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS filiais_clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filial_id UUID NOT NULL REFERENCES filiais(filial_id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (filial_id, cliente_id) -- Evita duplicação
  );
  ```

### Endereços
- [x] Verificar se já existe
- [x] Caso exista, modificar conforme abaixo
- [x] Caso não exista, criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS enderecos (
    endereco_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL CHECK (ordem BETWEEN 1 AND 3), -- Numeração para IA
    nome_do_endereco TEXT NOT NULL, -- Ex: "Casa", "Trabalho"
    logradouro TEXT NOT NULL,
    numero INTEGER,
    complemento TEXT,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT,
    cep TEXT NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (cliente_id, ordem) -- Garante ordem única por cliente
  );
  ```

## Camada 5: Tabelas com Dependências Complexas

### Colaboradores Serviços (Mapeamento N:N)
- [x] Criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS colaboradores_servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colaborador_id UUID NOT NULL REFERENCES colaboradores(colaborador_id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES servicos(servico_id) ON DELETE CASCADE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (colaborador_id, servico_id) -- Evita duplicação
  );
  ```

### Agendamentos
- [x] Verificar se já existe
- [x] Caso exista, modificar conforme abaixo
- [x] Caso não exista, criar tabela:
  ```sql
  CREATE TABLE IF NOT EXISTS agendamentos (
    agendamento_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agendamento_code TEXT UNIQUE, -- Código para referência pela IA
    filial_id UUID NOT NULL REFERENCES filiais(filial_id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    colaborador_id UUID REFERENCES colaboradores(colaborador_id) ON DELETE SET NULL,
    servico_id UUID NOT NULL REFERENCES servicos(servico_id) ON DELETE CASCADE,
    endereco_id UUID REFERENCES enderecos(endereco_id) ON DELETE SET NULL, -- Para delivery
    data DATE NOT NULL,
    horario TIME WITHOUT TIME ZONE NOT NULL,
    turno TEXT NOT NULL CHECK (turno IN ('manha', 'tarde', 'noite')),
    status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'concluido', 'cancelado')),
    tipo TEXT NOT NULL CHECK (tipo IN ('presencial', 'delivery')),
    observacoes TEXT,
    disponivel BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```




## Migração de Dados

- [x] Migrar dados da tabela "usuarios" para "clientes"
- [x] Migrar dados da tabela "agendamentos" existente
- [ ] Migrar dados da tabela "enderecos" existente

## Testes

- [ ] Testar relações entre tabelas
- [ ] Testar as políticas de RLS
- [ ] Testar as Edge Functions

## Finalizando

- [ ] Remover tabelas depreciadas (opcional, após migração bem-sucedida)
- [ ] Documentar o schema final
- [ ] Criar diagrama ER atualizado
