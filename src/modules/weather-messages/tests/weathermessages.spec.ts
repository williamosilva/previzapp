import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WeatherMessagesController } from '../weathermessages.controller';
import { WeatherMessageService } from '../weathermessages.service';
import { OpenWeatherService } from '../../open-weather/openweather.service';
import { TranslationService } from '../../translation-module/translation.service';
import { GeolocationService } from '../../geolocation/geolocation.service';
import { WeatherProcessorService } from '../processor/weather-processor.service';
import { of } from 'rxjs';
import {
  WeatherResponse,
  ProcessedWeatherOverview,
  ProcessedOneCallData,
} from '../../../types/open-weather';
import { HttpException } from '@nestjs/common';

describe('WeatherMessages', () => {
  let app: INestApplication;
  let service: WeatherMessageService;
  let openWeatherService: OpenWeatherService;
  let geolocationService: GeolocationService;
  let translationService: TranslationService;
  let weatherProcessor: WeatherProcessorService;

  const mockGeolocationResponse = {
    latitude: 40.7128,
    longitude: -74.006,
    address: 'New York, NY, USA',
  };

  const mockWeatherOverviewResponse: ProcessedWeatherOverview = {
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
    },
    date: new Date().toISOString(),
    units: 'metric',
    overview: 'Clear sky with temperature of 20°C and 65% humidity',
  };

  const mockOneCallResponse: ProcessedOneCallData = {
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
    },
    current: {
      temp: 20,
      humidity: 65,
      weather: [{ description: 'clear sky' }],
    },
  };

  const mockProcessedData = {
    current: {
      temp: 20,
      humidity: 65,
      description: 'clear sky',
    },
    location: 'New York, NY, USA',
    forecast: {
      daily: [
        {
          temp: { day: 20, night: 15 },
          description: 'clear sky',
        },
      ],
      hourly: [
        {
          temp: 19,
          description: 'clear sky',
        },
      ],
    },
  };

  const mockTranslatedData: WeatherResponse = {
    location: {
      address: 'Nova York, NY, EUA',
      latitude: 40.7128,
      longitude: -74.006,
    },
    dateTime: {
      timestamp: Date.now(),
      timezone: 'America/New_York',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toISOString().split('T')[1].split('.')[0],
    },
    currentData: {
      sun: {
        sunrise: '06:30',
        sunset: '19:45',
      },
      temperature: {
        kelvin: 293.15,
        celsius: 20,
        feelsLike: {
          kelvin: 293.15,
          celsius: 20,
        },
      },
      atmosphere: {
        pressure: 1013,
        humidity: 65,
        dewPoint: 12,
        uvIndex: 3,
        clouds: 10,
        visibility: 10000,
      },
      wind: {
        speed: 3.5,
        degree: 180,
        gust: 5.2,
        direction: 'South',
      },
      weather: {
        main: 'Clear',
        description: 'céu limpo',
        icon: {
          id: '01d',
          url: 'http://openweathermap.org/img/wn/01d@2x.png',
        },
      },
    },
    alerts: {
      hasAlerts: false,
      count: 0,
      items: [],
    },
    recommendations: {
      clothing: 'Light clothing is recommended',
      activities: 'Good day for outdoor activities',
    },
    classifications: {
      comfort: 'Comfortable',
      uvRisk: 'Moderate',
    },
    summary: {
      short: 'Sunny and pleasant day',
      detailed: 'Clear skies with mild temperatures throughout the day',
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WeatherMessagesController],
      providers: [
        WeatherMessageService,
        {
          provide: OpenWeatherService,
          useValue: {
            getWeatherOverview: jest.fn(),
            getOneCallData: jest.fn(),
          },
        },
        {
          provide: GeolocationService,
          useValue: {
            getCoordinatesFromAddress: jest.fn(),
          },
        },
        {
          provide: TranslationService,
          useValue: {
            translateObject: jest.fn(),
          },
        },
        {
          provide: WeatherProcessorService,
          useValue: {
            processWeatherData: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<WeatherMessageService>(WeatherMessageService);
    openWeatherService =
      moduleFixture.get<OpenWeatherService>(OpenWeatherService);
    geolocationService =
      moduleFixture.get<GeolocationService>(GeolocationService);
    translationService =
      moduleFixture.get<TranslationService>(TranslationService);
    weatherProcessor = moduleFixture.get<WeatherProcessorService>(
      WeatherProcessorService,
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe('WeatherMessageService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return weather summary for a given address and language', async () => {
      const address = 'New York';
      const lang = 'pt';

      jest
        .spyOn(geolocationService, 'getCoordinatesFromAddress')
        .mockResolvedValue(mockGeolocationResponse);

      jest
        .spyOn(openWeatherService, 'getWeatherOverview')
        .mockReturnValue(of(mockWeatherOverviewResponse));
      jest
        .spyOn(openWeatherService, 'getOneCallData')
        .mockReturnValue(of(mockOneCallResponse));

      jest
        .spyOn(weatherProcessor, 'processWeatherData')
        .mockReturnValue(mockProcessedData as any);

      jest
        .spyOn(translationService, 'translateObject')
        .mockResolvedValue(mockTranslatedData);

      const result = await service.getWeatherSummary(address, lang);

      expect(geolocationService.getCoordinatesFromAddress).toHaveBeenCalledWith(
        address,
      );

      expect(openWeatherService.getWeatherOverview).toHaveBeenCalledWith({
        lat: mockGeolocationResponse.latitude,
        lon: mockGeolocationResponse.longitude,
      });

      expect(openWeatherService.getOneCallData).toHaveBeenCalledWith({
        lat: mockGeolocationResponse.latitude,
        lon: mockGeolocationResponse.longitude,
      });

      expect(weatherProcessor.processWeatherData).toHaveBeenCalledWith(
        mockWeatherOverviewResponse,
        mockOneCallResponse,
        mockGeolocationResponse.address,
      );
      expect(translationService.translateObject).toHaveBeenCalledWith(
        mockProcessedData,
        lang,
      );

      expect(result).toEqual(mockTranslatedData);
    });

    it('should throw an error when geolocation service fails', async () => {
      const address = 'Invalid Address';
      const lang = 'en';
      const errorMessage = 'Address not found';

      jest
        .spyOn(geolocationService, 'getCoordinatesFromAddress')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.getWeatherSummary(address, lang)).rejects.toThrow(
        errorMessage,
      );
      expect(geolocationService.getCoordinatesFromAddress).toHaveBeenCalledWith(
        address,
      );
    });
  });

  describe('WeatherMessagesController (E2E)', () => {
    it('should return 200 and weather data for valid address', async () => {
      const address = 'New York';
      const lang = 'pt';

      jest
        .spyOn(service, 'getWeatherSummary')
        .mockResolvedValue(mockTranslatedData);

      return request(app.getHttpServer())
        .get('/weather/summary')
        .query({ address, lang })
        .expect(HttpStatus.OK)
        .expect(mockTranslatedData);
    });

    it('should return 400 when address is missing', async () => {
      return request(app.getHttpServer())
        .get('/weather/summary')
        .query({ lang: 'en' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Address parameter is required',
        });
    });

    it('should return 500 when translation service fails', async () => {
      const address = 'New York';
      const lang = 'invalid-lang';

      jest
        .spyOn(service, 'getWeatherSummary')
        .mockRejectedValue(new Error('Translation error'));

      return request(app.getHttpServer())
        .get('/weather/summary')
        .query({ address, lang })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error translating weather information',
        });
    });

    it('should return 500 when geolocation service fails', async () => {
      const address = 'Invalid Address';
      const lang = 'en';

      jest
        .spyOn(service, 'getWeatherSummary')
        .mockRejectedValue(new Error('Address not found'));

      return request(app.getHttpServer())
        .get('/weather/summary')
        .query({ address, lang })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error processing request',
        });
    });

    it('should propagate HttpExceptions from service', async () => {
      const address = 'New York';
      const lang = 'en';
      const errorMessage = 'Custom error';
      const errorStatus = HttpStatus.BAD_GATEWAY;

      jest
        .spyOn(service, 'getWeatherSummary')
        .mockRejectedValue(new HttpException(errorMessage, errorStatus));

      return request(app.getHttpServer())
        .get('/weather/summary')
        .query({ address, lang })
        .expect(errorStatus)
        .expect({
          statusCode: errorStatus,
          message: errorMessage,
        });
    });
  });
});
