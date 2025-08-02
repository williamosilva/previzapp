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
        'pt',
      );

      const formattedMessage = this.formatWeatherResponse(weatherData);
      console.log('Mensagem formatada:', formattedMessage);

      await ctx.reply(formattedMessage, { parse_mode: 'Markdown' });
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
    console.log('Dados completos:', weatherData);

    const location = weatherData.location?.address || 'Local não especificado';
    const currentData = weatherData.currentData || {};

    const description = currentData.weather?.description || 'Sem descrição';
    const temperature = currentData.temperature?.celsius
      ? Math.round(currentData.temperature.celsius)
      : 'N/A';
    const feelsLike = currentData.temperature?.feelsLike?.celsius
      ? Math.round(currentData.temperature.feelsLike.celsius)
      : 'N/A';
    const humidity = currentData.atmosphere?.humidity || 'N/A';
    const windSpeed = currentData.wind?.speed
      ? Math.round(currentData.wind.speed * 3.6)
      : 'N/A';
    const windDirection = currentData.wind?.direction || '';

    const pressure = currentData.atmosphere?.pressure || 'N/A';
    const uvIndex = currentData.atmosphere?.uvIndex
      ? Math.round(currentData.atmosphere.uvIndex)
      : 'N/A';
    const clouds = currentData.atmosphere?.clouds || 'N/A';

    const sunrise = currentData.sun?.sunrise || 'N/A';
    const sunset = currentData.sun?.sunset || 'N/A';

    let message = `🌍 *${location}*\n\n`;
    message += `🌡️ **Temperatura:** ${temperature}°C\n`;
    message += `🤔 **Sensação térmica:** ${feelsLike}°C\n`;
    message += `🌤️ **Condição:** ${description}\n`;
    message += `💧 **Umidade:** ${humidity}%\n`;

    if (windSpeed !== 'N/A') {
      message += `💨 **Vento:** ${windSpeed} km/h`;
      if (windDirection) {
        message += ` (${windDirection})`;
      }
      message += `\n`;
    }

    message += `🌅 **Nascer do sol:** ${sunrise}\n`;
    message += `🌇 **Pôr do sol:** ${sunset}\n`;
    message += `☁️ **Nebulosidade:** ${clouds}%\n`;
    message += `🌡️ **Pressão:** ${pressure} hPa\n`;
    message += `☀️ **Índice UV:** ${uvIndex}\n`;

    if (weatherData.recommendations && weatherData.recommendations.length > 0) {
      message += `\n💡 **Recomendações:**\n`;
      weatherData.recommendations
        .slice(0, 3)
        .forEach((rec: string, index: number) => {
          message += `${index + 1}. ${rec}\n`;
        });
    }

    if (weatherData.alerts?.hasAlerts && weatherData.alerts.count > 0) {
      message += `\n⚠️ **Há ${weatherData.alerts.count} alerta(s) meteorológico(s) para esta região**\n`;
    }

    message += `\n_Dados atualizados em tempo real_`;

    return message;
  }
}
