import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherMessagesModule } from './modules/WeatherMessages/weathermessages.module';
import { OpenWeatherModule } from './modules/OpenWeather/openweather.module';

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
