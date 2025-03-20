// Interface para dados processados do OneCall após requisição geral (sem endpoint específico)
export interface ProcessedOneCallData {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  current: any;
  alerts?: any[];
}

// Interface para dados processados do OneCall com o endpoint Overview
export interface ProcessedWeatherOverview {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  date: string;
  units: string;
  overview: string;
}
