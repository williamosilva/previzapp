// src/modules/telegram/telegram.update.ts
import { Update, Ctx, Start, On, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Injectable, Logger } from '@nestjs/common';

import { TelegramService } from './telegram.service';
import { WeatherMessageService } from '../weather-messages/weather-messages.service';

@Update()
@Injectable()
export class TelegramUpdate {
  private readonly logger = new Logger(TelegramUpdate.name);

  constructor(
    private readonly weatherMessageService: WeatherMessageService,
    private readonly telegramService: TelegramService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const welcomeMessage = `
🌤️ *Bem-vindo ao Bot de Clima!*

Envie o nome de uma cidade ou endereço e eu te darei as informações meteorológicas!

Exemplos:
• São Paulo
• Rio de Janeiro, RJ
• New York
• London, UK

Digite /help para mais informações.
    `;

    await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
  }

  @Command('help')
  async help(@Ctx() ctx: Context) {
    const helpMessage = `
🆘 *Como usar o Bot de Clima:*

1️⃣ Envie o nome de uma cidade
2️⃣ Aguarde as informações meteorológicas
3️⃣ Receba dados detalhados sobre o clima

*Comandos disponíveis:*
/start - Iniciar o bot
/help - Mostrar esta ajuda

*Exemplos de uso:*
• São Paulo
• Rio de Janeiro, Brasil
• New York, USA
• London, England
    `;

    await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
  }

  @On('text')
  async handleMessage(@Ctx() ctx: Context) {
    const message = ctx.message;
    // @ts-ignore
    if (!('text' in message)) {
      await ctx.reply(
        'Por favor, envie apenas mensagens de texto com o nome da cidade.',
      );
      return;
    }

    const userText = message.text.trim();
    // @ts-ignore
    const chatId = ctx.chat.id;

    if (userText.startsWith('/')) {
      return;
    }

    this.logger.log(`Processando solicitação de clima para: ${userText}`);

    try {
      await this.telegramService.sendTypingAction(chatId);

      const weatherData = await this.weatherMessageService.getWeatherSummary(
        userText,
        'en',
      );

      const formattedMessage = this.formatWeatherResponse(weatherData);
      await this.telegramService.sendMessageWithMarkdown(
        chatId,
        formattedMessage,
      );
    } catch (error) {
      this.logger.error(`Erro ao processar clima para ${userText}:`, error);

      let errorMessage =
        '❌ Desculpe, ocorreu um erro ao buscar as informações meteorológicas.';

      if (
        error.message?.includes('not found') ||
        error.message?.includes('404')
      ) {
        errorMessage =
          '🏙️ Cidade não encontrada. Verifique o nome e tente novamente.';
      } else if (
        error.message?.includes('network') ||
        error.message?.includes('timeout')
      ) {
        errorMessage =
          '🌐 Problema de conexão. Tente novamente em alguns instantes.';
      }

      await ctx.reply(errorMessage);
    }
  }

  private formatWeatherResponse(weatherData: any): string {
    const escapeMarkdown = (text: string) => {
      if (!text) return '';
      return text.replace(/([\_*\[\]\(\)~\`>\#\+\-=\|\{\}\.!])/g, '\\$1');
    };

    const location = escapeMarkdown(
      weatherData.location?.address || 'Local não especificado',
    );
    const currentData = weatherData.currentData || {};
    const dateTime = weatherData.dateTime || {};

    // Dados principais com tratamento para valores indefinidos
    const tempCelsius =
      currentData.temperature?.celsius !== undefined
        ? Math.round(currentData.temperature.celsius)
        : 'N/A';

    const feelsLike =
      currentData.temperature?.feelsLike?.celsius !== undefined
        ? Math.round(currentData.temperature.feelsLike.celsius)
        : 'N/A';

    const humidity =
      currentData.atmosphere?.humidity !== undefined
        ? currentData.atmosphere.humidity
        : 'N/A';

    const windSpeed =
      currentData.wind?.speed !== undefined
        ? Math.round(currentData.wind.speed * 3.6)
        : 'N/A';

    const windDirection = currentData.wind?.direction
      ? escapeMarkdown(currentData.wind.direction)
      : 'N/A';

    const uvIndex =
      currentData.atmosphere?.uvIndex !== undefined
        ? Math.round(currentData.atmosphere.uvIndex)
        : 'N/A';

    const clouds =
      currentData.atmosphere?.clouds !== undefined
        ? currentData.atmosphere.clouds
        : 'N/A';

    const pressure =
      currentData.atmosphere?.pressure !== undefined
        ? currentData.atmosphere.pressure
        : 'N/A';

    const sunrise = currentData.sun?.sunrise
      ? escapeMarkdown(currentData.sun.sunrise)
      : 'N/A';

    const sunset = currentData.sun?.sunset
      ? escapeMarkdown(currentData.sun.sunset)
      : 'N/A';

    const description = currentData.weather?.description
      ? escapeMarkdown(currentData.weather.description)
      : 'Sem descrição';

    // Classificações humanizadas
    const classifications = weatherData.classifications || {};
    const tempClass = classifications.temperature || 'N/A';
    const humidityClass = classifications.humidity || 'N/A';
    const windClass = classifications.windSpeed || 'N/A';
    const uvClass = classifications.uvIndex || 'N/A';

    // Construção da mensagem estilo assistente
    let message = `🌤️ *PREVISÃO PARA\\: ${location}*\n`;
    message += `📅 ${escapeMarkdown(dateTime.date)} \\| ⏰ ${escapeMarkdown(dateTime.time)}\n\n`;

    // Resumo principal (destaque) - CORREÇÃO: Removido o bloco duplicado
    if (weatherData.summary) {
      const safeSummary = weatherData.summary
        .replace(/(\d+)-(\d+)/g, '$1\\-$2') // Escapar hífens entre números
        .replace(/-/g, '\\-') // Escapar outros hífens
        .replace(/:/g, '\\:'); // Escapar dois pontos

      message += `💬 *RESUMO DO DIA*\n${escapeMarkdown(safeSummary)}\n\n`;
    }

    // Bloco de condições atuais
    message += `📊 *CONDIÇÕES ATUAIS*\n`;
    message += `🌡️ Temperatura\\: ${tempCelsius}°C \\(Sensação ${feelsLike}°C\\)\n`;
    message += `🌤️ Condição\\: ${description}\n`;
    message += `💧 Umidade\\: ${humidity}% \\| 💨 Vento\\: ${windSpeed} km/h \\(${windDirection}\\)\n`;
    message += `☀️ UV\\: ${uvIndex} \\| ☁️ Nebulosidade\\: ${clouds}%\n\n`;

    // Classificações intuitivas
    message += `🏷️ *CLASSIFICAÇÕES*\n`;
    message += `• Temperatura\\: ${escapeMarkdown(tempClass)}\n`;
    message += `• Umidade\\: ${escapeMarkdown(humidityClass)}\n`;
    message += `• Vento\\: ${escapeMarkdown(windClass)}\n`;
    message += `• Índice UV\\: ${escapeMarkdown(uvClass)}\n\n`;

    // Astro informações
    message += `🌞 *SOL*\n`;
    message += `Nascer\\: ${sunrise} \\| Pôr\\: ${sunset}\n\n`;

    // Recomendações como conselhos pessoais
    if (weatherData.recommendations?.length > 0) {
      message += `💡 *MEUS CONSELHOS*\n`;
      weatherData.recommendations.slice(0, 3).forEach((rec) => {
        const escapedRec = escapeMarkdown(rec)
          .replace(/-/g, '\\-')
          .replace(/:/g, '\\:');
        message += `→ ${escapedRec}\n`;
      });
      message += '\n';
    }

    // Alertas com destaque especial
    if (weatherData.alerts?.hasAlerts && weatherData.alerts.items.length > 0) {
      message += `⚠️ *ATENÇÃO\\! ALERTAS ATIVOS* ⚠️\n`;
      weatherData.alerts.items.slice(0, 2).forEach((alert) => {
        const event = escapeMarkdown(alert.event)
          .replace(/-/g, '\\-')
          .replace(/:/g, '\\:');

        const desc = escapeMarkdown(alert.description.slice(0, 120))
          .replace(/-/g, '\\-')
          .replace(/:/g, '\\:');

        message += `‼️ *${event}*\n`;
        message += `${desc}...\n\n`;
      });
    }

    message += `_Atualizado às ${escapeMarkdown(dateTime.time)}_`;

    return message;
  }
}
