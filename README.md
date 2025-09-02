# Previzapp - Assistente Climático Inteligente

## 🌤️ Visão Geral

O **Previzapp** é um assistente climático inteligente que oferece informações meteorológicas precisas e personalizadas através de múltiplas interfaces. Além de fornecer uma API robusta para integração com aplicações, o sistema inclui bots conversacionais para **WhatsApp** e **Telegram** que permitem aos usuários consultarem condições climáticas de forma natural e intuitiva.

<div align="center">
  <img src="https://i.imgur.com/XdpX3u8.png" alt="Previzapp WhatsApp Bot" width="49%" />
  <img src="https://i.imgur.com/GsdLH2f.png" alt="Previzapp Telegram Bot" width="49%" />
</div>

## Principais Funcionalidades

- **🤖 Assistente WhatsApp**: Bot conversacional que responde consultas meteorológicas via mensagens
- **📱 Bot Telegram**: Interface conversacional completa com suporte a teclados inline e callbacks
- **🌍 API Completa**: Endpoints RESTful para integração com outras aplicações
- **🗣️ Suporte Multilíngue**: Respostas em qualquer idioma através da tradução automática
- **📍 Localização Flexível**: Aceita endereços, cidades, coordenadas ou referências geográficas
- **🎯 Dados Enriquecidos**: Insights, classificações e recomendações baseadas nas condições climáticas
- **⚡ Alertas Meteorológicos**: Notificações sobre condições adversas do tempo

## Sobre o Projeto

Este serviço transforma dados brutos de clima da API OpenWeather em um formato mais intuitivo e amigável para o usuário. Ele enriquece os dados com insights adicionais, como classificações climáticas, recomendações baseadas nas condições atuais, resumos do clima traduzidos e oferece suporte a todos os idiomas existentes.

O Previzapp oferece integração com WhatsApp e Telegram, permitindo consultas meteorológicas via mensagens instantâneas.

### Principais Recursos

- **Base de Dados**: Integração com a API OpenWeather para obtenção de dados meteorológicos detalhados
- **Enriquecimento de Dados**: Adiciona classificações e recomendações baseadas nas condições meteorológicas
- **Facilidade no uso de parâmetros**: Conversão de endereços comuns (cidades, ruas, etc.) em coordenadas geográficas
- **Suporte de idiomas**: Fornece resumos e dados meteorológicos em todos os idiomas usando o Google Cloud Translation
- **API Abrangente**: Expõe um endpoint que entrega informações meteorológicas detalhadas, resumidas e organizadas
- **Integração WhatsApp**: Bot que responde consultas meteorológicas via WhatsApp
- **Integração Telegram**: Bot conversacional com teclados interativos e suporte a callbacks

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução
- **NestJS** - Framework para construção da API
- **Axios** - Cliente HTTP para consumo de APIs externas
- **OpenWeather API** - Fonte de dados meteorológicos
- **Google Cloud Translation API** - Serviço de tradução
- **Jest** - Framework de testes unitários
- **Supertest** - Biblioteca para testes HTTP
- **NodeGeocoder** - Biblioteca para conversão de endereços em coordenadas geográficas
- **nestjs-telegraf** - Integração com Bot API do Telegram
- **whatsapp-web.js** - Biblioteca para integração com WhatsApp Web
- **qrcode-terminal** - Geração de QR Code no terminal para autenticação

---

## Integração WhatsApp

### Características

- **Autenticação via QR Code**: Processo de login simples e seguro
- **Bot conversacional em português**: Interface totalmente localizada
- **Suporte a comandos básicos**: Comandos intuitivos para facilitar o uso
- **Formatação de mensagens com emojis**: Respostas visuais e organizadas
- **Processamento inteligente**: Reconhece nomes de cidades automaticamente

### Comandos Disponíveis

| Comando                 | Descrição               |
| ----------------------- | ----------------------- |
| `/start`                | Mensagem de boas-vindas |
| `/help` ou `ajuda`      | Guia de uso             |
| `/cancel` ou `cancelar` | Cancelar operação       |
| **Nome da cidade**      | Consulta meteorológica  |

### Configuração

#### Variáveis de Ambiente

```env
ENABLE_WHATSAPP=true
```

#### Como Usar

1. Configure `ENABLE_WHATSAPP=true` no arquivo `.env`
2. Execute a aplicação
3. Escaneie o QR Code que aparece no terminal
4. Envie mensagens para o número conectado

### Exemplo de Resposta

```
🌤 Previsão do Tempo para Campinas - State of São Paulo
📅 18/08/2025 | ⏰ 23:17

📋 Resumo:
O tempo está limpo, com temperatura de 17°C (16,85°C). A velocidade do vento é de 7 m/s, vindo do sudeste. A pressão atmosférica é de 1021 hPa e a umidade é de 82%. A visibilidade é de 10.000 metros. O índice UV é 0 e não há nuvens no céu. A sensação térmica lá fora é de 17°C (16,85°C). Portanto, no geral, é uma noite clara e ligeiramente fresca, com uma brisa suave. Lembre-se de se agasalhar se for sair e aproveitar o céu limpo!

🌡 Condições Atuais:
• Temperatura: 17°C (sensação 17°C)
• Condição: Céu limpo
• Umidade: 82% | Vento: 24 km/h (Sudeste)
• Índice UV: 0 | Nebulosidade: 0%

📊 Classificações:
• Temperatura: Legal
• Umidade: Alto
• Vento: Moderado
• Índice UV: Baixo

🌅 Sol:
• Nascer: 06:30 | Pôr: 17:53

💡 Minhas Recomendações:
→ Verifique as atualizações meteorológicas regularmente.
→ Temperatura amena. Pode ser necessário um suéter leve.
→ Alta umidade. Pode causar desconforto respiratório em indivíduos sensíveis.

⚠ Alertas Meteorológicos:
‼ Baixa Umidade
🔴 Severidade: Baixo
🏢 Fonte: Instituto Nacional de Meteorologia
📝 INMET publica aviso iniciando em: 18/08/2025 10:00. Umidade relativa do ar variando entre 30% e 20%. Baixo risco de incêndios florestais e à saúde.
📅 Período: 18/08/2025, 10:00:00 até 19/08/2025, 20:00:00 (34h)
🏷 Categoria: Qualidade do ar

⏰ Atualizado às 23:17
```

---

## Integração Telegram

### Características

- **Bot API oficial**: Utiliza a API oficial do Telegram com nestjs-telegraf
- **Interface interativa**: Teclados inline para seleção de idiomas
- **Suporte multilíngue**: Interface adaptável em 9 idiomas
- **Formatação rica**: Mensagens com Markdown, HTML e fallback para texto simples
- **Gestão de sessão**: Controle de estado de usuários e sessões temporárias

### Comandos Disponíveis

| Comando            | Descrição                                    |
| ------------------ | -------------------------------------------- |
| `/start`           | Inicialização e mensagem de boas-vindas      |
| `/help`            | Guia completo de uso do bot                  |
| `/cancel`          | Cancelar operação atual                      |
| **Nome da cidade** | Consulta meteorológica com seleção de idioma |

### Idiomas Suportados

- 🇧🇷 Português
- 🇺🇸 English
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇷🇺 Русский
- 🇯🇵 日本語
- 🇨🇳 中文

### Configuração

#### Variáveis de Ambiente

```env
ENABLE_TELEGRAM=true
TELEGRAM_BOT_TOKEN=seu_token_do_botfather
```

#### Criando o Bot

1. Converse com [@BotFather](https://t.me/botfather) no Telegram
2. Execute `/newbot` e siga as instruções
3. Copie o token fornecido para `TELEGRAM_BOT_TOKEN`
4. Configure `ENABLE_TELEGRAM=true`
5. Execute a aplicação

### Fluxo de Interação

1. **Inicialização**: Usuário envia `/start` ou uma cidade
2. **Seleção de idioma**: Bot apresenta teclado com bandeiras dos países
3. **Processamento**: Sistema busca dados meteorológicos
4. **Resposta formatada**: Mensagem completa com emojis e formatação

### Exemplo de Resposta Telegram

```
🌤️ Previsão do Tempo para São Paulo
📅 2025-03-20 | ⏰ 15:30

📝 Resumo:
Atualmente, o clima está agradável com temperatura de 25°C...

🌡️ Condições Atuais:
• Temperatura: 25°C (sensação 27°C)
• Condição: Céu limpo
• Umidade: 65% | Vento: 8 km/h (Sul)
• Índice UV: 7 | Nebulosidade: 5%

📊 Classificações:
• Temperatura: Agradável
• Umidade: Moderada
• Vento: Fraco
• Índice UV: Alto

🌅 Sol:
• Nascer: 06:15 | Pôr: 18:45

💡 Meus Conselhos:
→ Use protetor solar devido ao alto índice UV
→ Ótimo dia para atividades ao ar livre
→ Hidrate-se bem durante o dia

🕒 Atualizado às 15:30
```

### Tratamento de Erros

O bot implementa tratamento robusto de erros:

- **Formato de mensagem**: Fallback automático (MarkdownV2 → HTML → Texto simples)
- **Sessões expiradas**: Limpeza automática e notificação ao usuário
- **Localização inválida**: Mensagens de erro contextualizadas
- **Problemas de rede**: Retry automático e feedback ao usuário

---

## Arquitetura

O `WhatsAppService` e `TelegramService` gerenciam respectivamente:

### WhatsApp

- Inicialização do cliente WhatsApp Web
- Autenticação via QR Code
- Processamento de mensagens recebidas
- Formatação e envio de respostas
- Cache de interações de usuários

### Telegram

- Configuração da API do Bot Telegram
- Gerenciamento de comandos e callbacks
- Controle de sessões de usuário
- Formatação avançada de mensagens
- Tratamento de erros de envio

---

## Processo de Transformação de Dados

### Dados Originais OpenWeather (Endpoint Raiz)

```json
{
  "lat": 33.44,
  "lon": -94.04,
  "timezone": "America/Chicago",
  "timezone_offset": -18000,
  "current": {
    "dt": 1684929490,
    "sunrise": 1684926645,
    "sunset": 1684977332,
    "temp": 292.55,
    "feels_like": 292.87,
    "pressure": 1014,
    "humidity": 89,
    "dew_point": 290.69,
    "uvi": 0.16,
    "clouds": 53,
    "visibility": 10000,
    "wind_speed": 3.13,
    "wind_deg": 93,
    "wind_gust": 6.71,
    "weather": [
      {
        "id": 803,
        "main": "Clouds",
        "description": "broken clouds",
        "icon": "04d"
      }
    ]
  },
  "minutely": [
    {
      "dt": 1684929540,
      "precipitation": 0
    }
  ],
  "hourly": [
    {
      "dt": 1684926000,
      "temp": 292.01,
      "feels_like": 292.33,
      "pressure": 1014,
      "humidity": 91,
      "dew_point": 290.51,
      "uvi": 0,
      "clouds": 54,
      "visibility": 10000,
      "wind_speed": 2.58,
      "wind_deg": 86,
      "wind_gust": 5.88,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0.15
    }
  ],
  "daily": [
    {
      "dt": 1684951200,
      "sunrise": 1684926645,
      "sunset": 1684977332,
      "moonrise": 1684941060,
      "moonset": 1684905480,
      "moon_phase": 0.16,
      "summary": "Expect a day of partly cloudy with rain",
      "temp": {
        "day": 299.03,
        "min": 290.69,
        "max": 300.35,
        "night": 291.45,
        "eve": 297.51,
        "morn": 292.55
      },
      "feels_like": {
        "day": 299.21,
        "night": 291.37,
        "eve": 297.86,
        "morn": 292.87
      },
      "pressure": 1016,
      "humidity": 59,
      "dew_point": 290.48,
      "wind_speed": 3.98,
      "wind_deg": 76,
      "wind_gust": 8.92,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": 92,
      "pop": 0.47,
      "rain": 0.15,
      "uvi": 9.23
    }
  ],
  "alerts": [
    {
      "sender_name": "NWS Philadelphia - Mount Holly (New Jersey, Delaware, Southeastern Pennsylvania)",
      "event": "Small Craft Advisory",
      "start": 1684952747,
      "end": 1684988747,
      "description": "...SMALL CRAFT ADVISORY REMAINS IN EFFECT FROM 5 PM THIS\nAFTERNOON TO 3 AM EST FRIDAY...\n* WHAT...North winds 15 to 20 kt with gusts up to 25 kt and seas\n3 to 5 ft expected.\n* WHERE...Coastal waters from Little Egg Inlet to Great Egg\nInlet NJ out 20 nm, Coastal waters from Great Egg Inlet to\nCape May NJ out 20 nm and Coastal waters from Manasquan Inlet\nto Little Egg Inlet NJ out 20 nm.\n* WHEN...From 5 PM this afternoon to 3 AM EST Friday.\n* IMPACTS...Conditions will be hazardous to small craft.",
      "tags": []
    }
  ]
}
```

### Dados Originais OpenWeather (Endpoint Overview)

```json
{
  "lat": 51.509865,
  "lon": -0.118092,
  "tz": "+01:00",
  "date": "2024-05-13",
  "units": "metric",
  "weather_overview": "The current weather is overcast with a temperature of 16°C and a feels-like temperature of 16°C. The wind speed is 4 meter/sec with gusts up to 6 meter/sec coming from the west-southwest direction. The air pressure is at 1007 hPa with a humidity level of 79%. The dew point is at 12°C and the visibility is 10000 meters. The UV index is at 4, indicating moderate risk from the sun's UV rays. The sky is covered with overcast clouds, and there is no precipitation expected at the moment. Overall, it is a moderately cool and cloudy day with light to moderate winds from the west-southwest."
}
```

### Dados Transformados (Previzapp API)

```json
{
  "location": {
    "address": "Serra Negra",
    "latitude": -22.6126459,
    "longitude": -46.699986
  },
  "dateTime": {
    "timestamp": 1742440325,
    "timezone": "America/Sao_Paulo",
    "date": "2025-03-20",
    "time": "03:12"
  },
  "currentData": {
    "sun": {
      "sunrise": "09:10",
      "sunset": "21:17"
    },
    "temperature": {
      "kelvin": 289.9,
      "celsius": 16.8,
      "feelsLike": {
        "kelvin": 290.03,
        "celsius": 16.9
      }
    },
    "atmosphere": {
      "pressure": 1017,
      "humidity": 92,
      "dewPoint": 288.59,
      "uvIndex": 0,
      "clouds": 38,
      "visibility": 10000
    },
    "wind": {
      "speed": 4.6,
      "degree": 138,
      "gust": 11.2,
      "direction": "Southeast"
    },
    "weather": {
      "main": "Clouds",
      "description": "Scattered clouds",
      "icon": {
        "id": "03n",
        "url": "https://openweathermap.org/img/wn/03n@2x.png"
      }
    }
  },
  "alerts": {
    "hasAlerts": true,
    "count": 1,
    "items": [
      {
        "source": "Instituto Nacional de Meteorologia",
        "type": "Heavy Rains",
        "period": {
          "start": "2025-03-19 12:05",
          "end": "2025-03-20 13:00",
          "durationHours": 25
        },
        "description": "INMET publishes warning starting on: 03/19/2025 09:05. Rain between 30 and 60 mm/h or 50 and 100 mm/day, intense winds (60-100 km/h). Risk of power outages, falling tree branches, flooding and electrical discharges.",
        "categories": ["Rain"],
        "severity": "Low"
      }
    ]
  },
  "recommendations": [
    "Check weather updates regularly.",
    "Mild temperature. A light sweater may be necessary.",
    "Extremely high humidity. Avoid intense physical activity.",
    "Partly cloudy skies. Good for outdoor activities.",
    "Its just dawn, its a good time for morning outdoor activities."
  ],
  "classifications": {
    "temperature": "Nice",
    "humidity": "High",
    "windSpeed": "Weak",
    "uvIndex": "Low"
  },
  "summary": "Currently, the weather is quite mild with a temperature of 290K and a light wind speed of 5 meters per second coming from the southeast. The sky is partly cloudy with scattered clouds, and the visibility is good at 10000 meters. The air pressure is at 1017 hPa, and the humidity is quite high at 92%. The dew point is also at 289K, making the air feel quite moist. The UV index is low at 0, so there is no need to worry about sun protection at the moment. Overall, it's a relatively calm and cloudy evening with comfortable temperatures. Remember to dress accordingly and enjoy the pleasant weather!"
}
```

---

## API RESTful

### GET `/weather/summary`

Retorna um resumo completo das condições climáticas para o local especificado.

#### Parâmetros

| Parâmetro | Tipo   | Obrigatório | Descrição                        |
| --------- | ------ | ----------- | -------------------------------- |
| `address` | string | ✅ Sim      | Endereço, cidade, estado ou país |
| `lang`    | string | ❌ Não      | Código do idioma (padrão: 'en')  |

#### Exemplo de Requisição

```http
GET /api/weather/summary?address=Serra%20Negra&lang=pt-br
```

#### Exemplo de Resposta

```json
{
  "location": {
    "address": "Serra Negra",
    "latitude": -22.6126459,
    "longitude": -46.699986
  },
  "dateTime": {
    "timestamp": 1742440325,
    "timezone": "America/Sao_Paulo",
    "date": "2025-03-20",
    "time": "03:12"
  },
  "currentData": {
    "sun": {
      "sunrise": "09:10",
      "sunset": "21:17"
    },
    "temperature": {
      "kelvin": 289.9,
      "celsius": 16.8,
      "feelsLike": {
        "kelvin": 290.03,
        "celsius": 16.9
      }
    },
    "atmosphere": {
      "pressure": 1017,
      "humidity": 92,
      "dewPoint": 288.59,
      "uvIndex": 0,
      "clouds": 38,
      "visibility": 10000
    },
    "wind": {
      "speed": 4.6,
      "degree": 138,
      "gust": 11.2,
      "direction": "Sudeste"
    },
    "weather": {
      "main": "Nuvens",
      "description": "Nuvens dispersas",
      "icon": {
        "id": "03n",
        "url": "https://openweathermap.org/img/wn/03n@2x.png"
      }
    }
  },
  "alerts": {
    "hasAlerts": true,
    "count": 1,
    "items": [
      {
        "source": "Instituto Nacional de Meteorologia",
        "type": "Chuvas Intensas",
        "period": {
          "start": "2025-03-19 12:05",
          "end": "2025-03-20 13:00",
          "durationHours": 25
        },
        "description": "INMET publica aviso iniciando em: 19/03/2025 09:05. Chuva entre 30 e 60 mm/h ou 50 e 100 mm/dia, ventos intensos (60-100 km/h). Risco de corte de energia elétrica, queda de galhos de árvores, alagamentos e de descargas elétricas.",
        "categories": ["Chuva"],
        "severity": "Baixa"
      }
    ]
  },
  "recommendations": [
    "Verifique as atualizações meteorológicas regularmente.",
    "Temperatura amena. Um agasalho leve pode ser necessário.",
    "Umidade extremamente alta. Evite atividade física intensa.",
    "Céu parcialmente nublado. Bom para atividades ao ar livre.",
    "É apenas o amanhecer, é um bom momento para atividades matinais ao ar livre."
  ],
  "classifications": {
    "temperature": "Agradável",
    "humidity": "Alta",
    "windSpeed": "Fraco",
    "uvIndex": "Baixo"
  },
  "summary": "Atualmente, o clima está bastante ameno com uma temperatura de 290K e uma velocidade do vento leve de 5 metros por segundo vindo do sudeste. O céu está parcialmente nublado com nuvens dispersas, e a visibilidade é boa em 10000 metros. A pressão do ar está em 1017 hPa, e a umidade é bastante alta em 92%. O ponto de orvalho também está em 289K, tornando o ar bastante úmido. O índice UV é baixo em 0, então não há necessidade de se preocupar com proteção solar no momento. No geral, é uma noite relativamente calma e nublada com temperaturas confortáveis. Lembre-se de se vestir adequadamente e aproveitar o clima agradável!"
}
```

---

## Tratamento de Erros

O serviço implementa tratamento de erros abrangente, incluindo:

- **Validação de entrada**: Verificação de parâmetros obrigatórios
- **APIs externas**: Tratamento de falhas das APIs OpenWeather, Google Cloud Translation e NodeGeocoder
- **Geolocalização**: Validação e tratamento de endereços inválidos
- **Respostas estruturadas**: Mensagens de erro claras e contextualizadas
- **WhatsApp específico**: Tratamento de erros de autenticação, conexão e envio de mensagens
- **Telegram específico**: Tratamento de comandos, callbacks e formatação
- **Sistema de fallback**: Formatação alternativa (Markdown, HTML, texto simples)
- **Gestão de sessões**: Limpeza automática de sessões temporárias

---

## Arquitetura do Sistema

O sistema segue uma arquitetura modular com os seguintes componentes:

1. **GeolocationService**: Converte endereços em coordenadas geográficas
2. **OpenWeatherService**: Integra com a API OpenWeather para obter dados meteorológicos
3. **TranslationService**: Integra com a API Google Cloud Translation para tradução
4. **WeatherProcessor**: Processa e transforma os dados meteorológicos brutos
5. **WeatherFormatter**: Formata os dados processados para o formato final
6. **WeatherMessagesService**: Orquestra os serviços e expõe o endpoint da API
7. **WhatsAppService**: Gerencia a integração com WhatsApp Web e formatação de mensagens
8. **TelegramService**: Gerencia a integração com a API do Telegram
9. **TelegramUpdate**: Processa comandos, callbacks e mensagens do Telegram

---

## Configuração e Execução

### Pré-requisitos

- **Node.js** v14+
- **Conta OpenWeather API** (para obter a chave de API)
- **Conta Google Cloud** (para API de tradução e geocoding)
- **Smartphone com WhatsApp** (para autenticação via QR Code)
- **Conta Telegram** e bot criado via [@BotFather](https://t.me/botfather)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações HTTP
HTTP_TIMEOUT=1000
HTTP_MAX_REDIRECTS=5

# APIs Externas
OPENWEATHER_API_KEY=sua_chave_api_openweather
GOOGLE_API_KEY=sua_chave_api_google
GOOGLE_CLIENT_EMAIL=seu_email
GOOGLE_PROJECT_ID=id_projeto
GOOGLE_GEOCODING_API_KEY=sua_chave_api_geocoding

# Configurações do Servidor
FRONTEND_URL=sua_url_frontend
PORT=3000

# WhatsApp Configuration
ENABLE_WHATSAPP=true

# Telegram Configuration
ENABLE_TELEGRAM=true
TELEGRAM_BOT_TOKEN=seu_token_do_botfather
```

---

## Instalação e Execução

### 📦 Instalação com NPM

#### 1. Instalar dependências

```bash
npm install
```

#### 2. Executar em desenvolvimento

```bash
npm run start:dev
```

#### 3. Compilar para produção

```bash
npm run build
```

#### 4. Executar em produção

```bash
npm run start:prod
```

---

### 🐳 Instalação com Docker

#### 1. Usando Docker Compose (Recomendado)

```bash
docker-compose up
```

#### 2. Executar em background

```bash
docker-compose up -d
```

#### 3. Parar os serviços

```bash
docker-compose down
```

---

## Testes

O projeto inclui testes unitários para os principais componentes:

- **GeolocationService**
- **OpenWeatherService**
- **TranslationService**
- **WeatherProcessorService**
- **WeatherFormatterService**

Além disso, há testes end-to-end (E2E) utilizando Supertest para validar a integração entre os serviços e as respostas da API.

### Executar Testes

```bash
# Executar todos os testes
npm run test
```

---

## Autor

**[William Silva](https://williamsilva.dev)**

---
