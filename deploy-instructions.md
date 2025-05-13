# Instruções para Deploy com Netlify

Como o projeto é grande demais para upload direto, siga estas etapas para fazer o deploy via Git:

1. **Instale o Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Faça login no Netlify**:
```bash
netlify login
```

3. **Inicie o deploy (dentro da pasta do projeto)**:
```bash
netlify init
```

4. **Siga os passos interativos**:
   - Escolha "Create & configure a new site"
   - Selecione seu time
   - Dê um nome para o site (ou deixe em branco para nome aleatório)
   - Para IGNORAR COMPLETAMENTE os erros, quando perguntar pelo comando de build, insira:
     ```
     CI=false npm run build
     ```

5. **Configure variáveis de ambiente para ignorar erros**:
```bash
netlify env:set CI false
netlify env:set NETLIFY_NEXT_PLUGIN_SKIP true
```

6. **Faça o deploy de produção**:
```bash
netlify deploy --prod
```

Estas configurações garantirão que o Netlify ignore todos os erros e warnings durante o build.
