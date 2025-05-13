# Guia Definitivo: Deploy de Aplicações Next.js com Tailwind no Portainer via CI/CD

Este guia completo mostrará como configurar um fluxo de CI/CD automatizado para sua aplicação Next.js com Tailwind CSS, permitindo deploy contínuo após cada commit no GitHub.

## Criação de um Dockerfile Otimizado

Crie um arquivo `Dockerfile` na raiz do seu projeto utilizando multi-stage builds para otimizar a imagem:

`text# Stage 1: Dependências e base
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
RUN apk add --no-cache libc6-compat

# Stage 2: Construção para produção
FROM base AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Ambiente de produção
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copiar apenas arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
CMD ["npm", "run", "start"]`

Este Dockerfile está otimizado para:

- Minimizar o tamanho da imagem final
- Utilizar camadas de cache eficientemente
- Executar a aplicação com um usuário não-root para segurança

## Criação do Docker Compose para Portainer

Crie um arquivo `docker-compose.yml` baseado no exemplo fornecido:

`textversion: '3.8'
services:
  nextjs-app:
    image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${IMAGE_TAG:-latest}
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=https://lhgnhwmslmaafcgvtddg.supabase.co
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZ25od21zbG1hYWZjZ3Z0ZGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTUzNjcsImV4cCI6MjA2MTE5MTM2N30.pZNudhWRyKL6zxGYtwN1fGyXj9nLbDBvnWMG8RErrZo
      - SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZ25od21zbG1hYWZjZ3Z0ZGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYxNTM2NywiZXhwIjoyMDYxMTkxMzY3fQ.oJja85W0PBZOdsJFMReE_6rJAp833lQaPnibwG12ij4
    networks:
      - Singanet
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
      labels:
        - traefik.enable=true
        - traefik.http.routers.nextjs-app.rule=Host(`valmarchiori.virtuetech.com.br`)
        - traefik.http.routers.nextjs-app.entrypoints=websecure
        - traefik.http.routers.nextjs-app.tls.certresolver=letsencryptresolver
        - traefik.http.services.nextjs-app.loadbalancer.server.port=3000
        - traefik.http.services.nextjs-app.loadbalancer.passHostHeader=true
        - traefik.http.routers.nextjs-app.service=nextjs-app

networks:
  Singanet:
    external: true`

**Importante:** O domínio configurado para esta aplicação será `valmarchiori.virtuetech.com.br`. As configurações do Traefik já foram validadas no ambiente de produção com as seguintes definições:

- Network: Singanet (external)
- Recursos: CPU limit 0.5, Memory limit 512M
- Traefik:
  - entrypoint: websecure
  - certresolver: letsencryptresolver
- Deploy constraints: node.role == manager

## Escolha do Registry de Contêineres

Você tem duas opções principais para armazenar suas imagens Docker:

## Opção 1: GitHub Container Registry (GHCR)

**Vantagens:**

- Integração nativa com GitHub Actions
- Armazenamento generoso para repositórios públicos
- Controle de acesso vinculado às permissões do GitHub

## onfiguração do GitHub Actions para CI/CD

Crie o diretório `.github/workflows/` e o arquivo `deploy.yml` com o seguinte conteúdo:

`textname: Deploy to Portainer

on:
  push:
    branches:
      - main  # ou master, dependendo da sua branch principal

env:
  DOCKER_REGISTRY: ghcr.io
  DOCKER_IMAGE: Jonathanmkt/ValMarchiori

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v1
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set image tag
        id: set_tag
        run: |
          echo "IMAGE_TAG=sha-$(git rev-parse --short HEAD)" >> $GITHUB_ENV
          echo "DOCKER_IMAGE_URI=${{ env.DOCKER_REGISTRY }}/${{ env.DOCKER_IMAGE }}" >> $GITHUB_ENV

      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./Dockerfile
          push: true
          target: production
          tags: |
            ${{ env.DOCKER_IMAGE_URI }}:${{ env.IMAGE_TAG }}
            ${{ env.DOCKER_IMAGE_URI }}:latest

      - name: Deploy to Portainer via webhook
        run: |
          curl -X POST ${{ secrets.PORTAINER_WEBHOOK_URL }}?tag=${{ env.IMAGE_TAG }}`

Este workflow:

1. É acionado em cada push para a branch principal
2. Faz login no GitHub Container Registry
3. Constrói e envia a imagem Docker
4. Aciona o webhook do Portainer para atualizar a stack com a nova versão

## Configuração do Portainer

## Criação da Stack no Portainer

1. Acesse sua instalação do Portainer
2. Navegue até "Stacks" no menu lateral
3. Clique em "Add stack"
4. Escolha o método "Web editor"
5. Defina um nome para sua stack (ex: "nextjs-app")
6. Cole o conteúdo do seu `docker-compose.yml`
7. Adicione as seguintes variáveis de ambiente:
    - `DOCKER_REGISTRY`: ghcr.io
    - `DOCKER_IMAGE`: seu-usuario/nome-do-repositorio
    - `IMAGE_TAG`: latest (inicialmente)
8. Clique em "Deploy the stack"

## Configuração do Webhook no Portainer

1. Após criar a stack, vá para a página da stack
2. Selecione a aba "Edit"
3. Role para baixo até a seção "Webhooks"
4. Ative a opção "Create a stack webhook"
5. Copie a URL do webhook gerada[15](https://docs.portainer.io/2.14/user/docker/stacks/webhooks)

![Webhook no Portainer]([https://i.imgur](https://i.imgur/), vá para Settings > Secrets > Actions > New repository secret

7. Adicione um novo segredo:

- Nome: `PORTAINER_WEBHOOK_URL`
- Valor: URL do webhook copiada do Portainer

## Testando o Fluxo de Deploy Automático

Para testar o sistema completo:

1. Faça uma alteração em seu código
2. Commit e push para a branch principal:
    
    `bashgit add .
    git commit -m "Teste de deploy automático"
    git push origin main`
    
3. Acompanhe o workflow no GitHub Actions (aba Actions do seu repositório)
4. Verifique se:
    - A imagem Docker foi construída com sucesso
    - A imagem foi enviada para o GitHub Container Registry
    - O webhook do Portainer foi acionado
5. Verifique no Portainer se a stack foi atualizada com a nova versão
6. Acesse seu aplicativo pelo domínio configurado para confirmar que está funcionando corretamente

## Solucionando Problemas Comuns

## Problemas com Tailwind no Docker

Se os estilos do Tailwind não estiverem sendo aplicados corretamente:

1. Verifique se o arquivo `postcss.config.js` está configurado corretamente[1](https://datawookie.dev/blog/2024/01/next-tailwind-docker/)[14](https://tailwindcss.com/docs/guides/nextjs)
2. Confirme que o Tailwind está sendo importado no arquivo CSS global[14](https://tailwindcss.com/docs/guides/nextjs)[17](https://nextjs.org/docs/app/guides/tailwind-css)
3. Certifique-se de que a etapa de build está gerando os estilos corretamente
4. Verifique se o contêiner está usando a versão de produção compilada[8](https://github.com/vercel/next.js/discussions/48156)

## Problemas com Webhooks

Se os webhooks do Portainer não estiverem funcionando:

1. Confirme que a URL do webhook está correta nos segredos do GitHub
2. Verifique se você está usando o formato correto na chamada curl[15](https://docs.portainer.io/2.14/user/docker/stacks/webhooks)
3. Certifique-se de que o Portainer está acessível a partir da internet (para webhooks)[9](https://docs.portainer.io/user/docker/services/webhooks)
4. Tente adicionar o parâmetro `?tag=latest` ao final da URL para forçar uma atualização[15](https://docs.portainer.io/2.14/user/docker/stacks/webhooks)

## Problemas de Deploy

Se o deploy falhar:

1. Verifique os logs no GitHub Actions para entender onde ocorreu a falha
2. Confirme se a imagem foi construída e enviada corretamente
3. Verifique os logs do contêiner no Portainer para identificar possíveis erros na aplicação

## Conclusão

Seguindo este guia, você configurou um pipeline completo de CI/CD para sua aplicação Next.js com Tailwind CSS usando Docker, GitHub Actions e Portainer. Agora, sempre que você fizer um push para o repositório, sua aplicação será automaticamente construída, empacotada e implantada, permitindo um fluxo de trabalho GitOps eficiente[10](https://www.portainer.io/blog/gitops-with-portainer-using-github-actions).

Esta implementação permite que você se concentre no desenvolvimento, enquanto o processo de implantação é tratado automaticamente. Além disso, o uso de multi-stage builds no Docker garante imagens otimizadas e seguras para seu ambiente de produção[2](https://docs.docker.com/build/building/multi-stage/)[3](https://dev.to/mohamed_amine_78123694764/best-practices-of-docker-docker-compose-for-nextjs-application-2kdm).

Com o Traefik já configurado em seu ambiente Portainer, sua aplicação estará disponível através do domínio configurado, com HTTPS automaticamente habilitado graças ao Let's Encrypt.

###