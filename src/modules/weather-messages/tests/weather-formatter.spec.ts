import { WeatherFormatterService } from '../formatter/weather-formatter.service';

describe('WeatherFormatterService', () => {
  let service: WeatherFormatterService;

  beforeEach(() => {
    service = new WeatherFormatterService();

    // Ajustando o mock para retornar os valores esperados nos testes
    jest
      .spyOn(Date.prototype, 'toLocaleTimeString')
      .mockImplementation(function (locale, options) {
        if (this.getTime() === 1615881600000) {
          // sunrise/start time
          return '10:00';
        } else if (this.getTime() === 1615925400000) {
          // sunset/end time
          return '22:30';
        }
        return '00:00';
      });

    // Mock toISOString para garantir a data correta
    jest.spyOn(Date.prototype, 'toISOString').mockImplementation(function () {
      if (this.getTime() === 1615881600000) {
        // sunrise/start time
        return '2021-03-16T10:00:00.000Z';
      } else if (this.getTime() === 1615925400000) {
        // sunset/end time
        return '2021-03-16T22:30:00.000Z';
      }
      return '2021-03-16T00:00:00.000Z';
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatDateTime', () => {
    it('must format timestamp into date and time correctly', () => {
      const timestamp = 1615881600; // 16 de março de 2021, 10:00:00 UTC

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

      const result = service.formatAlertTimes(start, end);

      expect(result).toEqual({
        formattedStartTime: '2021-03-16 10:00',
        formattedEndTime: '2021-03-16 22:30',
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
