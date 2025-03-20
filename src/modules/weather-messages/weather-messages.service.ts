import { Injectable, Logger } from '@nestjs/common';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import { TranslationService } from '../translation/translation.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { WeatherProcessorService } from './processor/weather-processor.service';

import { firstValueFrom } from 'rxjs';
import { WeatherResponse } from './types';

@Injectable()
export class WeatherMessageService {
  private readonly logger = new Logger(WeatherMessageService.name);

  constructor(
    private readonly openWeatherService: OpenWeatherService,
    private readonly geolocationService: GeolocationService,
    private readonly translationService: TranslationService,
    private readonly weatherProcessor: WeatherProcessorService,
  ) {}

  async getWeatherSummary(
    address: string,
    lang: string,
  ): Promise<WeatherResponse> {
    const coordinates =
      await this.geolocationService.getCoordinatesFromAddress(address);
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    const addressName = coordinates.address;

    // Executa ambas as chamadas em paralelo
    const [overviewData, oneCallData] = await Promise.all([
      firstValueFrom(
        this.openWeatherService.getWeatherOverview({
          lat: latitude,
          lon: longitude,
        }),
      ),
      firstValueFrom(
        this.openWeatherService.getOneCallData({
          lat: latitude,
          lon: longitude,
        }),
      ),
    ]);

    const combinedData = this.weatherProcessor.processWeatherData(
      overviewData,
      oneCallData,
      addressName,
    );

    return await this.translationService.translateObject(combinedData, lang);
  }
}
