import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherMessagesModule } from './modules/weather-messages/weathermessages.module';
import { OpenWeatherModule } from './modules/open-weather/openweather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OpenWeatherModule,
    WeatherMessagesModule,
  ],
})
export class AppModule {}
