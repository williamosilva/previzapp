import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { WeatherMessageService } from './weathermessages.service';
import { OpenWeatherErrorCode } from 'src/types/OpenWeather';

@Controller('weather')
export class WeatherMessagesController {
  private readonly logger = new Logger(WeatherMessagesController.name);

  constructor(private readonly weatherService: WeatherMessageService) {}

  @Get('summary')
  async getWeatherSummary(
    @Query('address') addressStr: string,
    @Query('lang') lang: string = 'en',
  ): Promise<any> {
    try {
      if (!addressStr) {
        throw new HttpException(
          'Address parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // O método agora retorna dados de ambas as requisições tratadas (endpoint '/' e endpoint '/overview')
      return await this.weatherService.getWeatherSummary(addressStr, lang);
    } catch (error) {
      if (error.message && error.message.includes('Translation')) {
        // Erros relacionados a api de clima são tratados no arquivo que gerencia as requisicões(openweather.error-handle), aqui somente exceções
        this.logger.error(`Error in translation service: ${error.message}`);
        throw new HttpException(
          'Error translating weather information',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Repassa o erro se for uma HttpException
      if (error instanceof HttpException) {
        throw error;
      }

      // Para outros erros não tratados
      this.logger.error(`Unhandled error: ${error.message}`, error.stack);
      throw new HttpException(
        'Error processing request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
