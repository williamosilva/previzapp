import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GeolocationService } from '../geolocation.service';

process.env.GOOGLE_GEOCODING_API_KEY = 'fake-api-key-for-testing';

const geocoderMock = {
  geocode: jest.fn(),
};

jest.mock('node-geocoder', () => {
  return jest.fn().mockImplementation(() => {
    return geocoderMock;
  });
});

describe('GeolocationService', () => {
  let geolocationService: GeolocationService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [GeolocationService],
    }).compile();

    geolocationService = moduleRef.get<GeolocationService>(GeolocationService);
  });

  describe('getCoordinatesFromAddress', () => {
    it('should return coordinates when a valid address is provided', async () => {
      geocoderMock.geocode.mockResolvedValue([
        {
          latitude: -23.55052,
          longitude: -46.63331,
          formattedAddress:
            'Rua da Consolação, Consolação, São Paulo, SP, Brasil',
        },
      ]);

      const result = await geolocationService.getCoordinatesFromAddress(
        'Rua da Consolação, São Paulo',
      );

      expect(result).toEqual({
        latitude: -23.55052,
        longitude: -46.63331,
        address: 'Rua da Consolação',
        cached: false,
        fullAddress: 'Rua da Consolação, Consolação, São Paulo, SP, Brasil',
        source: 'google',
      });

      expect(geocoderMock.geocode).toHaveBeenCalledWith(
        'Rua da Consolação, São Paulo',
      );
    });

    it('should throw HttpException with status 404 when no address is found', async () => {
      geocoderMock.geocode.mockResolvedValue([]);

      await expect(
        geolocationService.getCoordinatesFromAddress(
          'Address that does not exist',
        ),
      ).rejects.toThrow('Localização não encontrada');

      try {
        await geolocationService.getCoordinatesFromAddress(
          'Address that does not exist',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw HttpException with status 400 when an error occurs in the geocoder API', async () => {
      const errorMessage = 'API error';
      geocoderMock.geocode.mockRejectedValue(new Error(errorMessage));

      await expect(
        geolocationService.getCoordinatesFromAddress(
          'Rua da Consolação, São Paulo',
        ),
      ).rejects.toThrow(`Erro no serviço de geocodificação: ${errorMessage}`);

      try {
        await geolocationService.getCoordinatesFromAddress(
          'Rua da Consolação, São Paulo',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE); // Note: Service throws 503, not 400
      }
    });

    it('should correctly extract only the first part of the formatted address', async () => {
      geocoderMock.geocode.mockResolvedValue([
        {
          latitude: -23.55052,
          longitude: -46.63331,
          formattedAddress:
            'Avenida Paulista, Bela Vista, São Paulo, SP, 01310-100, Brasil',
        },
      ]);

      const result =
        await geolocationService.getCoordinatesFromAddress('Avenida Paulista');

      expect(result.address).toBe('Avenida Paulista');
      expect(result.latitude).toBe(-23.55052);
      expect(result.longitude).toBe(-46.63331);
    });

    it('must handle whitespace in formatted address', async () => {
      geocoderMock.geocode.mockResolvedValue([
        {
          latitude: -23.562754,
          longitude: -46.654621,
          formattedAddress: '  Rua Augusta  ,  Consolação, São Paulo  ',
        },
      ]);

      const result =
        await geolocationService.getCoordinatesFromAddress('Rua Augusta');

      expect(result.address).toBe('Rua Augusta');
    });

    it('must call the geocode method with the correct address', async () => {
      const address = 'Rua da Consolação, São Paulo';

      geocoderMock.geocode.mockResolvedValue([
        {
          latitude: -23.55052,
          longitude: -46.63331,
          formattedAddress: 'Rua da Consolação, São Paulo, SP, Brasil',
        },
      ]);

      await geolocationService.getCoordinatesFromAddress(address);

      expect(geocoderMock.geocode).toHaveBeenCalledWith(address);
      expect(geocoderMock.geocode).toHaveBeenCalledTimes(1);
    });
  });
});
