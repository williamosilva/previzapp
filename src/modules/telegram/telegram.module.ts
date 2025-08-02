import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { WeatherMessagesModule } from '../weather-messages/weather-messages.module';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '8369200170:AAHfyp-t70uggaAstapcSnyZuklohgGLxG4',
    }),
    WeatherMessagesModule,
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
