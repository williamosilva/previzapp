import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  OpenWeatherParams,
  OpenWeatherOverviewResponse,
  ProcessedWeatherOverview,
  OpenWeatherOneCallResponse,
  ProcessedOneCallData,
} from '../../types/open-weather';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OpenWeatherConfigService } from './config/openweather.config';
import { OpenWeatherErrorHandler } from './errors/openweather.error-handler';
import { OpenWeatherValidator } from './validators/openweather.validator';

// O service resumidante suporta duas funções principais: getWeatherOverview e getOneCallData
// Ambas funções são responsáveis por fazer a requisição para a API do OpenWeather e processar a resposta (Dois endpoints diferentes)
// Ambas estão tratadas com o catchError para lidar com possíveis erros na requisição e no processamento da resposta

@Injectable()
export class OpenWeatherService {
  private readonly logger = new Logger(OpenWeatherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: OpenWeatherConfigService,
    private readonly errorHandler: OpenWeatherErrorHandler,
    private readonly validator: OpenWeatherValidator,
  ) {}

  // Função do service para obter o resumo do clima (weather overview)
  public getWeatherOverview(
    params: OpenWeatherParams,
  ): Observable<ProcessedWeatherOverview> {
    this.validator.validateParams(params);

    const queryParams = this.buildQueryParams(params);

    return this.httpService.get('/overview', { params: queryParams }).pipe(
      map((response) => this.processWeatherOverview(response.data)),
      catchError((error) => this.errorHandler.handleError(error)),
    );
  }

  // Função para o endpoint raiz (onecall)
  public getOneCallData(
    params: OpenWeatherParams,
  ): Observable<ProcessedOneCallData> {
    this.validator.validateParams(params);

    const queryParams = this.buildQueryParams(params);

    // this.logger.log(
    //   `Getting onecall weather data for: lat=${params.lat}, lon=${params.lon}`,
    // );

    // Chamada para o endpoint raiz (sem especificar caminho)
    return this.httpService.get('', { params: queryParams }).pipe(
      map((response) => this.processOneCallData(response.data)),
      catchError((error) => this.errorHandler.handleError(error)),
    );
  }

  // Construção dos parâmetros da requisição da OpenWeather
  private buildQueryParams(params: OpenWeatherParams): any {
    return {
      lon: params.lon,
      lat: params.lat,
      appid: this.configService.getApiKey,
      units: this.configService.getDefaultUnits,
      exclude: this.configService.getExcludeParams,
    };
  }

  // Formatação da resposta da API do OpenWeather (overview)
  private processWeatherOverview(
    data: OpenWeatherOverviewResponse,
  ): ProcessedWeatherOverview {
    return {
      location: {
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.tz,
      },
      date: data.date,
      units: data.units,
      overview: data.weather_overview,
    };
  }

  // Formatação da resposta da API do OpenWeather (onecall)
  private processOneCallData(
    data: OpenWeatherOneCallResponse,
  ): ProcessedOneCallData {
    return {
      location: {
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
      },
      current: data.current,
      alerts: data.alerts,
    };
  }
}
