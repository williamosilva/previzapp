import { WeatherFormatterService } from '../formatter/weather-formatter.service';

describe('WeatherFormatterService', () => {
  let service: WeatherFormatterService;

  beforeEach(() => {
    service = new WeatherFormatterService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatDateTime', () => {
    it('must format timestamp into date and time correctly', () => {
      const timestamp = 1615881600; // 16 de março de 2021, 10:00:00 UTC

      jest
        .spyOn(Date.prototype, 'toLocaleDateString')
        .mockImplementation(
          (
            locale?: string | string[],
            options?: Intl.DateTimeFormatOptions,
          ) => {
            return '2021-03-16';
          },
        );

      jest
        .spyOn(Date.prototype, 'toLocaleTimeString')
        .mockImplementation(
          (
            locale?: string | string[],
            options?: Intl.DateTimeFormatOptions,
          ) => {
            return '10:00';
          },
        );

      const result = service.formatDateTime(timestamp);

      expect(result).toEqual({
        formattedDate: '2021-03-16',
        formattedTime: '10:00',
      });
    });
  });

  describe('formatSunTimes', () => {
    it('should format sunrise and sunset times correctly', () => {
      const sunrise = 1615881600; // 16 de março de 2021, 10:00:00 UTC
      const sunset = 1615925400; // 16 de março de 2021, 22:30:00 UTC

      jest
        .spyOn(Date.prototype, 'toLocaleTimeString')
        .mockImplementation(function (
          this: Date,
          locale?: string | string[],
          options?: Intl.DateTimeFormatOptions,
        ) {
          if (this.getTime() === 1615881600000) {
            return '10:00';
          } else if (this.getTime() === 1615925400000) {
            return '22:30';
          }
          return '00:00';
        });

      const result = service.formatSunTimes(sunrise, sunset);

      expect(result).toEqual({
        formattedSunrise: '10:00',
        formattedSunset: '22:30',
      });
    });
  });

  describe('formatAlertTimes', () => {
    it('should format alert times correctly', () => {
      const start = 1615881600; // 16 de março de 2021, 10:00:00 UTC
      const end = 1615925400; // 16 de março de 2021, 22:30:00 UTC

      const timezoneOffset = -3 * 60 * 60 * 1000; // UTC-3 offset used by the service
      const adjustedStart = start * 1000 + timezoneOffset;
      const adjustedEnd = end * 1000 + timezoneOffset;

      jest
        .spyOn(Date.prototype, 'toLocaleTimeString')
        .mockImplementation(function (
          this: Date,
          locale?: string | string[],
          options?: Intl.DateTimeFormatOptions,
        ) {
          if (this.getTime() === adjustedStart) {
            return '07:00'; // 10:00 UTC - 3 hours = 07:00
          } else if (this.getTime() === adjustedEnd) {
            return '19:30'; // 22:30 UTC - 3 hours = 19:30
          }
          return '00:00';
        });

      const result = service.formatAlertTimes(start, end);

      expect(result).toEqual({
        formattedStartTime: '2021-03-16 07:00', // Adjusted for UTC-3
        formattedEndTime: '2021-03-16 19:30', // Adjusted for UTC-3
      });
    });
  });

  describe('processTemperature', () => {
    it('should convert temperature from Kelvin to Celsius correctly', () => {
      const temp = 300; // 300K = 26.85°C
      const feelsLike = 305; // 305K = 31.85°C

      const result = service.processTemperature(temp, feelsLike);

      expect(result.tempCelsius).toBeCloseTo(26.85, 2);
      expect(result.feelsLikeCelsius).toBeCloseTo(31.85, 2);
    });

    it('should convert temperature from 0 Kelvin to Celsius correctly', () => {
      const temp = 0;
      const feelsLike = 0;

      const result = service.processTemperature(temp, feelsLike);

      expect(result.tempCelsius).toBeCloseTo(-273.15, 2);
      expect(result.feelsLikeCelsius).toBeCloseTo(-273.15, 2);
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('must capitalize the first letter of a string', () => {
      const text = 'cloudy';

      const result = service.capitalizeFirstLetter(text);
      expect(result).toBe('Cloudy');
    });

    it('must handle empty strings', () => {
      const text = '';

      const result = service.capitalizeFirstLetter(text);

      expect(result).toBe('');
    });

    it('must handle strings that already start with a capital letter', () => {
      const text = 'Sunny';

      const result = service.capitalizeFirstLetter(text);

      expect(result).toBe('Sunny');
    });
  });
});
