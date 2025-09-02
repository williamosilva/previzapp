import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);
  private geocoder;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 100;

  // Cache simples em memória com TTL
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

  constructor() {
    const NodeGeocoder = require('node-geocoder');

    this.logger.log('Inicializando geocoder com Google Geocoding API...');

    // Verifica se a API key está configurada
    if (!process.env.GOOGLE_GEOCODING_API_KEY) {
      this.logger.error('❌ GOOGLE_GEOCODING_API_KEY não configurada!');
      throw new Error('Google Geocoding API Key é obrigatória');
    }

    this.geocoder = NodeGeocoder({
      provider: 'google',
      httpAdapter: 'https',
      apiKey: process.env.GOOGLE_GEOCODING_API_KEY,
      formatter: null,

      timeout: 10000,
    });

    this.logger.log('✅ Google Geocoding API configurada com sucesso');
  }

  private async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  // Limpeza periódica do cache
  private cleanExpiredCache() {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      this.logger.debug(`Cache limpo: ${cleaned} entradas expiradas removidas`);
    }
  }

  private normalizeAddress(address: string): string {
    return address
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-,]/g, '');
  }

  // Função principal com Google Geocoding
  async getCoordinatesFromAddress(address: string) {
    this.logger.debug(`Geocodificando com Google: "${address}"`);

    // Limpar cache expirado periodicamente
    if (Math.random() < 0.1) {
      this.cleanExpiredCache();
    }

    const cacheKey = this.normalizeAddress(address);
    const cached = this.cache.get(cacheKey);

    // Verificar cache primeiro
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug(`✅ Cache hit para: "${address}"`);
      return cached.data;
    }

    // Validar entrada
    if (!address || address.trim().length < 2) {
      throw new HttpException('Endereço muito curto', HttpStatus.BAD_REQUEST);
    }

    try {
      // Rate limiting
      await this.enforceRateLimit();

      const res = await this.geocoder.geocode(address);

      if (res.length === 0) {
        this.logger.warn(`❌ Endereço não encontrado: "${address}"`);
        throw new HttpException(
          'Localização não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = {
        latitude: res[0].latitude,
        longitude: res[0].longitude,
        address: res[0].formattedAddress?.split(',')[0]?.trim() || address,
        fullAddress: res[0].formattedAddress,
        source: 'google',
        cached: false,
      };

      // Cache obrigatório
      this.cache.set(cacheKey, {
        data: { ...result, cached: true },
        timestamp: Date.now(),
      });

      this.logger.log(
        `✅ Coordenadas encontradas via Google para "${result.address}": ` +
          `${result.latitude}, ${result.longitude}`,
      );

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `❌ Erro do Google Geocoding para "${address}": ${error.message}`,
      );

      // Tratamento específico para erros do Google
      if (error.message?.includes('OVER_QUERY_LIMIT')) {
        throw new HttpException(
          'Limite de consultas da API excedido. Tente novamente mais tarde.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (error.message?.includes('REQUEST_DENIED')) {
        this.logger.error('❌ API Key inválida ou serviço não habilitado');
        throw new HttpException(
          'Erro de configuração do serviço de geocodificação.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (error.message?.includes('INVALID_REQUEST')) {
        throw new HttpException('Endereço inválido.', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        `Erro no serviço de geocodificação: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      await this.getCoordinatesFromAddress('São Paulo, SP, Brasil');

      return {
        status: 'healthy',
        details: {
          provider: 'google',
          cacheSize: this.cache.size,
          lastRequest: new Date(this.lastRequestTime).toISOString(),
          apiKeyConfigured: !!process.env.GOOGLE_GEOCODING_API_KEY,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          provider: 'google',
          error: error.message,
          cacheSize: this.cache.size,
          apiKeyConfigured: !!process.env.GOOGLE_GEOCODING_API_KEY,
        },
      };
    }
  }

  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: Math.round((now - value.timestamp) / 1000 / 60),
      expired: now - value.timestamp > this.CACHE_TTL,
    }));

    return {
      provider: 'google',
      size: this.cache.size,
      entries,
      totalEntries: entries.length,
      expiredEntries: entries.filter((e) => e.expired).length,
      apiKeyConfigured: !!process.env.GOOGLE_GEOCODING_API_KEY,
    };
  }

  clearCache() {
    this.cache.clear();
    this.logger.log('🗑️ Cache do geocoder limpo');
  }

  async warmupCache(commonAddresses?: string[]) {
    const defaultAddresses = commonAddresses || [
      'São Paulo, SP, Brasil',
      'Rio de Janeiro, RJ, Brasil',
      'Belo Horizonte, MG, Brasil',
      'Brasília, DF, Brasil',
      'Salvador, BA, Brasil',
    ];

    this.logger.log(
      `🔥 Pré-aquecendo cache com Google API - ${defaultAddresses.length} endereços...`,
    );

    for (const address of defaultAddresses) {
      try {
        await this.getCoordinatesFromAddress(address);

        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        this.logger.warn(
          `⚠️ Falha no warmup para "${address}": ${error.message}`,
        );
      }
    }

    this.logger.log('✅ Warmup do cache concluído');
  }
}
