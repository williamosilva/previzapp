# Usar uma imagem base com suporte ao Puppeteer/Chrome
FROM node:18-bullseye-slim as base

# Instalar dependências necessárias para o Puppeteer/Chrome
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório da aplicação
WORKDIR /app

# Stage de desenvolvimento
FROM base as development

# Copiar TODOS os arquivos de configuração ANTES de instalar dependências
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src ./src

# Criar diretórios necessários dentro do container
RUN mkdir -p .wwebjs_auth .wwebjs_cache logs

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "start:dev"]

# Stage de build
FROM base as build

# Copiar TODOS os arquivos de configuração ANTES de instalar dependências
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src ./src

# Fazer build da aplicação
RUN npm run build

# Stage de produção
FROM base as production

# Variáveis de ambiente para o Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Instalar apenas dependências de produção
RUN npm install --only=production && npm cache clean --force

# Copiar build da aplicação
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Criar diretórios necessários dentro do container
RUN mkdir -p .wwebjs_auth .wwebjs_cache logs

# Criar usuário não-root para segurança
RUN groupadd -r appuser && useradd -r -g appuser -s /bin/false appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expor porta
EXPOSE 3000

# Comando para produção
CMD ["npm", "run", "start:prod"]