import { Injectable } from '@nestjs/common';
import { WeatherFormatterService } from '../formatter/weather-formatter.service';
import {
  determineAlertSeverity,
  generateClassifications,
  generateWeatherRecommendations,
  getWindDirection,
} from '../../../utils/index';
import {
  ProcessedWeatherOverview,
  ProcessedOneCallData,
  WeatherResponse,
} from '../types/';

@Injectable()
export class WeatherProcessorService {
  constructor(private readonly weatherFormatter: WeatherFormatterService) {}

  processWeatherData(
    overviewData: ProcessedWeatherOverview,
    oneCallData: ProcessedOneCallData,
    addressName: string = '',
    timezone: string = 'America/Sao_Paulo',
  ): WeatherResponse {
    const processedCurrentData = this.processCurrentData(oneCallData, timezone);

    const processedAlerts = this.processAlerts(oneCallData.alerts);

    // Combina todos os dados para o formato final de saída
    return {
      location: {
        address: addressName,
        latitude: overviewData.location.latitude,
        longitude: overviewData.location.longitude,
      },
      dateTime: {
        timestamp: oneCallData.current.dt,
        timezone: oneCallData.location.timezone,
        date: processedCurrentData.dateTime.formattedDate,
        time: processedCurrentData.dateTime.formattedTime,
      },
      currentData: processedCurrentData.weather,
      alerts: {
        hasAlerts: processedAlerts.length > 0,
        count: processedAlerts.length,
        items: processedAlerts,
      },
      recommendations: generateWeatherRecommendations(oneCallData),
      classifications: generateClassifications(oneCallData),
      summary: overviewData.overview,
    };
  }

  private processCurrentData(
    oneCallData: ProcessedOneCallData,
    timezone: string,
  ) {
    console.log('Processing current data:', oneCallData);

    const { formattedDate, formattedTime } =
      this.weatherFormatter.formatDateTime(oneCallData.current.dt, timezone);

    const { formattedSunrise, formattedSunset } =
      this.weatherFormatter.formatSunTimes(
        oneCallData.current.sunrise,
        oneCallData.current.sunset,
        timezone,
      );

    const { tempCelsius, feelsLikeCelsius } =
      this.weatherFormatter.processTemperature(
        oneCallData.current.temp,
        oneCallData.current.feels_like,
      );

    const weatherInfo = oneCallData.current.weather[0];
    const processedWeather = {
      main: weatherInfo.main,
      description: this.weatherFormatter.capitalizeFirstLetter(
        weatherInfo.description,
      ),
      icon: {
        id: weatherInfo.icon,
        url: `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`,
      },
    };

    const processedCurrent = {
      sun: {
        sunrise: formattedSunrise,
        sunset: formattedSunset,
      },
      temperature: {
        kelvin: oneCallData.current.temp,
        celsius: parseFloat(tempCelsius.toFixed(1)),
        feelsLike: {
          kelvin: oneCallData.current.feels_like,
          celsius: parseFloat(feelsLikeCelsius.toFixed(1)),
        },
      },
      atmosphere: {
        pressure: oneCallData.current.pressure,
        humidity: oneCallData.current.humidity,
        dewPoint: oneCallData.current.dew_point,
        uvIndex: oneCallData.current.uvi,
        clouds: oneCallData.current.clouds,
        visibility: oneCallData.current.visibility,
      },
      wind: {
        speed: oneCallData.current.wind_speed,
        degree: oneCallData.current.wind_deg,
        gust: oneCallData.current.wind_gust,
        direction: getWindDirection(oneCallData.current.wind_deg),
      },
      weather: processedWeather,
    };

    return {
      dateTime: { formattedDate, formattedTime },
      weather: processedCurrent,
    };
  }

  private processAlerts(alerts: ProcessedOneCallData['alerts'] = []) {
    return (
      alerts?.map((alert) => {
        const { formattedStartTime, formattedEndTime } =
          this.weatherFormatter.formatAlertTimes(alert.start, alert.end);

        return {
          source: alert.sender_name,
          type: alert.event,
          period: {
            start: formattedStartTime,
            end: formattedEndTime,
            durationHours: Math.round((alert.end - alert.start) / 3600),
          },
          description: alert.description,
          categories: alert.tags,
          severity: determineAlertSeverity(alert.description, alert.tags),
        };
      }) || []
    );
  }
}
