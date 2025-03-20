import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherMessagesModule } from './modules/weather-messages/weather-messages.module';
import { OpenWeatherModule } from './modules/open-weather/open-weather.module';

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
