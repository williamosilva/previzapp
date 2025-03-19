import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenWeatherService } from './openweather.service';
import { OpenWeatherErrorHandler } from './errors/openweather.error-handler';
import { OpenWeatherConfigService } from './config/openweather.config';
import { OpenWeatherValidator } from './validators/openweather.validator';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        //  TimeOut e MaxRedirects são variáveis que servem para configurar o tempo máximo de espera e o número máximo de redirecionamentos, respectivamente.
        //   Importante para evitar que a aplicação fique esperando por muito tempo por uma resposta ou que fique
        //   em um loop infinito de redirecionamentos caso a api de clima retorne um redirecionamento inesperado.
        timeout: configService.get('HTTP_TIMEOUT', 5000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
        baseURL: 'https://api.openweathermap.org/data/3.0/onecall',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    OpenWeatherService,
    OpenWeatherErrorHandler,
    OpenWeatherConfigService,
    OpenWeatherValidator,
  ],
  exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
