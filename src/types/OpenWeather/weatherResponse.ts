// Interface da resposta final da api Previzapp
export interface WeatherResponse {
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dateTime: {
    timestamp: number;
    timezone: string;
    date: string;
    time: string;
  };
  currentData: {
    sun: {
      sunrise: string;
      sunset: string;
    };
    temperature: {
      kelvin: number;
      celsius: number;
      feelsLike: {
        kelvin: number;
        celsius: number;
      };
    };
    atmosphere: {
      pressure: number;
      humidity: number;
      dewPoint: number;
      uvIndex: number;
      clouds: number;
      visibility: number;
    };
    wind: {
      speed: number;
      degree: number;
      gust: number;
      direction: string;
    };
    weather: {
      main: string;
      description: string;
      icon: {
        id: string;
        url: string;
      };
    };
  };
  alerts: {
    hasAlerts: boolean;
    count: number;
    items: Array<{
      source: string;
      type: string;
      period: {
        start: string;
        end: string;
        durationHours: number;
      };
      description: string;
      categories: string[];
      severity: string;
    }>;
  };
  recommendations: any;
  classifications: any;
  summary: any;
}
