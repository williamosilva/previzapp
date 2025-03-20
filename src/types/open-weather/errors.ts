// Tipos de erros que podem ser retornados pela API do OpenWeather
export enum OpenWeatherErrorCode {
  COORDINATES_NOT_FOUND = 'COORDINATES_NOT_FOUND',
  INVALID_API_KEY = 'INVALID_API_KEY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

// Estrutura para erros
export interface OpenWeatherError {
  code: OpenWeatherErrorCode;
  message: string;
  originalError?: any;
  statusCode: number;
}
