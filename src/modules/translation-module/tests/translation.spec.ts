import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TranslationService } from '../translation.service';
import { TranslationServiceClient } from '@google-cloud/translate';

jest.mock('@google-cloud/translate', () => ({
  TranslationServiceClient: jest.fn().mockImplementation(() => ({
    translateText: jest.fn().mockResolvedValue([
      {
        translations: [{ translatedText: 'texto-traduzido' }],
      },
    ]),
  })),
}));

describe('TranslationService', () => {
  let service: TranslationService;
  let translationClient: { translateText: jest.Mock };
  let mockConfig: Partial<ConfigService>;
  let mockLogger: any;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    mockConfig = {
      get: jest.fn((key: string) => {
        const credentials = {
          GOOGLE_PROJECT_ID: 'projeto-mock',
          GOOGLE_CLIENT_EMAIL: 'email-mock',
          GOOGLE_PRIVATE_KEY: 'chave-mock',
        };
        return credentials[key];
      }),
    };

    const mockClient = new TranslationServiceClient() as any;
    translationClient = mockClient;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        { provide: ConfigService, useValue: mockConfig },
      ],
    })
      .setLogger(mockLogger)
      .compile();

    service = module.get<TranslationService>(TranslationService);
  });

  it('should initialize service', () => {
    expect(service).toBeDefined();
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Google Cloud Translation Service Initialized',
      'TranslationService',
    );
  });

  describe('translateText()', () => {
    it('should return original text for English', async () => {
      const result = await service.translateText('Hello', 'en');
      expect(result).toBe('Hello');
    });

    it('should translate text to Portuguese', async () => {
      const result = await service.translateText('Hello', 'pt');
      expect(result).toBe('texto-traduzido');
    });
  });

  describe('translateObject()', () => {
    const sampleObj = {
      summary: 'Test summary',
      recommendations: ['First tip', 'Second tip'],
      currentData: {
        weather: { description: 'Sunny' },
      },
    };

    it('should translate all fields', async () => {
      const result = await service.translateObject(sampleObj, 'es');
      expect(result.summary).toBe('texto-traduzido');
      expect(result.recommendations).toEqual([
        'texto-traduzido',
        'texto-traduzido',
      ]);
    });
  });

  it('should throw if credentials are invalid', () => {
    mockConfig.get = jest.fn(() => undefined);
    expect(() => new TranslationService(mockConfig as ConfigService)).toThrow(
      'Google Cloud credentials are incomplete. Please check environment variables.',
    );
  });
});
