import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { WeatherMessageService } from '../weather-messages/weather-messages.service';
import { UserSession } from './types';

@Injectable()
export class WhatsAppService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: Client;
  private userSessions = new Map<string, UserSession>();
  private userInteractions = new Map<string, boolean>();
  private isReady = false;
  private isEnabled = false;

  private greetingWords = [
    'oi',
    'olá',
    'ola',
    'hey',
    'hi',
    'hello',
    'bom dia',
    'boa tarde',
    'boa noite',
    'salve',
    'eai',
    'e ai',
    'tudo bem',
    'como vai',
    'opa',
    'eae',
    'fala',
    'buenos dias',
    'buenas tardes',
    'buenas noches',
    'hola',
    'good morning',
    'good afternoon',
    'good evening',
  ];

  constructor(
    private readonly weatherMessageService: WeatherMessageService,
    private readonly configService: ConfigService,
  ) {
    this.isEnabled =
      this.configService.get<string>('ENABLE_WHATSAPP') === 'true';
  }

  async onModuleInit() {
    if (!this.isEnabled) {
      this.logger.log('WhatsApp module is disabled by configuration');
      return;
    }

    try {
      await this.initializeClient();
    } catch (error) {
      this.logger.error(
        'WhatsApp initialization failed, continuing without WhatsApp support:',
        error,
      );
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.destroy();
    }
  }

  private async initializeClient() {
    if (!this.isEnabled) return;

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
    if (!this.isEnabled || !this.isReady) return;

    const phoneNumber = message.from;
    const messageBody = message.body.trim();

    // this.logger.log(`Message received from ${phoneNumber}: ${messageBody}`);

    if (
      messageBody.toLowerCase().startsWith('/start') ||
      messageBody.toLowerCase() === 'start'
    ) {
      await this.sendWelcomeMessage(phoneNumber);
      this.markUserAsInteracted(phoneNumber);
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

    if (this.isFirstInteraction(phoneNumber) && this.isGreeting(messageBody)) {
      await this.sendGreetingResponse(phoneNumber);
      this.markUserAsInteracted(phoneNumber);
      return;
    }

    this.markUserAsInteracted(phoneNumber);
    await this.handleLocationRequest(phoneNumber, messageBody);
  }

  private isFirstInteraction(phoneNumber: string): boolean {
    return !this.userInteractions.has(phoneNumber);
  }

  private markUserAsInteracted(phoneNumber: string): void {
    this.userInteractions.set(phoneNumber, true);
  }

  private isGreeting(message: string): boolean {
    const normalizedMessage = message.toLowerCase().replace(/[^\w\s]/g, '');

    const words = normalizedMessage.split(/\s+/);
    if (words.length > 4) return false;

    return this.greetingWords.some((greeting) => {
      return words.some((word) => word === greeting || word.includes(greeting));
    });
  }

  private convertKelvinToCelsiusInText(text: string): string {
    if (!text) return text;

    const kelvinPattern = /(\d+(?:\.\d+)?)\s*K\b/gi;

    return text.replace(kelvinPattern, (match, kelvinValue) => {
      const kelvin = parseFloat(kelvinValue);
      const celsius = Math.round(kelvin - 273.15);
      return `${celsius}°C`;
    });
  }

  private async sendGreetingResponse(phoneNumber: string) {
    const greetingMessage = [
      '👋 *Olá! Que bom te conhecer!*',
      '',
      '🌤️ Eu sou o Previzapp, seu assistente meteorológico pessoal e estou aqui para ajudar você com informações sobre o tempo!',
      '',
      '🔍 *Como funciono:*',
      'É muito simples! Basta digitar o nome de qualquer cidade e eu te darei todas as informações meteorológicas atualizadas.',
      '',
      '📋 *Exemplos do que você pode digitar:*',
      '• São Paulo',
      '• Rio de Janeiro, RJ',
      '• Campinas, SP',
      '• London, UK',
      '• Tokyo, Japan',
      '',
      '🤖 *Comandos úteis:*',
      '• `ajuda` ou `/help` - Ver guia completo',
      '• `/start` - Mostrar mensagem de boas-vindas',
      '',
      '🌟 *Pronto para começar?*',
      'Digite o nome de uma cidade e vamos descobrir como está o tempo lá! 🌈',
    ].join('\n');

    await this.sendMessage(phoneNumber, greetingMessage);
  }

  private async sendMessage(phoneNumber: string, message: string) {
    if (!this.isEnabled || !this.isReady) {
      this.logger.warn('WhatsApp client is not ready or disabled');
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

  public isClientReady(): boolean {
    return this.isEnabled && this.isReady;
  }

  public isWhatsAppEnabled(): boolean {
    return this.isEnabled;
  }

  private async sendWelcomeMessage(phoneNumber: string) {
    const welcomeMessage = [
      '🌤️ *Bem-vindo ao Previzapp, seu assistente meteorológico!*',
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
      '📖 *Guia de Uso do Bot Previzapp*',
      '',
      '🌍 *Como usar:*',
      '1️⃣ Digite o nome de uma cidade',
      '2️⃣ Aguarde a consulta ser processada',
      '3️⃣ Receba informações detalhadas sobre o tempo',
      '',
      '🤖 *Comandos disponíveis:*',
      '• `/start` - Iniciar conversa',
      '• `/help` ou `ajuda` - Mostrar esta ajuda',
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

    const processedSummary = weatherData.summary
      ? this.convertKelvinToCelsiusInText(weatherData.summary)
      : '';

    let message = `🌤️ *Previsão do Tempo para ${location}*\n`;
    message += `📅 ${dateTime.date} | ⏰ ${dateTime.time}\n\n`;

    if (processedSummary) {
      message += `📋 *Resumo:*\n${processedSummary}\n\n`;
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
        const processedRec = this.convertKelvinToCelsiusInText(rec);
        message += `→ ${processedRec}\n`;
      });
      message += '\n';
    }

    if (weatherData.alerts?.hasAlerts && weatherData.alerts.items.length > 0) {
      message += `⚠️ *Alertas Meteorológicos:*\n`;
      weatherData.alerts.items.forEach((alert, index) => {
        const alertTitle =
          alert.type || alert.event || alert.title || 'Alerta Meteorológico';
        const alertDescription =
          alert.description || 'Descrição não disponível';
        const alertSource = alert.source || '';
        const alertSeverity = alert.severity || '';

        const processedDescription =
          this.convertKelvinToCelsiusInText(alertDescription);

        let periodInfo = '';
        if (alert.period && alert.period.start && alert.period.end) {
          const startDate = new Date(alert.period.start).toLocaleString(
            'pt-BR',
          );
          const endDate = new Date(alert.period.end).toLocaleString('pt-BR');
          periodInfo = `\n📅 *Período:* ${startDate} até ${endDate}`;

          if (alert.period.durationHours) {
            periodInfo += ` (${alert.period.durationHours}h)`;
          }
        }

        let categoriesInfo = '';
        if (alert.categories && alert.categories.length > 0) {
          categoriesInfo = `\n🏷️ *Categoria:* ${alert.categories.join(', ')}`;
        }

        message += `‼️ *${alertTitle}*\n`;
        if (alertSeverity) {
          message += `🔴 *Severidade:* ${alertSeverity}\n`;
        }
        if (alertSource) {
          message += `🏢 *Fonte:* ${alertSource}\n`;
        }
        message += `📝 ${processedDescription}`;
        message += periodInfo;
        message += categoriesInfo;

        if (index < weatherData.alerts.items.length - 1) {
          message += '\n\n';
        } else {
          message += '\n';
        }
      });
      message += '\n';
    }

    message += `⏰ Atualizado às ${dateTime.time}`;

    return message;
  }

  private async sendTypingIndicator(phoneNumber: string) {
    if (!this.isEnabled || !this.isReady) return;

    try {
      const chat = await this.client.getChatById(phoneNumber);
      await chat.sendStateTyping();
    } catch (error) {
      this.logger.warn(`Error sending typing indicator:`, error);
    }
  }

  public async getClientInfo() {
    if (!this.isEnabled || !this.isReady) return null;

    try {
      const info = this.client.info;
      return {
        isReady: this.isReady,
        isEnabled: this.isEnabled,
        phoneNumber: info?.wid?.user,
        pushname: info?.pushname,
      };
    } catch (error) {
      this.logger.error('Error getting client information:', error);
      return null;
    }
  }

  public clearUserInteractionCache(): void {
    this.userInteractions.clear();
    this.logger.log('User interaction cache cleared');
  }

  public hasUserInteracted(phoneNumber: string): boolean {
    return this.userInteractions.has(phoneNumber);
  }
}
