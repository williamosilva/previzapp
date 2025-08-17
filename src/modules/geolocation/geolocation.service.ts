import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);
  private geocoder;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 2000; // Aumentado para 2s em produção

  // Cache simples em memória com TTL
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

  constructor() {
    const NodeGeocoder = require('node-geocoder');

    this.logger.log('Inicializando geocoder com provider OpenStreetMap...');

    // Detectar ambiente
    const isProduction = process.env.NODE_ENV === 'production';

    this.geocoder = NodeGeocoder({
      provider: 'openstreetmap',
      httpAdapter: 'https',
      formatter: null,
      extra: {
        // User-Agent mais "humano" e específico
        'User-Agent':
          'Mozilla/5.0 (compatible; PrevizWeatherApp/1.0; +https://williamsilva.dev/contact)',
        // Headers adicionais para parecer mais legítimo
        Accept: 'application/json, text/html, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        // Referer mais específico
        Referer: 'https://williamsilva.dev/',
        // Header customizado para identificação
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Timeout aumentado para produção
      timeout: isProduction ? 15000 : 10000,
      // Rate limit mais conservador em produção
      rateLimit: isProduction ? 2000 : 1100,
    });
  }

  // Rate limiting aprimorado com backoff exponencial
  private async enforceRateLimit(attempt = 1) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // Intervalo base aumentado em produção
    const baseInterval =
      process.env.NODE_ENV === 'production' ? this.MIN_REQUEST_INTERVAL : 1100;

    // Backoff exponencial para múltiplas tentativas
    const interval = baseInterval * Math.pow(1.5, attempt - 1);

    if (timeSinceLastRequest < interval) {
      const waitTime = interval - timeSinceLastRequest;
      this.logger.debug(
        `Aguardando ${waitTime}ms para respeitar rate limit (tentativa ${attempt})`,
      );
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

  // Normalizar endereço para melhor cache
  private normalizeAddress(address: string): string {
    return address
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Múltiplos espaços -> um espaço
      .replace(/[^\w\s\-,]/g, ''); // Remove caracteres especiais exceto hífen e vírgula
  }

  // Função principal com retry e cache obrigatório
  async getCoordinatesFromAddress(address: string, maxRetries = 3) {
    this.logger.debug(`Geocodificando: "${address}"`);

    // Limpar cache expirado periodicamente
    if (Math.random() < 0.1) {
      this.cleanExpiredCache();
    }

    const cacheKey = this.normalizeAddress(address);
    const cached = this.cache.get(cacheKey);

    // Verificar cache primeiro (obrigatório para conformidade)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug(`✅ Cache hit para: "${address}"`);
      return cached.data;
    }

    // Validar entrada
    if (!address || address.trim().length < 2) {
      throw new HttpException('Endereço muito curto', HttpStatus.BAD_REQUEST);
    }

    let lastError: any;

    // Loop de retry com backoff exponencial
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Aplicar rate limiting com backoff
        await this.enforceRateLimit(attempt);

        this.logger.debug(
          `Tentativa ${attempt}/${maxRetries} para: "${address}"`,
        );

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
          source: 'nominatim',
          cached: false,
        };

        // Cache OBRIGATÓRIO
        this.cache.set(cacheKey, {
          data: { ...result, cached: true },
          timestamp: Date.now(),
        });

        this.logger.log(
          `✅ Coordenadas encontradas para "${result.address}": ` +
            `${result.latitude}, ${result.longitude} (tentativa ${attempt})`,
        );

        return result;
      } catch (error) {
        lastError = error;

        if (error instanceof HttpException) {
          // Não fazer retry para erros de validação
          throw error;
        }

        // Log detalhado do erro
        this.logger.error(
          `❌ Erro na tentativa ${attempt}/${maxRetries} para "${address}": ${error.message}`,
        );

        // Tratamento específico para diferentes tipos de erro
        if (this.isBlockedError(error)) {
          const waitTime = Math.min(5000 * attempt, 30000); // Max 30s
          this.logger.warn(
            `🚫 Bloqueio detectado. Aguardando ${waitTime}ms antes da próxima tentativa...`,
          );

          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }
        }

        // Para outros erros, aguardar menos tempo
        if (attempt < maxRetries) {
          const waitTime = 1000 * attempt;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    return this.handleFinalError(lastError, address);
  }

  private isBlockedError(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return (
      message.includes('blocked') ||
      message.includes('forbidden') ||
      message.includes('usage policy') ||
      message.includes('too many requests') ||
      message.includes('rate limit') ||
      error.status === 403 ||
      error.status === 429
    );
  }

  private handleFinalError(error: any, address: string) {
    if (this.isBlockedError(error)) {
      this.logger.error(
        `🚫 BLOQUEIO NOMINATIM PERSISTENTE para "${address}":
        Possíveis causas:
        1. IP do Heroku bloqueado
        2. Rate limit excedido persistentemente  
        3. User-Agent detectado como bot
        4. Padrão de uso suspeito
        
        Soluções:
        - Aguardar 24h
        - Considerar proxy/VPN
        - Migrar para Google Geocoding API
        - Usar cache mais agressivo`,
      );

      throw new HttpException(
        'Serviço de geocodificação temporariamente indisponível. Tente novamente mais tarde.',
        HttpStatus.TOO_MANY_REQUESTS,
        { cause: error },
      );
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
      throw new HttpException(
        'Timeout no serviço de geocodificação. Tente novamente.',
        HttpStatus.REQUEST_TIMEOUT,
      );
    }

    throw new HttpException(
      `Erro no serviço de geocodificação: ${error.message}`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  // Método para verificar saúde do serviço
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      // Teste com endereço conhecido (deve estar em cache)
      await this.getCoordinatesFromAddress('São Paulo, SP, Brasil');

      return {
        status: 'healthy',
        details: {
          cacheSize: this.cache.size,
          lastRequest: new Date(this.lastRequestTime).toISOString(),
          environment: process.env.NODE_ENV,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message,
          cacheSize: this.cache.size,
          lastRequest: new Date(this.lastRequestTime).toISOString(),
        },
      };
    }
  }

  // Método para verificar status do cache
  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: Math.round((now - value.timestamp) / 1000 / 60), // idade em minutos
      expired: now - value.timestamp > this.CACHE_TTL,
    }));

    return {
      size: this.cache.size,
      entries,
      totalEntries: entries.length,
      expiredEntries: entries.filter((e) => e.expired).length,
      environment: process.env.NODE_ENV,
    };
  }

  // Método para limpar cache manualmente
  clearCache() {
    this.cache.clear();
    this.logger.log('🗑️ Cache do geocoder limpo');
  }

  // Pré-aquecer cache com endereços comuns do Brasil
  async warmupCache(commonAddresses?: string[]) {
    const defaultAddresses = commonAddresses || [
      'São Paulo, SP, Brasil',
      'Rio de Janeiro, RJ, Brasil',
      'Belo Horizonte, MG, Brasil',
      'Brasília, DF, Brasil',
      'Salvador, BA, Brasil',
    ];

    this.logger.log(
      `🔥 Pré-aquecendo cache com ${defaultAddresses.length} endereços...`,
    );

    for (const address of defaultAddresses) {
      try {
        await this.getCoordinatesFromAddress(address);
        // Esperar tempo extra no warmup
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        this.logger.warn(
          `⚠️ Falha no warmup para "${address}": ${error.message}`,
        );
        // Continuar tentando outros endereços
      }
    }

    this.logger.log('✅ Warmup do cache concluído');
  }
}
