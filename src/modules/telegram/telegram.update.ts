// src/modules/telegram/telegram.update.ts
import { Update, Ctx, Start, On, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Injectable, Logger } from '@nestjs/common';

import { TelegramService } from './telegram.service';
import { WeatherMessageService } from '../weather-messages/weather-messages.service';
import { I18nService } from './i18n/i18n';

interface UserSession {
  chatId: number;
  location?: string;
  selectedLanguage?: string;
  waitingForLanguage?: boolean;
}

@Update()
@Injectable()
export class TelegramUpdate {
  private readonly logger = new Logger(TelegramUpdate.name);
  private userSessions = new Map<number, UserSession>();

  // Mapeamento de idiomas com emojis e códigos ISO
  private readonly languages = {
    '🇧🇷 Português': 'pt',
    '🇺🇸 English': 'en',
    '🇪🇸 Español': 'es',
    '🇫🇷 Français': 'fr',
    '🇩🇪 Deutsch': 'de',
    '🇮🇹 Italiano': 'it',
    '🇷🇺 Русский': 'ru',
    '🇯🇵 日本語': 'ja',
    '🇨🇳 中文': 'zh',
  };

  constructor(
    private readonly weatherMessageService: WeatherMessageService,
    private readonly telegramService: TelegramService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    // @ts-ignore
    const chatId = ctx.chat.id;

    // Limpa sessão anterior se existir
    this.userSessions.delete(chatId);

    const welcomeMessage = [
      I18nService.t('WELCOME_TITLE', 'pt'),
      I18nService.t('WELCOME_MESSAGE', 'pt'),
      I18nService.t('WELCOME_EXAMPLES', 'pt'),
      I18nService.t('WELCOME_HELP_TIP', 'pt'),
    ].join('\n\n');

    await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
  }

  @Command('help')
  async help(@Ctx() ctx: Context) {
    const helpMessage = [
      I18nService.t('HELP_TITLE', 'pt'),
      '',
      I18nService.t('HELP_STEP1', 'pt'),
      I18nService.t('HELP_STEP2', 'pt'),
      I18nService.t('HELP_STEP3', 'pt'),
      '',
      I18nService.t('HELP_AVAILABLE_COMMANDS', 'pt'),
      I18nService.t('HELP_START_COMMAND', 'pt'),
      I18nService.t('HELP_HELP_COMMAND', 'pt'),
      I18nService.t('HELP_CANCEL_COMMAND', 'pt'),
      '',
      I18nService.t('HELP_USAGE_EXAMPLES', 'pt'),
      '',
      I18nService.t('HELP_SUPPORTED_LANGUAGES', 'pt'),
    ].join('\n');

    await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
  }

  @Command('cancel')
  async cancel(@Ctx() ctx: Context) {
    // @ts-ignore
    const chatId = ctx.chat.id;

    this.userSessions.delete(chatId);
    await ctx.reply(I18nService.t('ERROR_OPERATION_CANCELLED', 'pt'));
  }

  @On('text')
  async handleMessage(@Ctx() ctx: Context) {
    const message = ctx.message;
    // @ts-ignore
    if (!('text' in message)) {
      await ctx.reply(I18nService.t('ERROR_TEXT_ONLY', 'pt'));
      return;
    }

    const userText = message.text.trim();
    // @ts-ignore
    const chatId = ctx.chat.id;

    // Ignora comandos que começam com /
    if (userText.startsWith('/')) {
      return;
    }

    let session = this.userSessions.get(chatId);

    // Se o usuário está aguardando seleção de idioma
    if (session?.waitingForLanguage) {
      await this.handleLanguageSelection(ctx, userText, chatId);
      return;
    }

    // Nova solicitação de cidade
    await this.handleLocationRequest(ctx, userText, chatId);
  }

  private async handleLocationRequest(
    ctx: Context,
    location: string,
    chatId: number,
  ) {
    this.logger.log(`Nova solicitação de clima para: ${location}`);

    // Criar ou atualizar sessão
    const session: UserSession = {
      chatId,
      location,
      waitingForLanguage: true,
    };
    this.userSessions.set(chatId, session);

    // Criar teclado inline com opções de idioma
    const languageButtons = Object.keys(this.languages).map((lang) => [
      { text: lang, callback_data: `lang_${this.languages[lang]}` },
    ]);

    const keyboard = {
      inline_keyboard: languageButtons,
    };

    const languageMessage = [
      I18nService.t('LANGUAGE_SELECTION_TITLE', 'pt', { location }),
      I18nService.t('LANGUAGE_SELECTION_MESSAGE', 'pt'),
    ].join('\n\n');

    try {
      await ctx.reply(languageMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } catch (error) {
      // Fallback para texto simples se o inline keyboard falhar
      this.logger.warn('Falha no inline keyboard, usando fallback text');

      let fallbackMessage =
        I18nService.t('LANGUAGE_FALLBACK_MESSAGE', 'pt', { location }) + '\n\n';
      Object.keys(this.languages).forEach((lang, index) => {
        fallbackMessage += `${index + 1}. ${lang}\n`;
      });
      fallbackMessage +=
        '\n' + I18nService.t('LANGUAGE_FALLBACK_INSTRUCTION', 'pt');

      await ctx.reply(fallbackMessage, { parse_mode: 'Markdown' });
    }
  }

  private async handleLanguageSelection(
    ctx: Context,
    input: string,
    chatId: number,
  ) {
    const session = this.userSessions.get(chatId);
    if (!session || !session.location) {
      await ctx.reply(I18nService.t('ERROR_INVALID_SESSION', 'pt'));
      this.userSessions.delete(chatId);
      return;
    }

    let selectedLanguageCode: string | null = null;

    // Verificar se é uma seleção por número (fallback)
    const numberMatch = input.match(/^([1-9])$/);
    if (numberMatch) {
      const index = parseInt(numberMatch[1]) - 1;
      const languages = Object.values(this.languages);
      if (index >= 0 && index < languages.length) {
        selectedLanguageCode = languages[index];
      }
    } else {
      // Verificar se o texto corresponde a um idioma
      const matchedLanguage = Object.keys(this.languages).find(
        (lang) =>
          lang.toLowerCase().includes(input.toLowerCase()) ||
          input.toLowerCase().includes(lang.toLowerCase()),
      );

      if (matchedLanguage) {
        selectedLanguageCode = this.languages[matchedLanguage];
      }
    }

    if (!selectedLanguageCode) {
      await ctx.reply(I18nService.t('ERROR_LANGUAGE_NOT_RECOGNIZED', 'pt'));
      return;
    }

    // Atualizar sessão
    session.selectedLanguage = selectedLanguageCode;
    session.waitingForLanguage = false;

    // Buscar dados do tempo
    await this.fetchAndSendWeatherData(ctx, session);
  }

  // Handler para callback queries (inline buttons)
  @On('callback_query')
  async handleCallbackQuery(@Ctx() ctx: any) {
    const callbackData = ctx.callbackQuery.data;
    const chatId = ctx.callbackQuery.message.chat.id;

    if (callbackData.startsWith('lang_')) {
      const languageCode = callbackData.replace('lang_', '');
      const session = this.userSessions.get(chatId);

      if (!session || !session.location) {
        await ctx.answerCbQuery(I18nService.t('ERROR_SESSION_EXPIRED', 'pt'));
        return;
      }

      // Obter nome do idioma para exibição
      const languageName = I18nService.getLanguageDisplayName(languageCode);

      // Confirmar seleção com tradução
      await ctx.answerCbQuery(
        I18nService.t('LANGUAGE_SELECTED', languageCode, {
          language: languageName,
        }),
      );
      // Atualizar sessão
      session.selectedLanguage = languageCode;
      session.waitingForLanguage = false;

      // Buscar dados do tempo
      await this.fetchAndSendWeatherData(ctx, session);
    }
  }

  private async fetchAndSendWeatherData(ctx: Context, session: UserSession) {
    const { location, selectedLanguage, chatId } = session;

    try {
      await this.telegramService.sendTypingAction(chatId);

      // Limpar sessão pois vamos processar
      this.userSessions.delete(chatId);

      this.logger.log(
        `Buscando clima para ${location} no idioma ${selectedLanguage}`,
      );

      const weatherData = await this.weatherMessageService.getWeatherSummary(
        location!,
        selectedLanguage!,
      );
      const formattedMessage = this.formatWeatherResponse(
        weatherData,
        selectedLanguage!,
      );
      await this.telegramService.sendMessageWithMarkdown(
        chatId,
        formattedMessage,
      );

      // Mensagem de follow-up
      await ctx.reply(
        I18nService.t('NEW_CONSULTATION_TIP', selectedLanguage!),
        { parse_mode: 'Markdown' },
      );
    } catch (error) {
      this.logger.error(`Erro ao processar clima para ${location}:`, error);

      // Limpar sessão mesmo em caso de erro
      this.userSessions.delete(chatId);

      let errorMessage = I18nService.t(
        'ERROR_WEATHER_FETCH',
        selectedLanguage || 'pt',
      );
      if (
        error.message?.includes('not found') ||
        error.message?.includes('404')
      ) {
        errorMessage = I18nService.t(
          'ERROR_CITY_NOT_FOUND',
          selectedLanguage || 'pt',
        );
      } else if (
        error.message?.includes('network') ||
        error.message?.includes('timeout')
      ) {
        errorMessage = I18nService.t(
          'ERROR_NETWORK_PROBLEM',
          selectedLanguage || 'pt',
        );
      }

      await ctx.reply(errorMessage);
    }
  }

  private formatWeatherResponse(weatherData: any, lang: string): string {
    const escapeMarkdown = (text: string) => {
      if (!text) return '';
      return text.replace(/([\_*\[\]\(\)~\`>\#\+\-=\|\{\}\.!])/g, '\\$1');
    };

    const location = escapeMarkdown(
      weatherData.location?.address || I18nService.t('NO_DESCRIPTION', lang),
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
    let message =
      I18nService.t('WEATHER_FORECAST_FOR', lang, { location }) + '\n';
    message += `📅 ${escapeMarkdown(dateTime.date)} \\| ⏰ ${escapeMarkdown(dateTime.time)}\n\n`;
    // Resumo principal (destaque)
    if (weatherData.summary) {
      const safeSummary = weatherData.summary
        .replace(/(\d+)-(\d+)/g, '$1\\-$2')
        .replace(/-/g, '\\-')
        .replace(/:/g, '\\:');
      message +=
        I18nService.t('SUMMARY_TITLE', lang) +
        '\n' +
        escapeMarkdown(safeSummary) +
        '\n\n';
    }

    message += I18nService.t('CURRENT_CONDITIONS', lang) + '\n';
    message += `${I18nService.t('TEMPERATURE_LABEL', lang)}: ${tempCelsius}°C \\(${I18nService.t('FEELS_LIKE', lang)} ${feelsLike}°C\\)\n`;
    message += `${I18nService.t('CONDITION_LABEL', lang)}: ${description}\n`;
    message += `${I18nService.t('HUMIDITY_LABEL', lang)}: ${humidity}% \\| ${I18nService.t('WIND_LABEL', lang)}: ${windSpeed} km/h \\(${windDirection}\\)\n`;
    message += `${I18nService.t('UV_LABEL', lang)}: ${uvIndex} \\| ${I18nService.t('CLOUDINESS_LABEL', lang)}: ${clouds}%\n\n`;

    message += I18nService.t('CLASSIFICATIONS_TITLE', lang) + '\n';
    message += `${I18nService.t('TEMPERATURE_CLASS', lang)}: ${escapeMarkdown(tempClass)}\n`;
    message += `${I18nService.t('HUMIDITY_CLASS', lang)}: ${escapeMarkdown(humidityClass)}\n`;
    message += `${I18nService.t('WIND_CLASS', lang)}: ${escapeMarkdown(windClass)}\n`;
    message += `${I18nService.t('UV_INDEX_CLASS', lang)}: ${escapeMarkdown(uvClass)}\n\n`;

    message += I18nService.t('SUN_TITLE', lang) + '\n';
    message += `${I18nService.t('SUNRISE_LABEL', lang)}: ${sunrise} \\| ${I18nService.t('SUNSET_LABEL', lang)}: ${sunset}\n\n`;

    if (weatherData.recommendations?.length > 0) {
      message += I18nService.t('MY_ADVICE_TITLE', lang) + '\n';
      weatherData.recommendations.slice(0, 3).forEach((rec) => {
        const escapedRec = escapeMarkdown(rec)
          .replace(/-/g, '\\-')
          .replace(/:/g, '\\:');
        message += `→ ${escapedRec}\n`;
      });
      message += '\n';
    }

    if (weatherData.alerts?.hasAlerts && weatherData.alerts.items.length > 0) {
      message += I18nService.t('ATTENTION_ALERTS', lang) + '\n';
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

    message += I18nService.t('UPDATED_AT', lang, {
      time: escapeMarkdown(dateTime.time),
    });

    return message;
  }
}
