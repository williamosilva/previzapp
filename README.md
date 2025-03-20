# Previzapp - Weather API Integration Service

## Sobre o Projeto

Este serviço transforma dados brutos de clima da API OpenWeather em um formato mais intuitivo e amigável para o usuário. Ele enriquece os dados com insights adicionais, como classificações climáticas, recomendações baseadas nas condições atuais, resumos do clima traduzidos e oferece suporta a todas os idiomas existentes.

### Principais Recursos

- **Base de Dados**: Integração com a API OpenWeather para obtenção de dados meteorológicos detalhados.
- **Enriquecimento de Dados**: Adiciona classificações e recomendações baseadas nas condições meteorológicas.
- **Facilidade no uso de parâmetros**: Conversão de endereços comuns (cidades, ruas, etc.) em coordenadas geográficas.
- **Suporte de idiomas**: Fornece resumos e dados meteorológicos em todos os idiomas usando o Google Cloud Translation.
- **API Abrangente**: Expõe um endpoint que entrega informações meteorológicas detalhadas, resumidas e organizadas.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução
- **NestJS** - Framework para construção da API
- **Axios** - Cliente HTTP para consumo de APIs externas
- **OpenWeather API** - Fonte de dados meteorológicos
- **Google Cloud Translation API** - Serviço de tradução
- **Jest** - Framework de testes unitários
- **Supertest** - Biblioteca para testes HTTP
- **NodeGeocoder** - Biblioteca para conversão de endereços em coordenadas geográficas

## Estrutura do Projeto

```
src
├── app.module.ts
├── main.ts
├── modules
│   ├── geolocation           # Serviço de conversão de endereços para coordenadas
│   ├── open-weather          # Integração com a API OpenWeather
│   ├── translation           # Integração com a API Google Cloud Translation
│   └── weather-messages      # Processamento e formatação dos dados meteorológicos
└── utils                     # Utilitários para classificação e recomendações
```

## Problema Resolvido

A API OpenWeather fornece dados meteorológicos extremamente detalhados, porém:

1. Os dados são muito técnicos e difíceis de interpretar para usuários finais
2. Contém muitos valores numéricos e timestamps que precisam de conversão
3. Requer coordenadas geográficas (latitude/longitude) para consultas
4. Não oferece suporte a múltiplos idiomas
5. Não fornece recomendações ou classificações baseadas nas condições

Este serviço resolve esses problemas ao:

1. Transformar os dados brutos em uma estrutura mais intuitiva e legível no JSON final
2. Converter timestamps para datas e horas em formato legível
3. Permitir a busca por nomes de locais comuns (cidades, endereços)
4. Oferecer tradução para todos os idiomas
5. Gerar recomendações e classificações úteis baseadas nas condições meteorológicas

## Processo de Transformação de Dados

### Dados Originais OpenWeather (EndPoint Raiz)

```json
{
   "lat":33.44,
   "lon":-94.04,
   "timezone":"America/Chicago",
   "timezone_offset":-18000,
   "current":{
      "dt":1684929490,
      "sunrise":1684926645,
      "sunset":1684977332,
      "temp":292.55,
      "feels_like":292.87,
      "pressure":1014,
      "humidity":89,
      "dew_point":290.69,
      "uvi":0.16,
      "clouds":53,
      "visibility":10000,
      "wind_speed":3.13,
      "wind_deg":93,
      "wind_gust":6.71,
      "weather":[
         {
            "id":803,
            "main":"Clouds",
            "description":"broken clouds",
            "icon":"04d"
         }
      ]
   },
   "minutely":[
      {
         "dt":1684929540,
         "precipitation":0
      },
      ...
   ],
   "hourly":[
      {
         "dt":1684926000,
         "temp":292.01,
         "feels_like":292.33,
         "pressure":1014,
         "humidity":91,
         "dew_point":290.51,
         "uvi":0,
         "clouds":54,
         "visibility":10000,
         "wind_speed":2.58,
         "wind_deg":86,
         "wind_gust":5.88,
         "weather":[
            {
               "id":803,
               "main":"Clouds",
               "description":"broken clouds",
               "icon":"04n"
            }
         ],
         "pop":0.15
      },
      ...
   ],
   "daily":[
      {
         "dt":1684951200,
         "sunrise":1684926645,
         "sunset":1684977332,
         "moonrise":1684941060,
         "moonset":1684905480,
         "moon_phase":0.16,
         "summary":"Expect a day of partly cloudy with rain",
         "temp":{
            "day":299.03,
            "min":290.69,
            "max":300.35,
            "night":291.45,
            "eve":297.51,
            "morn":292.55
         },
         "feels_like":{
            "day":299.21,
            "night":291.37,
            "eve":297.86,
            "morn":292.87
         },
         "pressure":1016,
         "humidity":59,
         "dew_point":290.48,
         "wind_speed":3.98,
         "wind_deg":76,
         "wind_gust":8.92,
         "weather":[
            {
               "id":500,
               "main":"Rain",
               "description":"light rain",
               "icon":"10d"
            }
         ],
         "clouds":92,
         "pop":0.47,
         "rain":0.15,
         "uvi":9.23
      },
      ...
   ],
    "alerts": [
    {
      "sender_name": "NWS Philadelphia - Mount Holly (New Jersey, Delaware, Southeastern Pennsylvania)",
      "event": "Small Craft Advisory",
      "start": 1684952747,
      "end": 1684988747,
      "description": "...SMALL CRAFT ADVISORY REMAINS IN EFFECT FROM 5 PM THIS\nAFTERNOON TO 3 AM EST FRIDAY...\n* WHAT...North winds 15 to 20 kt with gusts up to 25 kt and seas\n3 to 5 ft expected.\n* WHERE...Coastal waters from Little Egg Inlet to Great Egg\nInlet NJ out 20 nm, Coastal waters from Great Egg Inlet to\nCape May NJ out 20 nm and Coastal waters from Manasquan Inlet\nto Little Egg Inlet NJ out 20 nm.\n* WHEN...From 5 PM this afternoon to 3 AM EST Friday.\n* IMPACTS...Conditions will be hazardous to small craft.",
      "tags": [

      ]
    },
  /* dados adicionais */
  ]
}
```

### Dados Originais OpenWeather (EndPoint Overview)

```json
{
   "lat": 51.509865,
   "lon": -0.118092,
   "tz": "+01:00",
   "date": "2024-05-13",
   "units": "metric",
   "weather_overview": "The current weather is overcast with a
    temperature of 16°C and a feels-like temperature of 16°C.
    The wind speed is 4 meter/sec with gusts up to 6 meter/sec
    coming from the west-southwest direction.
    The air pressure is at 1007 hPa with a humidity level of 79%.
    The dew point is at 12°C and the visibility is 10000 meters.
    The UV index is at 4, indicating moderate risk from the
    sun's UV rays.
    The sky is covered with overcast clouds, and there is
    no precipitation expected at the moment.
    Overall, it is a moderately cool and cloudy day
    with light to moderate winds from the west-southwest."
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

## Melhorias Implementadas

1. **Dados Formatados para Humanos**:

   - Conversão de timestamps para data e hora legíveis
   - Temperatura em Celsius e Kelvin
   - Direção do vento em formato textual (ex: "Southeast")
   - URLs para ícones de clima (Oferecido pela OpenWeather, porém não na requisição raiz)

2. **Informações Adicionais**:

   - Classificações para temperatura, umidade, velocidade do vento e índice UV
   - Recomendações baseadas nas condições atuais
   - Resumo textual das condições climáticas
   - Local escolhido pelo usuário e não apenas latitude e longitude

3. **Usabilidade**:
   - Busca por endereço comum ao invés de coordenadas
   - Formatação de alertas com datas legíveis e duração calculada
   - Tradução para múltiplos idiomas

## Endpoint da API

### GET /weather/summary

Retorna um resumo completo das condições climáticas para o local especificado.

#### Parâmetros

| Parâmetro | Tipo   | Obrigatório | Descrição                              |
| --------- | ------ | ----------- | -------------------------------------- |
| address   | string | Sim         | Endereço, cidade, estado ou país e etc |
| lang      | string | Não         | Código do idioma (padrão: 'en')        |

#### Exemplo de Requisição

```
GET api/weather/summary?address=Serra%20Negra&lang=pt
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

## Tratamento de Erros

O serviço implementa tratamento de erros abrangente, incluindo:

- Validação de parâmetros de entrada
- Tratamento de erros de API/Lib externa (OpenWeather, Google Cloud Translation, NodeGeocoder)
- Tratamento de erros de geolocalização
- Respostas de erro formatadas com mensagens claras

## Arquitetura do Sistema

O sistema segue uma arquitetura modular com os seguintes componentes:

1. **GeolocationService**: Converte endereços em coordenadas geográficas
2. **OpenWeatherService**: Integra com a API OpenWeather para obter dados meteorológicos
3. **TranslationService**: Integra com a API Google Cloud Translation para tradução
4. **WeatherProcessor**: Processa e transforma os dados meteorológicos brutos
5. **WeatherFormatter**: Formata os dados processados para o formato final
6. **WeatherMessagesService**: Orquestra os serviços e expõe o endpoint da API

## Configuração e Execução

### Pré-requisitos

- Node.js v14+
- Conta na OpenWeather API (para obter a chave de API)
- Conta no Google Cloud (para a API de tradução)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
HTTP_TIMEOUT=timeout (opcional, ex: 1000)
HTTP_MAX_REDIRECTS=max_redirect (opcional, ex: 5)
OPENWEATHER_API_KEY=sua_chave_api_openweather
GOOGLE_API_KEY=sua_chave_api_google
GOOGLE_CLIENT_EMAI=seu_email
GOOGLE_PROJECT_ID=id_projeto
PORT=3000
```

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run start:dev

# Executar testes
npm run test

# Compilar para produção
npm run build

# Executar em modo de produção
npm run start:prod
```

## Testes

O projeto inclui testes unitários para os principais componentes:

- GeolocationService
- OpenWeatherService
- TranslationService
- WeatherProcessorService
- WeatherFormatterService

Além disso, há testes end-to-end (E2E) utilizando Supertest para validar a integração entre os serviços e as respostas da API.

Para executar os testes:

```bash
# Executar todos os testes
npm run test

# Executar testes com cobertura
npm run test:cov
```

## Possíveis Melhorias Futuras

1. Implementar cache de respostas para reduzir chamadas à API
2. Adicionar suporte para previsões de múltiplos dias
3. Implementar notificações de alertas meteorológicos (É possivel integrar com alguma api do WhatsApp para entregar avisos diários)
4. Adicionar gráficos e visualizações dos dados
5. Implementar histórico de condições meteorológicas (Fornecido pela Previzapp e não pelo OpenWeather)

## Autor

William Silva
