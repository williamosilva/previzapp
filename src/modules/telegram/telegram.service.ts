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
}
