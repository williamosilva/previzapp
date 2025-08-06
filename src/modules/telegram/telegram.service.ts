// src/modules/telegram/telegram.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
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
      this.logger.error(`Erro ao enviar mensagem: ${error.message}`);
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
        `Erro ao enviar mensagem com teclado inline: ${error.message}`,
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
      this.logger.error(`Erro ao editar mensagem: ${error.message}`);
      throw error;
    }
  }

  async sendTypingAction(chatId: number) {
    try {
      return await this.bot.telegram.sendChatAction(chatId, 'typing');
    } catch (error) {
      this.logger.error(`Erro ao enviar ação de digitação: ${error.message}`);
    }
  }

  async sendMessageWithMarkdown(chatId: number, message: string) {
    try {
      // Tentativa com MarkdownV2
      return await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'MarkdownV2',
        // @ts-ignore
        disable_web_page_preview: true,
      });
    } catch (markdownError) {
      this.logger.warn(
        `Falha no MarkdownV2 (${markdownError.message}), tentando HTML...`,
      );

      // Fallback para HTML se falhar
      try {
        const htmlMessage = message
          .replace(/\\([_*\[\]()~`>#+\-=|{}.!:-])/g, '$1') // Remove escapes
          .replace(/\n/g, '<br>');

        return await this.bot.telegram.sendMessage(chatId, htmlMessage, {
          parse_mode: 'HTML',
          // @ts-ignore
          disable_web_page_preview: true,
        });
      } catch (htmlError) {
        this.logger.warn(
          `Falha no HTML (${htmlError.message}), tentando texto simples...`,
        );

        // Fallback final para texto simples
        try {
          const plainMessage = message
            .replace(/\\([_*\[\]()~`>#+\-=|{}.!:-])/g, '$1') // Remove escapes
            .replace(/\*/g, '') // Remove asteriscos
            .replace(/_/g, ''); // Remove underscores

          return await this.bot.telegram.sendMessage(chatId, plainMessage, {
            // @ts-ignore
            disable_web_page_preview: true,
          });
        } catch (finalError) {
          this.logger.error(`Erro ao enviar mensagem: ${finalError.message}`);
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
        // @ts-ignore
        showAlert,
      );
    } catch (error) {
      this.logger.error(`Erro ao responder callback query: ${error.message}`);
      throw error;
    }
  }

  async deleteMessage(chatId: number, messageId: number) {
    try {
      return await this.bot.telegram.deleteMessage(chatId, messageId);
    } catch (error) {
      this.logger.error(`Erro ao deletar mensagem: ${error.message}`);
      throw error;
    }
  }
}
