FROM node:18-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código
COPY . .

# Build e iniciar
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "start"]
