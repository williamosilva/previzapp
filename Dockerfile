FROM node:18-bullseye-slim as base

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base as development

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY package*.json ./

RUN npm install

COPY src ./src

RUN mkdir -p .wwebjs_auth .wwebjs_cache logs

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM base as build

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY package*.json ./

RUN npm install

COPY src ./src

RUN npm run build

FROM base as production

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN npm install --only=production && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN mkdir -p .wwebjs_auth .wwebjs_cache logs

RUN groupadd -r appuser && useradd -r -g appuser -s /bin/false appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

CMD ["npm", "run", "start:prod"]