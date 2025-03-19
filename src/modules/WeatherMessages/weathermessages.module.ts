import { Module } from '@nestjs/common';
import { WeatherMessagesController } from './weathermessages.controller';
import { WeatherMessageService } from './weathermessages.service';
import { OpenWeatherModule } from '../OpenWeather/openweather.module';
import { GeolocationModule } from '../Geolocation/geolocation.module';
import { TranslationModule } from '../TranslationModule/translation.module';
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
