version: '3.8'
services:
  painel-web:
    image: disparador:latest
    environment:
      - REACT_APP_SUPABASE_URL=${REACT_APP_SUPABASE_URL}
      - REACT_APP_SUPABASE_ANON_KEY=${REACT_APP_SUPABASE_ANON_KEY}
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
        - traefik.http.routers.disparador.rule=Host(`disparador.singaerj.org.br`)
        - traefik.http.routers.disparador.entrypoints=websecure
        - traefik.http.routers.disparador.tls.certresolver=letsencryptresolver
        - traefik.http.services.disparador.loadbalancer.server.port=80
        - traefik.http.services.disparador.loadbalancer.passHostHeader=true
        - traefik.http.routers.disparador.service=disparador

networks:
  Singanet:
    external: true