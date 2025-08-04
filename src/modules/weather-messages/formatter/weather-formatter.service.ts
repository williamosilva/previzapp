import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherFormatterService {
  formatDateTime(timestamp: number): {
    formattedDate: string;
    formattedTime: string;
  } {
    // Aplicar offset de São Paulo (UTC-3)
    const timezoneOffset = -3 * 60 * 60 * 1000; // -3 horas em millisegundos
    const dateTime = new Date(timestamp * 1000 + timezoneOffset);

    const formattedTime = dateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC', // Usar UTC pois já aplicamos o offset manualmente
    });

    const formattedDate = dateTime.toISOString().split('T')[0];

    return { formattedDate, formattedTime };
  }

  formatSunTimes(
    sunrise: number,
    sunset: number,
  ): { formattedSunrise: string; formattedSunset: string } {
    const timezoneOffset = -3 * 60 * 60 * 1000;

    const sunriseTime = new Date(sunrise * 1000 + timezoneOffset);
    const sunsetTime = new Date(sunset * 1000 + timezoneOffset);

    const formattedSunrise = sunriseTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

    const formattedSunset = sunsetTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

    return { formattedSunrise, formattedSunset };
  }

  formatAlertTimes(
    start: number,
    end: number,
  ): { formattedStartTime: string; formattedEndTime: string } {
    const timezoneOffset = -3 * 60 * 60 * 1000;

    const startTime = new Date(start * 1000 + timezoneOffset);
    const endTime = new Date(end * 1000 + timezoneOffset);

    const formattedStartTime = `${startTime.toISOString().split('T')[0]} ${startTime.toLocaleTimeString(
      'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      },
    )}`;

    const formattedEndTime = `${endTime.toISOString().split('T')[0]} ${endTime.toLocaleTimeString(
      'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      },
    )}`;

    return { formattedStartTime, formattedEndTime };
  }

  processTemperature(
    temp: number,
    feelsLike: number,
  ): { tempCelsius: number; feelsLikeCelsius: number } {
    const tempCelsius = temp - 273.15;
    const feelsLikeCelsius = feelsLike - 273.15;

    return { tempCelsius, feelsLikeCelsius };
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
