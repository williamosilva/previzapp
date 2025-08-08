import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
//@ts-ignore
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(@InjectBot() private bot: Telegraf) {}

  async sendMessage(chatId: number, message: string) {
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
    try {
      return await this.bot.telegram.sendChatAction(chatId, 'typing');
    } catch (error) {
      this.logger.error(`Error sending typing action: ${error.message}`);
    }
  }

  async sendMessageWithMarkdown(chatId: number, message: string) {
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
    try {
      return await this.bot.telegram.deleteMessage(chatId, messageId);
    } catch (error) {
      this.logger.error(`Error deleting message: ${error.message}`);
      throw error;
    }
  }
}
