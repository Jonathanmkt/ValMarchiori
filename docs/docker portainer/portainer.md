# Guia Completo: Deploy de Stacks no Portainer com Docker Swarm, Traefik e Repositório Remoto do GitHub

Antes de adentrar nos detalhes técnicos, é importante destacar que o processo de deploy de aplicações em Docker Swarm utilizando Portainer, Traefik como proxy reverso e integração com um repositório remoto do GitHub representa uma das abordagens mais modernas e eficientes para orquestração, automação e entrega contínua de aplicações conteinerizadas. Este guia detalha, de ponta a ponta, como configurar cada componente, integrá-los de maneira segura e eficiente, além de abordar práticas recomendadas, armadilhas comuns e estratégias para manutenção e automação de atualizações via GitOps.

## Introdução

O crescimento do uso de containers e orquestradores como o Docker Swarm revolucionou a forma como aplicações são desenvolvidas, entregues e gerenciadas em ambientes de produção. O Portainer surge como uma solução de gerenciamento visual, simplificando a administração de clusters Docker Swarm. Já o Traefik, atuando como proxy reverso dinâmico, oferece roteamento automático, SSL automatizado e integração nativa com o ecossistema Docker. A integração com repositórios remotos, como o GitHub, potencializa fluxos de trabalho GitOps, permitindo que o código-fonte e arquivos de configuração sejam a fonte única de verdade para o estado dos serviços em produção.

Este relatório explora, em profundidade, o processo de deploy de stacks Docker Swarm via Portainer, utilizando Traefik como proxy reverso, com os arquivos docker-compose hospedados em um repositório remoto no GitHub. O objetivo é fornecer um guia prático, detalhado e fundamentado para profissionais e equipes que buscam excelência em automação, segurança e escalabilidade em ambientes de containers.

## Fundamentos do Docker Swarm, Portainer e Traefik

### O que é Docker Swarm?

O Docker Swarm é o modo nativo de orquestração de containers do Docker, permitindo a criação e gerenciamento de clusters de hosts Docker, conhecidos como nós, que trabalham juntos para executar aplicações em containers de forma distribuída. O Swarm oferece recursos como alta disponibilidade, balanceamento de carga, escalonamento automático e atualização contínua dos serviços.

No contexto de produção, o Swarm é frequentemente utilizado para garantir resiliência e escalabilidade, permitindo que múltiplos containers de uma aplicação sejam distribuídos entre diferentes nós, com failover automático em caso de falhas.

### Portainer: Gerenciamento Visual de Clusters Docker

O Portainer é uma interface gráfica (GUI) para gerenciamento de ambientes Docker, incluindo clusters Swarm. Ele abstrai a complexidade de comandos CLI, proporcionando uma experiência visual para criação, atualização, monitoramento e troubleshooting de stacks e serviços. Entre suas funcionalidades, destacam-se:

- Gerenciamento de stacks via arquivos docker-compose.
- Integração com repositórios Git para deploy automatizado.
- Monitoramento de recursos, logs e eventos.
- Controle de acesso baseado em usuários e equipes.
- Suporte a múltiplos ambientes (Docker Standalone, Swarm, Kubernetes).

A abordagem visual do Portainer facilita a adoção de boas práticas DevOps, ao mesmo tempo em que reduz a curva de aprendizado para equipes multidisciplinares.

### Traefik: Proxy Reverso Dinâmico para Microserviços

O Traefik é um proxy reverso moderno, projetado para ambientes dinâmicos, como clusters Docker Swarm. Ele detecta automaticamente novos serviços via APIs do Docker, atualizando suas rotas sem necessidade de intervenção manual. Entre seus principais recursos estão:

- Descoberta automática de serviços e rotas via labels Docker.
- Suporte a SSL automatizado via Let's Encrypt.
- Balanceamento de carga nativo.
- Middleware para autenticação, redirecionamento, compressão, entre outros.
- Suporte a múltiplos provedores (Docker, Kubernetes, Consul, etc.).

A adoção do Traefik em ambientes Swarm simplifica o roteamento de tráfego externo para os serviços internos, reduzindo a complexidade de configuração e manutenção de proxies tradicionais.

### GitHub como Fonte de Verdade para Deploys (GitOps)

A prática de GitOps consiste em utilizar repositórios Git como fonte única de verdade para a configuração e estado dos ambientes de produção. No contexto do Portainer, isso significa que os arquivos docker-compose (e outros artefatos de configuração) são versionados no GitHub, e o Portainer é responsável por sincronizar o ambiente de produção com o que está definido no repositório, seja via polling ou webhooks[1][19].

Essa abordagem traz benefícios como rastreabilidade, auditoria, rollback facilitado e integração com pipelines CI/CD.

## Configuração do Ambiente: Passo a Passo

### Preparação do Cluster Docker Swarm

O primeiro passo é garantir que o cluster Docker Swarm esteja corretamente configurado. Isso envolve inicializar o Swarm em um nó gerenciador (manager) e adicionar nós trabalhadores (workers) conforme necessário. A criação de redes overlay é fundamental para permitir a comunicação entre serviços distribuídos nos diferentes nós do cluster[15].

```bash
# Inicializar o Swarm no nó principal
docker swarm init --advertise-addr 

# Criar uma rede overlay para o Traefik e serviços
docker network create --driver=overlay --attachable traefik-public
```

A rede overlay será utilizada tanto pelo Traefik quanto pelos serviços expostos por ele, incluindo o Portainer.

### Deploy do Traefik no Docker Swarm

O Traefik deve ser implantado como um serviço no Swarm, conectado à rede overlay criada anteriormente. A configuração do Traefik pode ser feita via arquivo docker-compose.yml ou diretamente via comandos Docker CLI, mas o uso de compose é recomendado pela clareza e facilidade de manutenção[4][6][9][12][15][18].

#### Exemplo de docker-compose.yml para Traefik

```yaml
version: "3.8"

services:
  traefik:
    image: traefik:v3.4
    command:
      - --providers.swarm=true
      - --providers.swarm.endpoint=unix:///var/run/docker.sock
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.le.acme.email=seu-email@dominio.com
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.le.acme.tlschallenge=true
      - --api.dashboard=true
      - --log.level=INFO
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080" # Dashboard Traefik opcional
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_letsencrypt:/letsencrypt
    networks:
      - traefik-public
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.traefik.rule=Host(`traefik.seudominio.com`)"
        - "traefik.http.routers.traefik.entrypoints=websecure"
        - "traefik.http.routers.traefik.tls.certresolver=le"
        - "traefik.http.services.traefik.loadbalancer.server.port=8080"
        - "traefik.docker.network=traefik-public"

volumes:
  traefik_letsencrypt:

networks:
  traefik-public:
    external: true
```

Antes do deploy, é necessário criar o arquivo acme.json com permissão 600 para armazenamento seguro dos certificados SSL:

```bash
touch acme.json
chmod 600 acme.json
```

O comando para deploy do Traefik é:

```bash
docker stack deploy -c traefik-compose.yml traefik
```

Essa configuração garante que o Traefik monitore eventos do Swarm, detectando automaticamente novos serviços e atualizando as rotas conforme as labels definidas nos serviços[4][6][9][12][18].

### Deploy do Portainer atrás do Traefik

Para expor o Portainer de forma segura e flexível, o ideal é que ele seja acessado através do Traefik, utilizando um subdomínio dedicado, como portainer.seudominio.com. O arquivo docker-compose.yml do Portainer deve conter as labels necessárias para o Traefik identificar e rotear o tráfego corretamente[13][10][7].

#### Exemplo de docker-compose.yml para Portainer

```yaml
version: "3.8"

services:
  portainer:
    image: portainer/portainer-ce:latest
    command: -H unix:///var/run/docker.sock
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    networks:
      - traefik-public
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.portainer.rule=Host(`portainer.seudominio.com`)"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.tls.certresolver=le"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
        - "traefik.docker.network=traefik-public"

volumes:
  portainer_data:

networks:
  traefik-public:
    external: true
```

O comando para deploy do Portainer é:

```bash
docker stack deploy -c portainer-compose.yml portainer
```

Após o deploy, o Portainer estará acessível via HTTPS no endereço definido, com certificados SSL automáticos via Let's Encrypt, fornecidos pelo Traefik. É fundamental garantir que tanto o Traefik quanto o Portainer estejam na mesma rede overlay para que o roteamento funcione corretamente[13][16][18].

### Configuração do Repositório Remoto do GitHub no Portainer

O Portainer permite o deploy de stacks diretamente a partir de arquivos docker-compose hospedados em repositórios Git, incluindo o GitHub. Essa funcionalidade pode ser acessada via interface web, na seção de Stacks[1][11][17][19].

#### Passos para Deploy via GitHub

1. Acesse o Portainer e navegue até o menu "Stacks".
2. Clique em "Add stack".
3. Escolha um nome descritivo para a stack.
4. Selecione "Git Repository" como método de build.
5. Preencha os campos:
   - **Repository URL**: URL do repositório GitHub (ex: https://github.com/seuusuario/seurepo).
   - **Repository reference**: Branch ou tag a ser utilizada (ex: refs/heads/main).
   - **Compose path**: Caminho relativo ao arquivo docker-compose dentro do repositório (ex: stacks/meu-servico/docker-compose.yml).
6. Se o repositório for privado, habilite "Authentication" e forneça usuário e token de acesso pessoal do GitHub.
7. Configure variáveis de ambiente, se necessário.
8. Habilite "GitOps updates" para automação de atualizações. Escolha entre polling (intervalo de checagem) ou webhook (gatilho via GitHub Actions ou similares).
9. Clique em "Deploy the stack".

O Portainer irá clonar o repositório, buscar o arquivo docker-compose especificado e executar o deploy como stack no Docker Swarm. Caso o GitOps esteja habilitado, futuras alterações no repositório podem ser automaticamente refletidas no ambiente de produção, conforme a configuração[1][19].

#### Detalhes Importantes

- O Portainer clona o repositório inteiro, portanto, certifique-se de que o ambiente tenha espaço em disco suficiente[1].
- Caminhos relativos podem ser utilizados para volumes e arquivos auxiliares, desde que estejam presentes no repositório e corretamente referenciados no compose[2].
- O Portainer não suporta submódulos Git no momento[1].
- O deploy utiliza o comando `docker stack deploy` nos bastidores, garantindo compatibilidade total com o Swarm[19].

### Exemplo Prático de Deploy Automatizado via GitHub Actions

Para ambientes que demandam integração contínua, é possível utilizar GitHub Actions para acionar webhooks do Portainer, forçando o redeploy de stacks sempre que um push é realizado no repositório. Existem ações específicas para deploy em Portainer, como a ação `portainer-stack-deploy`[3].

#### Exemplo de Workflow GitHub Actions

```yaml
name: Deploy Stack to Portainer

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Portainer
        uses: carlrygart/portainer-stack-deploy@v1
        with:
          portainer-host: https://portainer.seudominio.com
          username: ${{ secrets.PORTAINER_USER }}
          password: ${{ secrets.PORTAINER_PASS }}
          stack-name: minha-stack
          stack-definition: stacks/meu-servico/docker-compose.yml
```

Esse fluxo permite que o estado do ambiente seja sempre consistente com o que está versionado no GitHub, promovendo práticas GitOps e facilitando auditorias, rollback e automação[3][19].

## Configuração Avançada do Traefik para Docker Swarm

### Labels e Roteamento Dinâmico

O Traefik utiliza labels inseridas na seção `deploy` dos serviços no docker-compose para identificar rotas, regras de roteamento, middlewares e outras configurações específicas. No contexto do Swarm, as labels devem ser definidas em nível de serviço, não de container[4][6][9].

#### Exemplos de Labels Comuns

- `"traefik.enable=true"`: Habilita o serviço para roteamento pelo Traefik.
- `"traefik.http.routers..rule=Host(\`subdominio.seudominio.com\`)"`: Define a regra de roteamento baseada em hostname.
- `"traefik.http.routers..entrypoints=websecure"`: Define o entrypoint (porta 443).
- `"traefik.http.routers..tls.certresolver=le"`: Usa Let's Encrypt para SSL.
- `"traefik.http.services..loadbalancer.server.port=9000"`: Porta interna do serviço a ser exposta.
- `"traefik.docker.network=traefik-public"`: Rede overlay utilizada para comunicação entre Traefik e o serviço.

Essas labels são fundamentais para que o Traefik descubra e exponha automaticamente os serviços, sem necessidade de configuração manual de rotas ou certificados[4][6][9][13][18].

### Configuração de Middlewares e Segurança

O Traefik suporta middlewares para autenticação, redirecionamento, compressão, entre outros. Para proteger o acesso ao Portainer, recomenda-se a utilização de autenticação básica HTTP via middleware, além do próprio controle de acesso do Portainer.

#### Exemplo de Middleware de Autenticação

```yaml
labels:
  - "traefik.http.middlewares.portainer-auth.basicauth.users=usuario:senha_criptografada"
  - "traefik.http.routers.portainer.middlewares=portainer-auth"
```

A senha pode ser gerada via comando:

```bash
openssl passwd -apr1
```

### Uso de Redes Overlay

Para garantir que o Traefik consiga rotear o tráfego corretamente para os serviços, todos devem estar conectados à mesma rede overlay definida no Swarm. Ao criar stacks via Portainer, certifique-se de referenciar a rede overlay existente, ou crie novas redes conforme necessário[12][13][18].

### Logs, Monitoramento e Troubleshooting

O Traefik oferece logs detalhados e dashboard visual para monitoramento do tráfego, rotas e status dos serviços. Em caso de problemas de roteamento, como o serviço não ser acessível pelo domínio esperado, verifique:

- Se o serviço está na mesma rede overlay do Traefik.
- Se as labels estão corretamente definidas.
- Se as portas internas estão corretas.
- Logs do Traefik para mensagens de erro ou falhas de handshake TLS[16][18].

## Estratégias de GitOps e Atualizações Automatizadas

### Polling vs Webhook

O Portainer suporta dois métodos para atualização automática de stacks baseadas em repositórios Git:

- **Polling**: O Portainer verifica periodicamente o repositório em busca de novos commits. O intervalo pode ser configurado conforme a criticidade do serviço.
- **Webhook**: O Portainer gera uma URL de webhook que pode ser acionada via GitHub Actions, scripts ou outros mecanismos automatizados, promovendo atualizações sob demanda[1][19].

A escolha entre polling e webhook depende do fluxo de trabalho da equipe e da frequência desejada de atualizações. Webhooks tendem a ser mais eficientes e responsivos, enquanto polling é mais simples de configurar.

### Controle de Versão e Rollback

Ao utilizar o GitHub como fonte de verdade, todo o histórico de alterações nos arquivos docker-compose e configurações é preservado. Em caso de falhas, é possível realizar rollback para versões anteriores com facilidade, bastando reverter o commit no repositório e acionar o redeploy via Portainer[1][19].

### Segurança no Acesso ao GitHub

Para repositórios privados, o Portainer exige autenticação via usuário e token de acesso pessoal (PAT). Recomenda-se criar tokens com permissões restritas, exclusivos para automação, e nunca compartilhar ou expor essas credenciais em arquivos públicos ou logs[1][17].

## Práticas Recomendadas e Considerações de Segurança

### Isolamento de Serviços e Redes

Utilize redes overlay dedicadas para separar grupos de serviços com diferentes requisitos de segurança. Por exemplo, mantenha serviços internos em redes privadas, expondo apenas o Traefik e serviços públicos na rede overlay pública.

### Gerenciamento de Segredos

Evite armazenar informações sensíveis (senhas, certificados, chaves) em labels Docker. Utilize mecanismos de secrets do Docker Swarm para injetar segredos de forma segura nos containers, e configure o Traefik para buscar certificados e chaves via arquivos ou volumes protegidos[6].

### Monitoramento e Alertas

Implemente monitoramento contínuo do Traefik, Portainer e serviços críticos, utilizando logs, métricas e dashboards visuais. Configure alertas para eventos relevantes, como falhas de deploy, erros de SSL ou indisponibilidade de serviços.

### Atualizações e Manutenção

Mantenha o Traefik, Portainer e Docker Swarm sempre atualizados, aplicando patches de segurança e novas funcionalidades. Teste atualizações em ambientes de staging antes de promover para produção.

### Backup e Recuperação

Implemente rotinas de backup dos volumes de dados do Portainer, arquivos de configuração do Traefik e dados críticos dos serviços. Documente procedimentos de recuperação para minimizar downtime em caso de falhas.

## Estudos de Caso e Exemplos Reais

### Exemplo de Stack Completa Integrando Traefik, Portainer e Deploy via GitHub

```yaml
version: "3.8"

services:
  traefik:
    image: traefik:v3.4
    command:
      - --providers.swarm=true
      - --providers.swarm.endpoint=unix:///var/run/docker.sock
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.le.acme.email=admin@seudominio.com
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.le.acme.tlschallenge=true
      - --api.dashboard=true
      - --log.level=INFO
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_letsencrypt:/letsencrypt
    networks:
      - traefik-public
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.traefik.rule=Host(`traefik.seudominio.com`)"
        - "traefik.http.routers.traefik.entrypoints=websecure"
        - "traefik.http.routers.traefik.tls.certresolver=le"
        - "traefik.http.services.traefik.loadbalancer.server.port=8080"
        - "traefik.docker.network=traefik-public"

  portainer:
    image: portainer/portainer-ce:latest
    command: -H unix:///var/run/docker.sock
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    networks:
      - traefik-public
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.portainer.rule=Host(`portainer.seudominio.com`)"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.tls.certresolver=le"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
        - "traefik.docker.network=traefik-public"
        - "traefik.http.middlewares.portainer-auth.basicauth.users=usuario:senha_criptografada"
        - "traefik.http.routers.portainer.middlewares=portainer-auth"

volumes:
  traefik_letsencrypt:
  portainer_data:

networks:
  traefik-public:
    external: true
```

Esse arquivo pode ser versionado em um repositório GitHub e utilizado como fonte para deploy via Portainer, promovendo automação, rastreabilidade e facilidade de manutenção[10][13][12][7].

## Considerações Finais

A integração entre Portainer, Docker Swarm, Traefik e repositórios remotos do GitHub representa o estado da arte em automação, segurança e escalabilidade para ambientes de containers. Ao adotar práticas GitOps, as equipes garantem que o ambiente de produção esteja sempre alinhado com o que está versionado, promovendo transparência, controle e agilidade nas operações.

A configuração detalhada de redes, labels, middlewares e autenticação é fundamental para o sucesso da arquitetura, assim como a atenção a aspectos de segurança, monitoramento e backup. O uso de ferramentas como GitHub Actions para automação de deploys potencializa ainda mais a eficiência operacional.

Por fim, a documentação clara, testes em ambientes controlados e atualização constante das ferramentas são pilares para a manutenção de ambientes resilientes, seguros e preparados para os desafios da transformação digital.

## Conclusão

O deploy de stacks Docker Swarm via Portainer, utilizando Traefik como proxy reverso e integração com repositórios remotos do GitHub, é uma abordagem robusta, segura e altamente automatizável para gestão de aplicações conteinerizadas. A combinação dessas ferramentas permite que equipes de desenvolvimento e operações adotem práticas modernas de DevOps e GitOps, promovendo entregas rápidas, seguras e auditáveis.

Ao longo deste relatório, foram detalhados todos os passos necessários para configuração do ambiente, deploy de serviços, integração com GitHub, automação de atualizações e práticas recomendadas de segurança e manutenção. A adoção dessas práticas e ferramentas posiciona as organizações na vanguarda da inovação em infraestrutura de TI, habilitando-as a responder rapidamente às demandas do mercado e garantir a continuidade dos negócios em um cenário cada vez mais dinâmico e competitivo.

A recomendação final é que equipes invistam em capacitação contínua, mantenham a documentação sempre atualizada e promovam uma cultura de automação e melhoria contínua, aproveitando ao máximo os recursos oferecidos por Portainer, Docker Swarm, Traefik e GitHub.
