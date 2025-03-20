import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  OpenWeatherParams,
  OpenWeatherError,
  OpenWeatherErrorCode,
} from '../../../types/open-weather';

@Injectable()
export class OpenWeatherValidator {
  // Valida os parâmetros da requisição para a OpenWeather
  public validateParams(params: OpenWeatherParams): void {
    // Validação se lat e lon foram fornecidos ou não
    if (params.lat === undefined || params.lon === undefined) {
      const error: OpenWeatherError = {
        code: OpenWeatherErrorCode.INVALID_PARAMETERS,
        message: 'It is necessary to provide latitude and longitude',
        statusCode: HttpStatus.BAD_REQUEST,
      };

      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    // Validação adicional para garantir que lat/lon sejam números válidos
    if (isNaN(params.lat) || isNaN(params.lon)) {
      const error: OpenWeatherError = {
        code: OpenWeatherErrorCode.INVALID_PARAMETERS,
        message: 'Latitude and longitude must be valid numbers',
        statusCode: HttpStatus.BAD_REQUEST,
      };

      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
