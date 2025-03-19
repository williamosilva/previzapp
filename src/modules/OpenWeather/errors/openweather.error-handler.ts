import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable, throwError } from 'rxjs';
import { OpenWeatherError, OpenWeatherErrorCode } from 'src/types/OpenWeather';

@Injectable()
export class OpenWeatherErrorHandler {
  private readonly logger = new Logger(OpenWeatherErrorHandler.name);

  handleError(error: AxiosError): Observable<never> {
    let openWeatherError: OpenWeatherError;

    // Log detalhado para debugging
    this.logger.error(
      `Error in request to OpenWeather: ${error.message}`,
      error.stack,
    );

    // Mapeia os erros da API para nossos tipos internos
    if (error.response) {
      const statusCode = error.response.status;
      const data = error.response.data as any;

      switch (statusCode) {
        case 401:
          openWeatherError = {
            code: OpenWeatherErrorCode.INVALID_API_KEY,
            message: 'Invalid or missing API key',
            originalError: data,
            statusCode,
          };
          break;

        case 404:
          openWeatherError = {
            code: OpenWeatherErrorCode.COORDINATES_NOT_FOUND,
            message: 'Coordinates not found or invalid',
            originalError: data,
            statusCode,
          };
          break;

        // O plano gratuito da api do OpenWeather tem limite de 1000 requisições por dia, caso passe disso cai aqui
        case 429:
          openWeatherError = {
            code: OpenWeatherErrorCode.RATE_LIMIT_EXCEEDED,
            message: 'Request limit exceeded',
            originalError: data,
            statusCode,
          };
          break;

        case 400:
          openWeatherError = {
            code: OpenWeatherErrorCode.INVALID_PARAMETERS,
            message: 'Invalid request parameters',
            originalError: data,
            statusCode,
          };
          break;

        default:
          openWeatherError = {
            code: OpenWeatherErrorCode.UNEXPECTED_ERROR,
            message: `Unexpected error: ${data?.message || error.message}`,
            originalError: data,
            statusCode,
          };
      }
    } else {
      // Erro de rede ou outro tipo de erro não tratado (O servidor do OpenWeather pode estar fora do ar)
      openWeatherError = {
        code: OpenWeatherErrorCode.NETWORK_ERROR,
        message: `Connection error: ${error.message}`,
        originalError: error,
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      };
    }

    return throwError(
      () => new HttpException(openWeatherError, openWeatherError.statusCode),
    );
  }
}
