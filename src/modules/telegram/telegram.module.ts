import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { WeatherMessagesModule } from '../weather-messages/weather-messages.module';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const token = configService.get<string>('TELEGRAM_BOT_TOKEN');

        if (!token) {
          throw new Error(
            'TELEGRAM_BOT_TOKEN não está definida nas variáveis de ambiente',
          );
        }

        return {
          token,
        };
      },
      inject: [ConfigService],
    }),
    WeatherMessagesModule,
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
