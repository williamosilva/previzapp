import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
//@ts-ignore
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private isEnabled = false;

  constructor(
    @InjectBot() private bot: Telegraf,
    private readonly configService: ConfigService,
  ) {
    this.isEnabled =
      this.configService.get<string>('ENABLE_TELEGRAM') === 'true';
  }

  async onModuleInit() {
    if (!this.isEnabled) {
      this.logger.log('Telegram module is disabled by configuration');
      return;
    }
    this.logger.log('Telegram module is enabled and ready');
  }

  public isTelegramEnabled(): boolean {
    return this.isEnabled;
  }

  async sendMessage(chatId: number, message: string) {
    if (!this.isEnabled) {
      this.logger.warn('Telegram is disabled, cannot send message');
      return;
    }

    try {
      return await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      throw error;
    }
  }

  async sendMessageWithInlineKeyboard(
    chatId: number,
    message: string,
    keyboard: any,
  ) {
    if (!this.isEnabled) {
      this.logger.warn(
        'Telegram is disabled, cannot send message with keyboard',
      );
      return;
    }

    try {
      return await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } catch (error) {
      this.logger.error(
        `Error sending message with inline keyboard: ${error.message}`,
      );
      throw error;
    }
  }

  async editMessage(
    chatId: number,
    messageId: number,
    newText: string,
    keyboard?: any,
  ) {
    if (!this.isEnabled) {
      this.logger.warn('Telegram is disabled, cannot edit message');
      return;
    }

    try {
      return await this.bot.telegram.editMessageText(
        chatId,
        messageId,
        undefined,
        newText,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      );
    } catch (error) {
      this.logger.error(`Error editing message: ${error.message}`);
      throw error;
    }
  }

  async sendTypingAction(chatId: number) {
    if (!this.isEnabled) {
      this.logger.warn('Telegram is disabled, cannot send typing action');
      return;
    }

    try {
      return await this.bot.telegram.sendChatAction(chatId, 'typing');
    } catch (error) {
      this.logger.error(`Error sending typing action: ${error.message}`);
    }
  }

  async sendMessageWithMarkdown(chatId: number, message: string) {
    if (!this.isEnabled) {
      this.logger.warn(
        'Telegram is disabled, cannot send message with markdown',
      );
      return;
    }

    try {
      return await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      } as any);
    } catch (markdownError) {
      this.logger.warn(
        `MarkdownV2 failed (${markdownError.message}), trying HTML...`,
      );

      try {
        const htmlMessage = message
          .replace(/\\([_*\[\]()~`>#+\-=|{}.!:-])/g, '$1')
          .replace(/\n/g, '<br>');

        return await this.bot.telegram.sendMessage(chatId, htmlMessage, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        } as any);
      } catch (htmlError) {
        this.logger.warn(
          `HTML failed (${htmlError.message}), trying plain text...`,
        );

        try {
          const plainMessage = message
            .replace(/\\([_*\[\]()~`>#+\-=|{}.!:-])/g, '$1')
            .replace(/\*/g, '')
            .replace(/_/g, '');

          return await this.bot.telegram.sendMessage(chatId, plainMessage, {
            disable_web_page_preview: true,
          } as any);
        } catch (finalError) {
          this.logger.error(`Error sending message: ${finalError.message}`);
          throw finalError;
        }
      }
    }
  }

  async answerCallbackQuery(
    callbackQueryId: string,
    text?: string,
    showAlert?: boolean,
  ) {
    if (!this.isEnabled) {
      this.logger.warn('Telegram is disabled, cannot answer callback query');
      return;
    }

    try {
      return await this.bot.telegram.answerCbQuery(
        callbackQueryId,
        text,
        showAlert,
      );
    } catch (error) {
      this.logger.error(`Error responding to callback query: ${error.message}`);
      throw error;
    }
  }

  async deleteMessage(chatId: number, messageId: number) {
    if (!this.isEnabled) {
      this.logger.warn('Telegram is disabled, cannot delete message');
      return;
    }

    try {
      return await this.bot.telegram.deleteMessage(chatId, messageId);
    } catch (error) {
      this.logger.error(`Error deleting message: ${error.message}`);
      throw error;
    }
  }
}
