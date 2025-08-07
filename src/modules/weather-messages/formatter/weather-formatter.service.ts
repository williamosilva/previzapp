import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherFormatterService {
  private getLocaleFromTimezone(timezone: string): string {
    const timezoneToLocale: Record<string, string> = {
      'America/Sao_Paulo': 'pt-BR',
      'America/Manaus': 'pt-BR',
      'America/Belem': 'pt-BR',
      'America/Fortaleza': 'pt-BR',
      'America/Recife': 'pt-BR',
      'America/Bahia': 'pt-BR',
      'America/Campo_Grande': 'pt-BR',
      'America/Cuiaba': 'pt-BR',
      'America/Porto_Velho': 'pt-BR',
      'America/Boa_Vista': 'pt-BR',
      'America/Rio_Branco': 'pt-BR',
    };

    return timezoneToLocale[timezone] || 'en-CA';
  }

  formatDateTime(
    timestamp: number,
    timezone: string = 'America/Sao_Paulo',
  ): {
    formattedDate: string;
    formattedTime: string;
  } {
    const dateTime = new Date(timestamp * 1000);

    const formattedTime = dateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    });

    // Determinar o locale baseado no timezone
    const locale = this.getLocaleFromTimezone(timezone);

    const formattedDate = dateTime.toLocaleDateString(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return { formattedDate, formattedTime };
  }

  formatSunTimes(
    sunrise: number,
    sunset: number,
    timezone: string = 'America/Sao_Paulo',
  ): { formattedSunrise: string; formattedSunset: string } {
    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);

    const formattedSunrise = sunriseTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    });

    const formattedSunset = sunsetTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
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
