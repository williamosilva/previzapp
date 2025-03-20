import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Basicamente oque acontece aqui é a verificaçao da chave de API do OpenWeather, caso ela nao exista, um erro é logado no console
// E tambem é feita a verificação das unidades padrão e dos parametros de exclusão

@Injectable()
export class OpenWeatherConfigService {
  private readonly logger = new Logger(OpenWeatherConfigService.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!this.apiKey) {
      this.logger.error('OPENWEATHER_API_KEY is not set!');
    }
  }

  get getApiKey(): string | undefined {
    return this.apiKey;
  }

  get getDefaultUnits(): string {
    return 'standard';
  }

  get getExcludeParams(): string {
    return 'minutely,hourly,daily';
  }
}
