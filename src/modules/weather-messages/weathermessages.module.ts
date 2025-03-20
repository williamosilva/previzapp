import { Module } from '@nestjs/common';
import { WeatherMessagesController } from './weathermessages.controller';
import { WeatherMessageService } from './weathermessages.service';
import { OpenWeatherModule } from '../open-weather/openweather.module';
import { GeolocationModule } from '../Geolocation-x/geolocation.module';
import { TranslationModule } from '../translation-module/translation.module';
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
})
export class WeatherMessagesModule {}
