import { Test, TestingModule } from '@nestjs/testing';
import { WeatherProcessorService } from '../processor/weather-processor.service';
import { WeatherFormatterService } from '../formatter/weather-formatter.service';
import { ProcessedOneCallData, ProcessedWeatherOverview } from '../types';

jest.mock('../../../utils/index', () => ({
  determineAlertSeverity: () => 'High',
  generateClassifications: () => ({
    temperature: 'moderate',
    humidity: 'high',
    windSpeed: 'low',
    uvIndex: 'moderate',
  }),
  generateWeatherRecommendations: () => [
    'Take an umbrella',
    'Avoid areas prone to flooding',
  ],
  getWindDirection: () => 'Sul',
}));

describe('WeatherProcessorService', () => {
  let service: WeatherProcessorService;
  let formatterService: WeatherFormatterService;

  const mockOverviewData: ProcessedWeatherOverview = {
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo',
    },
    date: '2023-10-10',
    units: 'metric',
    overview: 'Cloudy weather with a chance of rain',
  };

  const mockOneCallData: ProcessedOneCallData = {
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo',
    },
    current: {
      dt: 1696939200, // 10/10/2023 12:00:00
      sunrise: 1696928400, // 10/10/2023 09:00:00
      sunset: 1696971600, // 10/10/2023 21:00:00
      temp: 295.15, // 22°C
      feels_like: 294.15, // 21°C
      pressure: 1015,
      humidity: 75,
      dew_point: 290.15,
      uvi: 6.2,
      clouds: 75,
      visibility: 10000,
      wind_speed: 3.6,
      wind_deg: 180,
      wind_gust: 5.1,
      weather: [
        {
          id: 803,
          main: 'Clouds',
          description: 'cloudy',
          icon: '04d',
        },
      ],
    },
    alerts: [
      {
        sender_name: 'INMET',
        event: 'Storm Warning',
        start: 1696950000, // 10/10/2023 18:00:00
        end: 1696971600, // 10/10/2023 21:00:00
        description: 'Storm warning with possibility of flooding',
        tags: ['Flood', 'Rain'],
      },
    ],
  };

  const formatterServiceMock = {
    formatDateTime: jest.fn().mockReturnValue({
      formattedDate: '10/10/2023',
      formattedTime: '12:00',
    }),
    formatSunTimes: jest.fn().mockReturnValue({
      formattedSunrise: '09:00',
      formattedSunset: '21:00',
    }),
    processTemperature: jest.fn().mockReturnValue({
      tempCelsius: 22.0,
      feelsLikeCelsius: 21.0,
    }),
    capitalizeFirstLetter: jest.fn().mockImplementation((text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }),
    formatAlertTimes: jest.fn().mockReturnValue({
      formattedStartTime: '18:00 10/10/2023',
      formattedEndTime: '21:00 10/10/2023',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherProcessorService,
        {
          provide: WeatherFormatterService,
          useValue: formatterServiceMock,
        },
      ],
    }).compile();

    service = module.get<WeatherProcessorService>(WeatherProcessorService);
    formatterService = module.get<WeatherFormatterService>(
      WeatherFormatterService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processWeatherData', () => {
    it('should process and return formatted weather data', () => {
      const result = service.processWeatherData(
        mockOverviewData,
        mockOneCallData,
        'São Paulo, SP',
      );

      expect(result).toEqual({
        location: {
          address: 'São Paulo, SP',
          latitude: -23.5505,
          longitude: -46.6333,
        },
        dateTime: {
          timestamp: 1696939200,
          timezone: 'America/Sao_Paulo',
          date: '10/10/2023',
          time: '12:00',
        },
        currentData: {
          sun: {
            sunrise: '09:00',
            sunset: '21:00',
          },
          temperature: {
            kelvin: 295.15,
            celsius: 22.0,
            feelsLike: {
              kelvin: 294.15,
              celsius: 21.0,
            },
          },
          atmosphere: {
            pressure: 1015,
            humidity: 75,
            dewPoint: 290.15,
            uvIndex: 6.2,
            clouds: 75,
            visibility: 10000,
          },
          wind: {
            speed: 3.6,
            degree: 180,
            gust: 5.1,
            direction: 'Sul',
          },
          weather: {
            main: 'Clouds',
            description: 'Cloudy',
            icon: {
              id: '04d',
              url: 'https://openweathermap.org/img/wn/04d@2x.png',
            },
          },
        },
        alerts: {
          hasAlerts: true,
          count: 1,
          items: [
            {
              source: 'INMET',
              type: 'Storm Warning',
              period: {
                start: '18:00 10/10/2023',
                end: '21:00 10/10/2023',
                durationHours: 6,
              },
              description: 'Storm warning with possibility of flooding',
              categories: ['Flood', 'Rain'],
              severity: 'High',
            },
          ],
        },
        recommendations: ['Take an umbrella', 'Avoid areas prone to flooding'],
        classifications: {
          temperature: 'moderate',
          humidity: 'high',
          windSpeed: 'low',
          uvIndex: 'moderate',
        },
        summary: 'Cloudy weather with a chance of rain',
      });

      expect(formatterService.formatDateTime).toHaveBeenCalledWith(
        1696939200,
        'America/Sao_Paulo',
      );

      expect(formatterService.formatSunTimes).toHaveBeenCalledWith(
        1696928400,
        1696971600,
        'America/Sao_Paulo',
      );
      expect(formatterService.processTemperature).toHaveBeenCalledWith(
        295.15,
        294.15,
      );
      expect(formatterService.capitalizeFirstLetter).toHaveBeenCalledWith(
        'cloudy',
      );
      expect(formatterService.formatAlertTimes).toHaveBeenCalledWith(
        1696950000,
        1696971600,
      );
    });

    it('should handle data without alerts', () => {
      const oneCallDataWithoutAlerts = {
        ...mockOneCallData,
        alerts: undefined,
      };

      const result = service.processWeatherData(
        mockOverviewData,
        oneCallDataWithoutAlerts,
        'São Paulo, SP',
      );

      expect(result.alerts).toEqual({
        hasAlerts: false,
        count: 0,
        items: [],
      });
    });
  });

  describe('processCurrentData', () => {
    it('should correctly process current weather data', () => {
      const result = service['processCurrentData'](
        mockOneCallData,
        'America/Sao_Paulo',
      );

      expect(result).toEqual({
        dateTime: {
          formattedDate: '10/10/2023',
          formattedTime: '12:00',
        },
        weather: {
          sun: {
            sunrise: '09:00',
            sunset: '21:00',
          },
          temperature: {
            kelvin: 295.15,
            celsius: 22.0,
            feelsLike: {
              kelvin: 294.15,
              celsius: 21.0,
            },
          },
          atmosphere: {
            pressure: 1015,
            humidity: 75,
            dewPoint: 290.15,
            uvIndex: 6.2,
            clouds: 75,
            visibility: 10000,
          },
          wind: {
            speed: 3.6,
            degree: 180,
            gust: 5.1,
            direction: 'Sul',
          },
          weather: {
            main: 'Clouds',
            description: 'Cloudy',
            icon: {
              id: '04d',
              url: 'https://openweathermap.org/img/wn/04d@2x.png',
            },
          },
        },
      });
    });
  });

  describe('processAlerts', () => {
    it('should correctly process weather alerts', () => {
      const result = service['processAlerts'](mockOneCallData.alerts);

      expect(result).toEqual([
        {
          source: 'INMET',
          type: 'Storm Warning',
          period: {
            start: '18:00 10/10/2023',
            end: '21:00 10/10/2023',
            durationHours: 6,
          },
          description: 'Storm warning with possibility of flooding',
          categories: ['Flood', 'Rain'],
          severity: 'High',
        },
      ]);
    });

    it('should return empty array when alerts is undefined', () => {
      const result = service['processAlerts'](undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array when alerts is empty', () => {
      const result = service['processAlerts']([]);
      expect(result).toEqual([]);
    });
  });
});
