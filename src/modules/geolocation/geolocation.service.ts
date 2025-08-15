import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);
  private geocoder;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1100; // 1.1 segundos para margem de segurança

  // Cache simples em memória com TTL
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

  constructor() {
    const NodeGeocoder = require('node-geocoder');

    this.logger.log('Inicializando geocoder com provider OpenStreetMap...');
    this.geocoder = NodeGeocoder({
      provider: 'openstreetmap',
      httpAdapter: 'https',
      formatter: null,
      extra: {
        // User-Agent mais detalhado conforme política do Nominatim
        'user-agent':
          'PrevizApp/1.0 (https://williamsilva.dev/; williamsilva20062005@gmail.com)',
        // Referer correto
        referer: 'https://williamsilva.dev/',
      },
      // Timeout para evitar requests longos
      timeout: 10000,
    });
  }

  // Rate limiting aprimorado
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

  // Limpeza periódica do cache
  private cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  // Função principal com cache obrigatório
  async getCoordinatesFromAddress(address: string) {
    // this.logger.debug(`Recebendo endereço para geocodificação: "${address}"`);

    // Limpar cache expirado periodicamente
    if (Math.random() < 0.1) {
      // 10% de chance a cada chamada
      this.cleanExpiredCache();
    }

    const cacheKey = address.toLowerCase().trim();
    const cached = this.cache.get(cacheKey);

    // Verificar cache primeiro (obrigatório para conformidade)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug(`Coordenadas encontradas no cache para: "${address}"`);
      return cached.data;
    }

    try {
      // Aplicar rate limiting rigoroso
      await this.enforceRateLimit();

      // Validar entrada
      if (!address || address.trim().length < 2) {
        throw new HttpException('Address too short', HttpStatus.BAD_REQUEST);
      }

      const res = await this.geocoder.geocode(address);
      // this.logger.debug(`Resultado bruto do geocoder: ${JSON.stringify(res)}`);

      if (res.length === 0) {
        this.logger.warn(`Endereço não encontrado: "${address}"`);
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      const result = {
        latitude: res[0].latitude,
        longitude: res[0].longitude,
        address: res[0].formattedAddress?.split(',')[0]?.trim() || address,
        fullAddress: res[0].formattedAddress,
      };

      // Cache OBRIGATÓRIO - conforme política do Nominatim
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      // this.logger.log(
      //   `Coordenadas encontradas para "${result.address}": ` +
      //     `Lat: ${result.latitude}, Lng: ${result.longitude}`,
      // );

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Erro ao buscar coordenadas para "${address}": ${error.message}`,
      );

      // Tratamento específico para diferentes tipos de bloqueio
      if (
        error.message &&
        (error.message.includes('Access blocked') ||
          error.message.includes('blocked') ||
          error.message.includes('usage policy'))
      ) {
        this.logger.error(
          `BLOQUEIO NOMINATIM: Possíveis causas:
          1. Rate limit excedido (máx 1 req/s)
          2. User-Agent inadequado
          3. Falta de cache (requisições repetidas)
          4. Uso em massa detectado
          Aguarde algumas horas antes de tentar novamente.`,
        );
        throw new HttpException(
          'Geocoding service temporarily blocked. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
          { cause: error },
        );
      }

      // Outros erros de rede/timeout
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
        throw new HttpException(
          'Geocoding service timeout. Please try again.',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }

      throw new HttpException(
        `Geocoding error: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // Método para verificar status do cache
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  // Método para limpar cache manualmente (útil para debug)
  clearCache() {
    this.cache.clear();
    this.logger.log('Cache do geocoder limpo');
  }

  // Método para pré-aquecer cache com localizações comuns (opcional)
  async warmupCache(commonAddresses: string[]) {
    this.logger.log(
      `Pré-aquecendo cache com ${commonAddresses.length} endereços...`,
    );

    for (const address of commonAddresses) {
      try {
        await this.getCoordinatesFromAddress(address);
        // Esperar mais tempo entre requests no warmup
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        this.logger.warn(`Falha no warmup para "${address}": ${error.message}`);
        // Se houver erro, parar o warmup para não piorar a situação
        break;
      }
    }
  }
}

// Exemplo de uso no controller ou serviço que consome:
/*
@Controller('weather')
export class WeatherController {
  constructor(private geolocationService: GeolocationService) {}

  @Get('cache-stats')
  getCacheStats() {
    return this.geolocationService.getCacheStats();
  }

  @Post('clear-cache')
  clearCache() {
    this.geolocationService.clearCache();
    return { message: 'Cache cleared' };
  }
}
*/
