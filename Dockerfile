# Stage 1: Dependências e base
FROM node:18-alpine AS base
WORKDIR /app

# Instalação de dependências do sistema (raramente muda)
RUN apk add --no-cache libc6-compat

# Copiar apenas arquivos de controle de dependências
COPY package.json package-lock.json ./

# Stage 2: Instalação de dependências (muda apenas quando package.json muda)
FROM base AS deps
# Definir variáveis de ambiente para NPM
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Instalação de dependências com controle de cache específico
# Não usar --only=production para incluir devDependencies necessárias para o build como autoprefixer
RUN npm ci

# Stage 3: Builder (compilação - muda frequentemente)
FROM base AS builder
WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Argumentos e variáveis de ambiente build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED 1

# Copiar código-fonte (última etapa pois muda com frequência)
COPY . .

# Build da aplicação
RUN npm run build

# Stage 4: Produção (menor imagem possível)
FROM node:18-alpine AS production
WORKDIR /app

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Copiar apenas arquivos necessários para execução
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Configuração de segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Configuração de execução
EXPOSE 3000
CMD ["npm", "run", "start"]
