import { Module } from '@nestjs/common';
import { WeatherMessagesController } from './weather-messages.controller';
import { WeatherMessageService } from './weather-messages.service';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { GeolocationModule } from '../geolocation/geolocation.module';
import { TranslationModule } from '../translation/translation.module';
import { WeatherFormatterService } from './formatter/weather-formatter.service';
import { WeatherProcessorService } from './processor/weather-processor.service';

@Module({
  imports: [OpenWeatherModule, GeolocationModule, TranslationModule],
  controllers: [WeatherMessagesController],
  providers: [
    WeatherMessageService,
    WeatherFormatterService,
    WeatherProcessorService,
  ],
  exports: [WeatherMessageService],
})
export class WeatherMessagesModule {}
