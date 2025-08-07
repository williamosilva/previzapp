import { Module } from '@nestjs/common';
import { WeatherMessagesModule } from '../weather-messages/weather-messages.module';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [WeatherMessagesModule],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
