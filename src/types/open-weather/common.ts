export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export type Units = 'standard' | 'metric' | 'imperial';
