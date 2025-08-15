# Guia de Deploy Automático - YouLab

Este diretório contém arquivos de **exemplo** para configuração do sistema de deploy automático usando GitHub Actions, GitHub Container Registry (GHCR) e Portainer.

## Estrutura de Arquivos

```
docs/deploy-automatico/
├── README.md                      # Este arquivo (guia principal)
├── docker-publish.yml.example     # Exemplo de workflow do GitHub Actions
├── Dockerfile.example             # Exemplo de configuração do container
├── docker-compose.yml.example     # Exemplo de configuração para Portainer
└── ghcr-config.md.example         # Guia de configuração do GHCR
```

> **IMPORTANTE**: Os arquivos neste diretório são **APENAS EXEMPLOS** com comentários detalhados.
> Os arquivos de configuração reais estão localizados:
> - `Dockerfile` - Na raiz do projeto
> - `docker-compose.yml` - Na raiz do projeto
> - `docker-publish.yml` - Em `.github/workflows/`

## Visão Geral do Processo

1. Push para a branch `master` dispara o workflow
2. GitHub Actions constrói a imagem Docker
3. Imagem é publicada no GitHub Container Registry
4. Portainer é notificado via webhook e atualiza o container

## Pré-requisitos

- Repositório GitHub configurado
- Acesso ao GitHub Container Registry
- Portainer configurado com as seguintes especificações:

### Método de Build no Portainer
Ao criar a stack, selecione o método de build "Web editor". Este é o método recomendado pois permite colar diretamente a configuração do docker-compose.

### Especificações da Stack
  - Network: Singanet (external)
  - CPU limit: 0.5
  - Memory limit: 512M
  - Deploy constraints: node.role == manager

### Configuração do Traefik
As labels do Traefik devem seguir exatamente este formato no Docker Swarm:
```yaml
      labels:
      - traefik.enable=1
      - traefik.http.routers.[projeto].rule=Host(`youlab.com.br`)
      - traefik.http.routers.[projeto].entrypoints=websecure
      - traefik.http.routers.[projeto].priority=1
      - traefik.http.routers.[projeto].tls.certresolver=letsencryptresolver
      - traefik.http.routers.[projeto].service=[projeto]
      - traefik.http.services.[projeto].loadbalancer.server.port=3000
      - traefik.http.services.[projeto].loadbalancer.passHostHeader=true
```

IMPORTANTE:
- Use `enable=1` ao invés de `enable=true`
- Mantenha a indentação exata como mostrado acima
- Substitua `[projeto]` pelo nome do seu serviço
- A porta deve corresponder à porta exposta no Dockerfile (3000 para Next.js)

## Configurações Necessárias

### Configuração do Next.js

O arquivo `next.config.js` deve conter a seguinte configuração para funcionar corretamente com Docker:

```javascript
const nextConfig = {
  output: 'standalone',  // Necessário para build em Docker
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};
```

### GitHub Secrets Requeridas

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase
- `SUPABASE_URL`: URL do Supabase
- `PORTAINER_WEBHOOK_URL`: URL do webhook do Portainer

### Permissões do GitHub Actions

O workflow requer as seguintes permissões:
- `contents: read`
- `packages: write`
- `actions: read`
- `id-token: write`

## Pontos Importantes

1. **Nomenclatura e Configuração**:
   - O nome da imagem no GHCR deve estar em minúsculo
   - IMPORTANTE: O nome da imagem deve ser igual em todos os arquivos:
     - No `docker-publish.yml`: `IMAGE_NAME: jonathanmkt/youlab`
     - No `docker-compose.yml`: `image: ghcr.io/jonathanmkt/youlab:latest`
   - Nunca reutilize nomes de outros projetos, cada projeto deve ter seu próprio nome único

2. **Autenticação**:
   - Usar `GITHUB_TOKEN` em vez de tokens personalizados
   - Configurar permissões corretas no workflow

3. **Portainer**:
   - Domínio: youlab.com.br
   - URL do Portainer: https://portainer.singaerj.org.br/
   
   IMPORTANTE: 
   - Domínio principal: youlab.com.br

## Como Adaptar para Novos Projetos

Para adaptar este sistema para um novo projeto:

1. **Copie os arquivos de configuração reais (não os exemplos) para o novo projeto**:
   - `Dockerfile` → raiz do novo projeto
   - `docker-compose.yml` → raiz do novo projeto
   - Crie o diretório `.github/workflows/` e copie `docker-publish.yml`

2. **Edite cada arquivo substituindo**:
   - `youlab` pelo nome do seu projeto (em minúsculo)
   - `jonathanmkt` pelo nome do usuário GitHub
   - `youlab.com.br` pelo domínio principal

3. **Configure os Secrets no repositório GitHub**:
   - Configure todas as secrets mencionadas acima
   - Certifique-se de que as permissões estão corretas

4. **Configure o Webhook no Portainer**:
   - Crie uma stack com o docker-compose
   - Configure o webhook no serviço (não na stack)
   - Copie a URL do webhook para os secrets do GitHub

## Solução de Problemas Comuns

### Erro 403 Forbidden no GHCR
Se encontrar erro 403 ao fazer push para o GHCR, verifique:
1. Permissões do workflow estão corretas
2. Nome do pacote está em minúsculo
3. Repositório tem acesso ao pacote no GHCR

### Webhook do Portainer
IMPORTANTE: O webhook deve ser criado no SERVICE dentro da stack, não diretamente na stack.

Para criar o webhook:
1. Acesse a stack do seu projeto no Portainer
2. Localize o service do seu container
3. Na seção de webhooks do service, clique em "Add webhook"
4. Copie a URL gerada e adicione nas secrets do GitHub

Se o Portainer não atualizar automaticamente:
1. Verifique se a URL do webhook está correta
2. Confirme que o webhook está ativo no Portainer
3. Verifique os logs do Portainer para possíveis erros

## Manutenção

Para manter o deploy automático funcionando corretamente:
1. Mantenha as secrets atualizadas
2. Monitore os logs do GitHub Actions
3. Verifique periodicamente as permissões do GHCR
