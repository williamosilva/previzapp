export interface OpenWeatherParams {
  lat: number;
  lon: number;
  units?: 'standard' | 'metric' | 'imperial';
  exclude?: string;
}
