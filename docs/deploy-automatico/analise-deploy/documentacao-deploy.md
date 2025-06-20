# Documentação do Sistema de Deploy

## Análise do Sistema de Deploy Atual

Com base na análise detalhada dos arquivos de configuração do Docker e do sistema de deploy automático, posso responder sua pergunta de forma direta:

**O projeto é refeito totalmente a cada atualização.**

Explico o porquê:

1. O sistema de deploy utiliza uma abordagem de containers imutáveis. Quando você faz um push no GitHub:

   - O GitHub Actions constrói uma nova imagem Docker completa usando o Dockerfile na raiz
   - Esta imagem é um ambiente isolado e completo com todo o código da aplicação
   - A imagem recebe tags específicas (incluindo o hash do commit e "latest")
   - A imagem é publicada no GitHub Container Registry (GHCR)

2. O Portainer, ao receber o webhook após o build no GitHub Actions:
   
   - Baixa a imagem mais recente (tag "latest")
   - Substitui completamente o container anterior pelo novo
   - Não há atualização incremental de arquivos individuais

Este processo garante uma consistência total do ambiente, já que cada nova versão do projeto é um container completamente novo e independente, construído do zero com todas as dependências, configurações e código da aplicação.

O Dockerfile em três estágios (base, builder e production) otimiza este processo, mantendo apenas os arquivos necessários na imagem final para produção, mas ainda assim é uma reconstrução completa a cada deploy.

Este modelo de implantação usando containers imutáveis é considerado uma boa prática, pois evita problemas de consistência e "drift" de configuração ao longo do tempo.

## Detalhamento técnico do processo atual de deploy

### Arquitetura completa do sistema de deploy

O sistema de deploy automático deste projeto segue um fluxo completo de CI/CD (Integração Contínua/Entrega Contínua) usando GitHub Actions, GitHub Container Registry e Portainer com Docker Swarm. Vamos detalhar cada componente e etapa do processo:

### 1. Gatilho inicial: push no GitHub

Quando você faz um push para a branch `master`, o GitHub detecta esta ação e inicia o workflow definido em `.github/workflows/docker-publish.yml`. Este arquivo configura todo o processo de automação através dos seguintes elementos:

```yaml
on:
  push:
    branches:
      - master
```

### 2. Processo de build da imagem Docker

#### 2.1. Multi-stage build no Dockerfile

O Dockerfile utiliza uma abordagem de "multi-stage build" com três estágios distintos:

- **Estágio base**: Prepara o ambiente Node.js e instala dependências
  ```dockerfile
  FROM node:18-alpine AS base
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  ```

- **Estágio builder**: Compila a aplicação Next.js para produção
  ```dockerfile
  FROM base AS builder
  WORKDIR /app
  COPY . .
  # Variáveis de ambiente injetadas durante o build
  ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
  RUN npm run build
  ```

- **Estágio production**: Cria a imagem final apenas com artefatos necessários
  ```dockerfile
  FROM node:18-alpine AS production
  # Apenas copia os arquivos compilados e configurações
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  # Configurações para usuário não-root por segurança
  USER nextjs
  ```

Esta abordagem em estágios reduz significativamente o tamanho da imagem final, pois exclui arquivos de desenvolvimento, dependências de build e código-fonte original.

#### 2.2. Camadas do Docker e sistema de cache

O Docker utiliza um sistema de camadas (layers) para construção de imagens. Cada comando no Dockerfile cria uma nova camada imutável. Quando você executa o docker-publish.yml:

1. O GitHub Actions configura o Docker Buildx:
   ```yaml
   - name: Set up Docker Buildx
     uses: docker/setup-buildx-action@v3
   ```

2. Utiliza mecanismos de cache para otimizar builds subsequentes:
   ```yaml
   cache-from: type=gha
   cache-to: type=gha,mode=max
   ```
   
   Isso permite que camadas não modificadas sejam reutilizadas de builds anteriores, acelerando o processo. No entanto, qualquer modificação em uma camada invalida todas as camadas subsequentes.

### 3. Publicação no GitHub Container Registry (GHCR)

O workflow realiza autenticação no GHCR usando:

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.repository_owner }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

E publica a imagem com metadados e tags:

```yaml
- name: Extract metadata for Docker
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
    tags: |
      type=sha,format=long
      type=raw,value=latest
```

Essas tags são fundamentais: 
- `type=sha,format=long` - Cria uma tag baseada no hash SHA do commit, permitindo apontar para versões específicas
- `type=raw,value=latest` - Cria a tag "latest" que sempre aponta para a versão mais recente

### 4. Orquestração com Docker Swarm e Portainer

O Portainer é uma interface para gerenciar containers e está configurado com Docker Swarm, que é a solução de orquestração de containers da Docker. Quando o webhook é acionado:

```yaml
- name: Trigger Portainer Webhook
  run: |
    curl -X POST ${{ secrets.PORTAINER_WEBHOOK_URL }}
```

#### 4.1. Funcionamento do webhook no Portainer

1. O Portainer recebe a requisição HTTP POST sem parâmetros
2. O sistema verifica a configuração da stack no arquivo `docker-compose.yml`
3. Detecta que a imagem está configurada como `ghcr.io/jonathanmkt/agendamentos:latest`
4. O Docker Swarm executa um `docker pull` da nova imagem com a tag `latest`
5. Cria um novo container baseado na imagem atualizada
6. Configura redes e roteamento conforme definido nas labels do Traefik:
   ```yaml
   labels:
    - traefik.enable=1
    - traefik.http.routers.agendamentos.rule=Host(`agendamento.virtuetech.com.br`)
   ```
7. Direciona o tráfego para o novo container
8. Remove o container antigo

#### 4.2. Gerenciamento de estado e volumes

É importante notar que no `docker-compose.yml` não há configuração de volumes persistentes. Isso significa que:

1. Quando um novo container é criado, ele começa com um filesystem limpo
2. Dados em runtime do container anterior não são preservados
3. Apenas dados armazenados externamente (como no Supabase) persistem entre deployments

### 5. Atualizações de ambiente e configuração

As variáveis de ambiente são injetadas durante o build da imagem Docker:

```yaml
build-args: |
  NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

E também durante a execução através do `docker-compose.yml`:

```yaml
environment:
  - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
```

# Alternativas para um modelo de deploy incremental

Para mudar para um modelo de deploy incremental onde apenas as partes modificadas sejam atualizadas, existem várias abordagens possíveis, cada uma com prós e contras:

## Opção 1: Deploy baseado em volumes persistentes

### Implementação:

1. Modificar o `docker-compose.yml` para utilizar volumes persistentes:

```yaml
services:
  agendamentos:
    image: ghcr.io/jonathanmkt/agendamentos:latest
    volumes:
      - app_code:/app
      # outros volumes conforme necessário
    # resto da configuração...

volumes:
  app_code:
    driver: local
```

2. Criar um script para atualização incremental que pode ser executado no container:

```bash
#!/bin/bash
# sync-code.sh
git fetch origin master
CHANGES=$(git diff --name-only HEAD origin/master)
if [ ! -z "$CHANGES" ]; then
  git pull origin master
  npm install  # apenas se package.json foi alterado
  npm run build # rebuild apenas se arquivos de código foram alterados
fi
```

3. Modificar o workflow para executar uma atualização incremental:

```yaml
- name: Update code on container
  run: |
    curl -X POST ${{ secrets.PORTAINER_WEBHOOK_EXEC_URL }} \
      -H "Content-Type: application/json" \
      -d '{"command": "/app/sync-code.sh"}'
```

### Prós:
- Apenas arquivos modificados são transferidos
- Velocidade de deploy potencialmente mais rápida
- Estado do sistema é preservado entre deployments

### Contras:
- Maior complexidade na configuração
- Risco de acúmulo de arquivos residuais ou estados inconsistentes
- Possíveis problemas de permissões de arquivos
- Depende de acesso ao container para executar comandos

## Opção 2: Sistema de deploy baseado em rsync/SCP

### Implementação:

1. Configurar SSH no container:

```dockerfile
# Adicionado ao Dockerfile
RUN apk add --no-cache openssh-server
RUN mkdir -p /root/.ssh
COPY deploy_key.pub /root/.ssh/authorized_keys
RUN chmod 600 /root/.ssh/authorized_keys
```

2. Modificar o workflow para usar rsync:

```yaml
- name: Setup SSH key
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.DEPLOY_KEY }}" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    
- name: Deploy changed files
  run: |
    # Encontrar arquivos alterados
    CHANGED_FILES=$(git diff --name-only HEAD~1)
    # Transferir apenas os arquivos alterados
    rsync -avz --files-from=<(echo "$CHANGED_FILES") . deploy@${{ secrets.DEPLOY_HOST }}:/app/
    # Trigger rebuild se necessário
    if [[ "$CHANGED_FILES" == *".next"* || "$CHANGED_FILES" == *"package.json"* ]]; then
      ssh deploy@${{ secrets.DEPLOY_HOST }} 'cd /app && npm run build'
    fi
```

### Prós:
- Sistema de deploy mais tradicional e conhecido
- Controle granular sobre quais arquivos são atualizados
- Possibilidade de rollback mais simples

### Contras:
- Necessidade de gerenciar chaves SSH
- Exposição do serviço SSH no container (risco de segurança)
- Complexidade adicional na configuração
- Necessidade de mais variáveis de ambiente e secrets

## Opção 3: Deploy usando Git Sparse Checkout

### Implementação:

1. Modificar o Dockerfile para incluir apenas o código necessário:

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache git

# Configuração do git para sparse checkout
RUN git init && \
    git remote add origin https://github.com/jonathanmkt/ValMarchiori.git && \
    git config core.sparseCheckout true
COPY .git/sparse-checkout /app/.git/info/sparse-checkout

# Restante da configuração...
```

2. Criar um script de atualização para o container:

```bash
#!/bin/bash
# update-sparse.sh
cd /app
git fetch origin master
CHANGED_DIRS=$(git diff --name-only --dirstat=files,0 HEAD origin/master | cut -c8-)

# Atualizar sparse-checkout para incluir apenas diretórios alterados
for DIR in $CHANGED_DIRS; do
  echo $DIR >> .git/info/sparse-checkout
done

git pull origin master
npm run build
```

3. Modificar o workflow para acionar este script via webhook.

### Prós:
- Controle preciso sobre quais partes do código são atualizadas
- Menor transferência de dados entre repositório e container
- Ideal para repositórios grandes com áreas independentes

### Contras:
- Configuração complexa do Git
- Potenciais problemas com dependências entre arquivos
- Necessidade de manter estrutura de diretórios consistente

## Considerações finais

Ao optar por um modelo incremental, é importante avaliar os seguintes aspectos:

1. **Consistência**: O modelo atual (reconstrução completa) garante consistência total, eliminando problemas de "drift" de configuração.

2. **Complexidade x Benefício**: Os ganhos de performance precisam justificar a complexidade adicional.

3. **Segurança**: Qualquer solução incremental adiciona pontos de exposição ao sistema.

4. **Manutenção**: Sistemas incrementais requerem monitoramento e manutenção periódica para evitar problemas acumulativos.

Recomendo começar com a abordagem de volumes persistentes (Opção 1) por oferecer o melhor equilíbrio entre benefícios e complexidade para um projeto Next.js com Docker Swarm, considerando que é possível configurar scripts de manutenção periódica para evitar problemas de consistência a longo prazo.
