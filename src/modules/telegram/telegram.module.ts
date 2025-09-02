import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { WeatherMessagesModule } from '../weather-messages/weather-messages.module';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';

@Module({})
export class TelegramModule {
  static forRoot(): DynamicModule {
    const isEnabled = process.env.ENABLE_TELEGRAM === 'true';

    if (!isEnabled) {
      // console.log(
      //   '[TelegramModule] Telegram disabled - loading minimal module',
      // );
      return {
        module: TelegramModule,
        imports: [WeatherMessagesModule],
        providers: [TelegramService],
        exports: [TelegramService],
      };
    }

    return {
      module: TelegramModule,
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

            return { token };
          },
          inject: [ConfigService],
        }),
        WeatherMessagesModule,
      ],
      providers: [TelegramService, TelegramUpdate],
      exports: [TelegramService],
    };
  }
}
