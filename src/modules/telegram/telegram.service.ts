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
}
