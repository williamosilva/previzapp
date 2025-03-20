// Interface para dados processados do OneCall após requisição geral (sem endpoint específico)
export interface ProcessedOneCallData {
  location: Location;
  current: any;
  alerts?: any[];
}

// Interface para dados processados do OneCall com o endpoint Overview
export interface ProcessedWeatherOverview {
  location: Location;
  date: string;
  units: string;
  overview: string;
}

interface Location {
  latitude: number;
  longitude: number;
  timezone: string;
}
