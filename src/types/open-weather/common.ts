export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  timezone: string;
}

export type Units = 'standard' | 'metric' | 'imperial';
