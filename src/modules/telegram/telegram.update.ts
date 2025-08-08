import { Update, Ctx, Start, On, Command } from 'nestjs-telegraf';
//@ts-ignore
import { Context } from 'telegraf';
import { Injectable, Logger } from '@nestjs/common';

import { TelegramService } from './telegram.service';
import { WeatherMessageService } from '../weather-messages/weather-messages.service';
import { I18nService } from './i18n/i18n';
import { UserSession } from './types';

@Update()
@Injectable()
export class TelegramUpdate {
  private readonly logger = new Logger(TelegramUpdate.name);
  private userSessions = new Map<number, UserSession>();

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
    if (!ctx.chat) {
      this.logger.error('No chat context available');
      return;
    }

    const chatId = ctx.chat.id;

    this.userSessions.delete(chatId);

    const welcomeMessage = [
      I18nService.t('WELCOME_TITLE', 'en'),
      I18nService.t('WELCOME_MESSAGE', 'en'),
      I18nService.t('WELCOME_EXAMPLES', 'en'),
      I18nService.t('WELCOME_HELP_TIP', 'en'),
    ].join('\n\n');

    await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
  }

  @Command('help')
  async help(@Ctx() ctx: Context) {
    const helpMessage = [
      I18nService.t('HELP_TITLE', 'en'),
      '',
      I18nService.t('HELP_STEP1', 'en'),
      I18nService.t('HELP_STEP2', 'en'),
      I18nService.t('HELP_STEP3', 'en'),
      '',
      I18nService.t('HELP_AVAILABLE_COMMANDS', 'en'),
      I18nService.t('HELP_START_COMMAND', 'en'),
      I18nService.t('HELP_HELP_COMMAND', 'en'),
      I18nService.t('HELP_CANCEL_COMMAND', 'en'),
      '',
      I18nService.t('HELP_USAGE_EXAMPLES', 'en'),
      '',
      I18nService.t('HELP_SUPPORTED_LANGUAGES', 'en'),
    ].join('\n');

    await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
  }

  @Command('cancel')
  async cancel(@Ctx() ctx: Context) {
    if (!ctx.chat) {
      this.logger.error('No chat context available');
      return;
    }

    const chatId = ctx.chat.id;

    this.userSessions.delete(chatId);
    await ctx.reply(I18nService.t('ERROR_OPERATION_CANCELLED', 'en'));
  }

  @On('text')
  async handleMessage(@Ctx() ctx: Context) {
    if (!ctx.message) {
      this.logger.error('No message context available');
      return;
    }

    const message = ctx.message;

    if (!('text' in message)) {
      await ctx.reply(I18nService.t('ERROR_TEXT_ONLY', 'en'));
      return;
    }

    if (!ctx.chat) {
      this.logger.error('No chat context available');
      return;
    }

    const userText = message.text.trim();
    const chatId = ctx.chat.id;

    if (userText.startsWith('/')) {
      return;
    }

    let session = this.userSessions.get(chatId);

    if (session?.waitingForLanguage) {
      await this.handleLanguageSelection(ctx, userText, chatId);
      return;
    }

    await this.handleLocationRequest(ctx, userText, chatId);
  }

  private async handleLocationRequest(
    ctx: Context,
    location: string,
    chatId: number,
  ) {
    this.logger.log(`New weather request for: ${location}`);

    const session: UserSession = {
      chatId,
      location,
      waitingForLanguage: true,
    };
    this.userSessions.set(chatId, session);

    const languageButtons = Object.keys(this.languages).map((lang) => [
      { text: lang, callback_data: `lang_${this.languages[lang]}` },
    ]);

    const keyboard = {
      inline_keyboard: languageButtons,
    };

    const languageMessage = [
      I18nService.t('LANGUAGE_SELECTION_TITLE', 'en', { location }),
      I18nService.t('LANGUAGE_SELECTION_MESSAGE', 'en'),
    ].join('\n\n');

    try {
      await ctx.reply(languageMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } catch (error) {
      this.logger.warn('Inline keyboard failed, using fallback text');

      let fallbackMessage =
        I18nService.t('LANGUAGE_FALLBACK_MESSAGE', 'en', { location }) + '\n\n';
      Object.keys(this.languages).forEach((lang, index) => {
        fallbackMessage += `${index + 1}. ${lang}\n`;
      });
      fallbackMessage +=
        '\n' + I18nService.t('LANGUAGE_FALLBACK_INSTRUCTION', 'en');

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
      await ctx.reply(I18nService.t('ERROR_INVALID_SESSION', 'en'));
      this.userSessions.delete(chatId);
      return;
    }

    let selectedLanguageCode: string | null = null;

    const numberMatch = input.match(/^([1-9])$/);
    if (numberMatch) {
      const index = parseInt(numberMatch[1]) - 1;
      const languages = Object.values(this.languages);
      if (index >= 0 && index < languages.length) {
        selectedLanguageCode = languages[index];
      }
    } else {
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
      await ctx.reply(I18nService.t('ERROR_LANGUAGE_NOT_RECOGNIZED', 'en'));
      return;
    }

    session.selectedLanguage = selectedLanguageCode;
    session.waitingForLanguage = false;

    await this.fetchAndSendWeatherData(ctx, session);
  }

  @On('callback_query')
  async handleCallbackQuery(@Ctx() ctx: any) {
    if (
      !ctx.callbackQuery ||
      !ctx.callbackQuery.data ||
      !ctx.callbackQuery.message?.chat?.id
    ) {
      this.logger.error('Invalid callback query context');
      return;
    }

    const callbackData = ctx.callbackQuery.data;
    const chatId = ctx.callbackQuery.message.chat.id;

    if (callbackData.startsWith('lang_')) {
      const languageCode = callbackData.replace('lang_', '');
      const session = this.userSessions.get(chatId);

      if (!session || !session.location) {
        await ctx.answerCbQuery(I18nService.t('ERROR_SESSION_EXPIRED', 'en'));
        return;
      }

      const languageName = I18nService.getLanguageDisplayName(languageCode);

      await ctx.answerCbQuery(
        I18nService.t('LANGUAGE_SELECTED', languageCode, {
          language: languageName,
        }),
      );
      session.selectedLanguage = languageCode;
      session.waitingForLanguage = false;

      await this.fetchAndSendWeatherData(ctx, session);
    }
  }

  private async fetchAndSendWeatherData(ctx: Context, session: UserSession) {
    const { location, selectedLanguage, chatId } = session;

    try {
      await this.telegramService.sendTypingAction(chatId);

      this.userSessions.delete(chatId);

      this.logger.log(
        `Searching weather for ${location} in language ${selectedLanguage}`,
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

      await ctx.reply(
        I18nService.t('NEW_CONSULTATION_TIP', selectedLanguage!),
        { parse_mode: 'Markdown' },
      );
    } catch (error) {
      this.logger.error(`Error processing weather for ${location}:`, error);

      this.userSessions.delete(chatId);

      let errorMessage = I18nService.t(
        'ERROR_WEATHER_FETCH',
        selectedLanguage || 'en',
      );
      if (
        error.message?.includes('not found') ||
        error.message?.includes('404')
      ) {
        errorMessage = I18nService.t(
          'ERROR_CITY_NOT_FOUND',
          selectedLanguage || 'en',
        );
      } else if (
        error.message?.includes('network') ||
        error.message?.includes('timeout')
      ) {
        errorMessage = I18nService.t(
          'ERROR_NETWORK_PROBLEM',
          selectedLanguage || 'en',
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
      : 'No description';

    const classifications = weatherData.classifications || {};
    const tempClass = classifications.temperature || 'N/A';
    const humidityClass = classifications.humidity || 'N/A';
    const windClass = classifications.windSpeed || 'N/A';
    const uvClass = classifications.uvIndex || 'N/A';

    let message =
      I18nService.t('WEATHER_FORECAST_FOR', lang, { location }) + '\n';
    message += `📅 ${escapeMarkdown(dateTime.date)} \\| ⏰ ${escapeMarkdown(dateTime.time)}\n\n`;
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
