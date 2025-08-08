import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { WeatherMessageService } from '../weather-messages/weather-messages.service';
import { UserSession } from './types';

@Injectable()
export class WhatsAppService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: Client;
  private userSessions = new Map<string, UserSession>();
  private isReady = false;

  constructor(private readonly weatherMessageService: WeatherMessageService) {}

  async onModuleInit() {
    await this.initializeClient();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.destroy();
    }
  }

  private async initializeClient() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
      },
    });

    this.client.on('qr', (qr) => {
      this.logger.log('QR Code received! Scan with your WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.log('WhatsApp Client is ready!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      this.logger.log('WhatsApp authenticated successfully!');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error('Authentication failed:', msg);
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn('WhatsApp disconnected:', reason);
      this.isReady = false;
    });

    this.client.on('message_create', async (message) => {
      if (message.fromMe) return;

      if (message.type !== 'chat') return;

      await this.handleMessage(message);
    });

    try {
      await this.client.initialize();
    } catch (error) {
      this.logger.error('Error initializing WhatsApp Client:', error);
      throw error;
    }
  }

  private async handleMessage(message: any) {
    const phoneNumber = message.from;
    const messageBody = message.body.trim();

    this.logger.log(`Message received from ${phoneNumber}: ${messageBody}`);

    if (
      messageBody.toLowerCase().startsWith('/start') ||
      messageBody.toLowerCase() === 'start'
    ) {
      await this.sendWelcomeMessage(phoneNumber);
      return;
    }

    if (
      messageBody.toLowerCase().startsWith('/help') ||
      messageBody.toLowerCase() === 'ajuda'
    ) {
      await this.sendHelpMessage(phoneNumber);
      return;
    }

    if (
      messageBody.toLowerCase().startsWith('/cancel') ||
      messageBody.toLowerCase() === 'cancelar'
    ) {
      await this.cancelOperation(phoneNumber);
      return;
    }

    await this.handleLocationRequest(phoneNumber, messageBody);
  }

  private async sendWelcomeMessage(phoneNumber: string) {
    const welcomeMessage = [
      '🌤️ *Olá! Eu sou seu assistente meteorológico!*',
      '',
      'Envie o nome de uma cidade e eu te darei informações detalhadas sobre o tempo atual.',
      '',
      '📋 *Exemplos:*',
      '• São Paulo',
      '• Rio de Janeiro, RJ',
      '• Campinas',
      '• New York',
      '',
      '💡 *Dica:* Digite "ajuda" para ver todos os comandos disponíveis!',
    ].join('\n');

    await this.sendMessage(phoneNumber, welcomeMessage);
  }

  private async sendHelpMessage(phoneNumber: string) {
    const helpMessage = [
      '📖 *Guia de Uso do Bot Meteorológico*',
      '',
      '🌍 *Como usar:*',
      '1️⃣ Digite o nome de uma cidade',
      '2️⃣ Aguarde a consulta ser processada',
      '3️⃣ Receba informações detalhadas sobre o tempo',
      '',
      '🤖 *Comandos disponíveis:*',
      '• `/start` - Iniciar conversa',
      '• `/help` ou `ajuda` - Mostrar esta ajuda',
      '• `/cancel` ou `cancelar` - Cancelar operação',
      '',
      '📍 *Exemplos de consulta:*',
      '• São Paulo',
      '• Rio de Janeiro, RJ',
      '• Campinas, SP',
      '• London, UK',
      '',
      '🌡️ *Informações fornecidas:*',
      '• Temperatura atual e sensação térmica',
      '• Condições climáticas',
      '• Umidade e velocidade do vento',
      '• Índice UV e nebulosidade',
      '• Nascer e pôr do sol',
      '• Recomendações personalizadas',
    ].join('\n');

    await this.sendMessage(phoneNumber, helpMessage);
  }

  private async cancelOperation(phoneNumber: string) {
    this.userSessions.delete(phoneNumber);
    await this.sendMessage(
      phoneNumber,
      '❌ Operação cancelada. Digite uma nova cidade para consultar o tempo.',
    );
  }

  private async handleLocationRequest(phoneNumber: string, location: string) {
    this.logger.log(`Processing time query for: ${location}`);

    try {
      await this.sendTypingIndicator(phoneNumber);

      const session: UserSession = {
        phoneNumber,
        isWaitingForLocation: false,
      };
      this.userSessions.set(phoneNumber, session);

      const weatherData = await this.weatherMessageService.getWeatherSummary(
        location,
        'pt',
      );

      const formattedMessage = this.formatWeatherResponse(weatherData);
      await this.sendMessage(phoneNumber, formattedMessage);

      this.userSessions.delete(phoneNumber);

      setTimeout(async () => {
        await this.sendMessage(
          phoneNumber,
          '💡 *Dica:* Digite o nome de outra cidade para uma nova consulta!',
        );
      }, 2000);
    } catch (error) {
      this.logger.error(`Error processing weather for ${location}:`, error);

      this.userSessions.delete(phoneNumber);

      let errorMessage =
        '❌ Não foi possível obter informações meteorológicas no momento. Tente novamente em alguns instantes.';

      if (
        error.message?.includes('not found') ||
        error.message?.includes('404')
      ) {
        errorMessage = `❌ Cidade "${location}" não encontrada. Verifique a grafia e tente novamente.`;
      } else if (
        error.message?.includes('network') ||
        error.message?.includes('timeout')
      ) {
        errorMessage =
          '❌ Problema de conexão. Tente novamente em alguns instantes.';
      }

      await this.sendMessage(phoneNumber, errorMessage);
    }
  }

  private formatWeatherResponse(weatherData: any): string {
    const location =
      weatherData.location?.address || 'Localização não especificada';
    const currentData = weatherData.currentData || {};
    const dateTime = weatherData.dateTime || {};

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

    const windDirection = currentData.wind?.direction || 'N/A';
    const uvIndex =
      currentData.atmosphere?.uvIndex !== undefined
        ? Math.round(currentData.atmosphere.uvIndex)
        : 'N/A';

    const clouds =
      currentData.atmosphere?.clouds !== undefined
        ? currentData.atmosphere.clouds
        : 'N/A';

    const sunrise = currentData.sun?.sunrise || 'N/A';
    const sunset = currentData.sun?.sunset || 'N/A';
    const description = currentData.weather?.description || 'Sem descrição';

    const classifications = weatherData.classifications || {};
    const tempClass = classifications.temperature || 'N/A';
    const humidityClass = classifications.humidity || 'N/A';
    const windClass = classifications.windSpeed || 'N/A';
    const uvClass = classifications.uvIndex || 'N/A';

    let message = `🌤️ *Previsão do Tempo para ${location}*\n`;
    message += `📅 ${dateTime.date} | ⏰ ${dateTime.time}\n\n`;

    if (weatherData.summary) {
      message += `📋 *Resumo:*\n${weatherData.summary}\n\n`;
    }

    message += `🌡️ *Condições Atuais:*\n`;
    message += `• *Temperatura:* ${tempCelsius}°C (sensação ${feelsLike}°C)\n`;
    message += `• *Condição:* ${description}\n`;
    message += `• *Umidade:* ${humidity}% | *Vento:* ${windSpeed} km/h (${windDirection})\n`;
    message += `• *Índice UV:* ${uvIndex} | *Nebulosidade:* ${clouds}%\n\n`;

    message += `📊 *Classificações:*\n`;
    message += `• *Temperatura:* ${tempClass}\n`;
    message += `• *Umidade:* ${humidityClass}\n`;
    message += `• *Vento:* ${windClass}\n`;
    message += `• *Índice UV:* ${uvClass}\n\n`;

    message += `🌅 *Sol:*\n`;
    message += `• *Nascer:* ${sunrise} | *Pôr:* ${sunset}\n\n`;

    if (weatherData.recommendations?.length > 0) {
      message += `💡 *Minhas Recomendações:*\n`;
      weatherData.recommendations.slice(0, 3).forEach((rec) => {
        message += `→ ${rec}\n`;
      });
      message += '\n';
    }

    if (weatherData.alerts?.hasAlerts && weatherData.alerts.items.length > 0) {
      message += `⚠️ *Alertas Meteorológicos:*\n`;
      weatherData.alerts.items.slice(0, 2).forEach((alert) => {
        message += `‼️ *${alert.event}*\n`;
        message += `${alert.description.slice(0, 120)}...\n\n`;
      });
    }

    message += `⏰ Atualizado às ${dateTime.time}`;

    return message;
  }

  private async sendMessage(phoneNumber: string, message: string) {
    if (!this.isReady) {
      this.logger.warn('WhatsApp client is not ready');
      return;
    }

    try {
      await this.client.sendMessage(phoneNumber, message);
      this.logger.log(`Message sent to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`Error sending message to ${phoneNumber}:`, error);
      throw error;
    }
  }

  private async sendTypingIndicator(phoneNumber: string) {
    if (!this.isReady) return;

    try {
      const chat = await this.client.getChatById(phoneNumber);
      await chat.sendStateTyping();
    } catch (error) {
      this.logger.warn(`Error sending typing indicator:`, error);
    }
  }

  public isClientReady(): boolean {
    return this.isReady;
  }

  public async getClientInfo() {
    if (!this.isReady) return null;

    try {
      const info = this.client.info;
      return {
        isReady: this.isReady,
        phoneNumber: info?.wid?.user,
        pushname: info?.pushname,
      };
    } catch (error) {
      this.logger.error('Error getting client information:', error);
      return null;
    }
  }
}
