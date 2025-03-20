import { ProcessedOneCallData } from '../modules/weather-messages/types';

export function generateClassifications(oneCallData: ProcessedOneCallData) {
  // Exemplo de classificações baseadas nos dados combinados
  const classifications = {
    temperature: classifyTemperature(oneCallData.current?.temp),
    humidity: classifyHumidity(oneCallData.current?.humidity),
    windSpeed: classifyWindSpeed(oneCallData.current?.wind_speed),
    uvIndex: classifyUvIndex(oneCallData.current?.uvi),
  };

  return classifications;
}

// Métodos auxiliares para classificação abaixo
function classifyTemperature(temp?: number): string {
  if (temp === undefined) return 'Unknown';

  const kelvinToCelsius = (temp: number) => temp - 273.15;
  const tempCelsius = kelvinToCelsius(temp);
  if (tempCelsius < 5) return 'Very cold';
  if (tempCelsius < 15) return 'Cold';
  if (tempCelsius < 25) return 'Nice';
  if (tempCelsius < 32) return 'Warm';
  return 'Very hot';
}

function classifyHumidity(humidity?: number): string {
  if (humidity === undefined) return 'Unknown';
  if (humidity < 30) return 'Low';
  if (humidity < 60) return 'Moderate';
  return 'High';
}

function classifyWindSpeed(windSpeed?: number): string {
  if (windSpeed === undefined) return 'Unknown';
  if (windSpeed < 5) return 'Weak';
  if (windSpeed < 15) return 'Moderate';
  if (windSpeed < 25) return 'Strong';
  return 'Very strong';
}

function classifyUvIndex(uvi?: number): string {
  if (uvi === undefined) return 'Unknown';
  if (uvi < 3) return 'Low';
  if (uvi < 6) return 'Moderate';
  if (uvi < 8) return 'High';
  if (uvi < 11) return 'Very high';
  return 'Extreme';
}
