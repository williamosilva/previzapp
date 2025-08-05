import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);
  private geocoder;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre requisições

  constructor() {
    const NodeGeocoder = require('node-geocoder');

    this.logger.log('Inicializando geocoder com provider OpenStreetMap...');
    this.geocoder = NodeGeocoder({
      provider: 'openstreetmap',

      httpAdapter: 'https',
      formatter: null,
      extra: {
        'user-agent': 'PrevizApp/1.0 williamsilva20062005@gmail.com',
        referer: 'https://williamsilva.dev/',
      },
    });
  }

  // Rate limiting simples
  private async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      this.logger.debug(`Aguardando ${waitTime}ms para respeitar rate limit`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  // Função do geocoder para obter as coordenadas a partir de um endereço fornecido
  async getCoordinatesFromAddress(address: string) {
    this.logger.debug(`Recebendo endereço para geocodificação: "${address}"`);

    try {
      // Aplicar rate limiting
      await this.enforceRateLimit();

      const res = await this.geocoder.geocode(address);
      this.logger.debug(`Resultado bruto do geocoder: ${JSON.stringify(res)}`);

      if (res.length === 0) {
        this.logger.warn(`Endereço não encontrado: "${address}"`);
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      const formattedAddress = res[0].formattedAddress;
      const addressName = formattedAddress.split(',')[0].trim();

      this.logger.log(
        `Coordenadas encontradas para "${addressName}": ` +
          `Lat: ${res[0].latitude}, Lng: ${res[0].longitude}`,
      );

      return {
        latitude: res[0].latitude,
        longitude: res[0].longitude,
        address: addressName,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(
          `Erro de HttpException para o endereço "${address}": ${error.message}`,
        );
        throw error;
      }

      // Tratamento específico para bloqueio do Nominatim
      if (error.message && error.message.includes('Access blocked')) {
        this.logger.error(
          `IP bloqueado pelo Nominatim. Verifique o User-Agent e a política de uso.`,
        );
        throw new HttpException(
          'Geocoding service temporarily unavailable. Please try again later.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      this.logger.error(
        `Erro inesperado ao buscar coordenadas para "${address}": ${error.message}`,
        error.stack,
      );

      throw new HttpException(
        `Error fetching coordinates: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Método alternativo usando cache simples em memória
  private cache = new Map<string, any>();

  async getCoordinatesFromAddressWithCache(address: string) {
    const cacheKey = address.toLowerCase().trim();

    if (this.cache.has(cacheKey)) {
      this.logger.debug(`Coordenadas encontradas no cache para: "${address}"`);
      return this.cache.get(cacheKey);
    }

    const result = await this.getCoordinatesFromAddress(address);
    this.cache.set(cacheKey, result);

    return result;
  }
}
