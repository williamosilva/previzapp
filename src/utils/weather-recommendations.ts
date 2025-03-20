import { ProcessedOneCallData } from 'src/types/open-weather';

// Gera recomendações personalizadas baseadas em dados meteorológicos.
// As recomendações são armazenadas em um conjunto para evitar duplicatas.
// São considerados dados como temperatura, umidade, índice UV, velocidade do vento, condição do tempo, visibilidade e horário do dia.
// As sugestões foram escolhas minhas, mas podem ser alteradas conforme necessário.

export function generateWeatherRecommendations(
  oneCallData: ProcessedOneCallData,
): string[] {
  const { current } = oneCallData;

  if (!current) {
    return ['Unable to get current weather data.'];
  }

  const {
    temp,
    humidity,
    uvi,
    wind_speed: windSpeed,
    weather,
    visibility,
    feels_like: feelsLike,
    clouds: cloudiness,
    sunrise,
    sunset,
  } = current;

  const weatherMain = weather?.[0]?.main;

  // Constantes e funções utilitárias
  const KELVIN_TO_CELSIUS_OFFSET = 273.15;
  const kelvinToCelsius = (kelvinTemp: number): number =>
    kelvinTemp - KELVIN_TO_CELSIUS_OFFSET;
  const now = new Date().getTime() / 1000;

  const tempCelsius = temp !== undefined ? kelvinToCelsius(temp) : undefined;

  // Conjunto para evitar recomendações duplicadas
  const recommendationsSet = new Set<string>();

  // Recomendação padrão
  recommendationsSet.add('Check weather updates regularly.');

  // Aplica recomendações baseadas nos dados disponíveis
  addTemperatureRecommendations(recommendationsSet, tempCelsius);
  addThermalSensationRecommendations(recommendationsSet, feelsLike, temp);
  addHumidityRecommendations(recommendationsSet, humidity);
  addUVIndexRecommendations(recommendationsSet, uvi);
  addWindRecommendations(recommendationsSet, windSpeed, tempCelsius);
  addWeatherConditionRecommendations(
    recommendationsSet,
    weatherMain,
    cloudiness,
    uvi,
  );
  addVisibilityRecommendations(recommendationsSet, visibility);
  addDaylightRecommendations(now, recommendationsSet, sunrise, sunset);
  return Array.from(recommendationsSet);

  // Funções auxiliares para categorizar recomendações

  // Adiciona recomendações baseadas na temperatura
  function addTemperatureRecommendations(
    recommendations: Set<string>,
    tempC?: number,
  ): void {
    if (tempC === undefined) return;

    switch (true) {
      case tempC > 35:
        recommendations.add(
          'ALERT: Extremely high temperature. Avoid outdoor activities.',
        );
        recommendations.add('Stay hydrated by drinking water frequently.');
        recommendations.add(
          'Look for air-conditioned or ventilated environments.',
        );
        break;
      case tempC > 30:
        recommendations.add('Stay hydrated due to high temperatures.');
        recommendations.add(
          'Avoid prolonged exposure to the sun during the hottest hours.',
        );
        recommendations.add('Wear light, light-colored clothing.');
        break;
      case tempC > 25:
        recommendations.add('High temperature. Drink water regularly.');
        recommendations.add('Wear light, cool clothing.');
        break;
      case tempC > 20:
        recommendations.add('Pleasant temperature. Enjoy the day.');
        recommendations.add('Good time for outdoor activities.');
        break;
      case tempC > 15:
        recommendations.add(
          'Mild temperature. A light sweater may be necessary.',
        );
        break;
      case tempC > 10:
        recommendations.add('Bring a light coat in case it gets colder.');
        break;
      case tempC > 5:
        recommendations.add('Dress appropriately for moderate cold.');
        break;
      case tempC > 0:
        recommendations.add(
          'Cold temperature. Wear several layers of clothing.',
        );
        break;
      case tempC > -10:
        recommendations.add(
          'Very cold temperature. Wear thermal clothing and protect your extremities.',
        );
        break;
      default:
        recommendations.add(
          'WARNING: Extremely low temperature. Avoid prolonged exposure to cold.',
        );
        recommendations.add(
          'Risk of hypothermia. Wear clothing suitable for extreme weather.',
        );
        break;
    }
  }

  // Adiciona recomendações baseadas na sensação térmica
  function addThermalSensationRecommendations(
    recommendations: Set<string>,
    feelsLike?: number,
    temp?: number,
  ): void {
    if (feelsLike === undefined || temp === undefined) return;

    const THERMAL_DIFFERENCE_THRESHOLD = 5;

    switch (true) {
      case feelsLike < temp - THERMAL_DIFFERENCE_THRESHOLD:
        recommendations.add(
          'The temperature feels significantly lower than the actual temperature.',
        );
        break;
      case feelsLike > temp + THERMAL_DIFFERENCE_THRESHOLD:
        recommendations.add(
          'The temperature feels significantly higher than the actual temperature.',
        );
        break;
      default:
        // Não adiciona recomendação quando a sensação térmica está próxima da temperatura real
        break;
    }
  }

  // Recomendações baseadas na umidade
  function addHumidityRecommendations(
    recommendations: Set<string>,
    humidity?: number,
  ): void {
    if (humidity === undefined) return;

    switch (true) {
      case humidity > 90:
        recommendations.add(
          'Extremely high humidity. Avoid intense physical activity.',
        );
        break;
      case humidity > 80:
        recommendations.add(
          'High humidity. May cause respiratory discomfort in sensitive individuals.',
        );
        break;
      case humidity > 70:
        recommendations.add('High humidity. Stay hydrated.');
        break;
      case humidity < 20:
        recommendations.add(
          'Very low humidity. Risk of dehydration and dry airways.',
        );
        break;
      case humidity < 30:
        recommendations.add(
          'Low humidity. Stay well hydrated and use moisturizer on your skin.',
        );
        break;
    }
  }

  // Recomendações baseadas no índice UV
  function addUVIndexRecommendations(
    recommendations: Set<string>,
    uvi?: number,
  ): void {
    if (uvi === undefined) return;

    switch (true) {
      case uvi > 10:
        recommendations.add(
          'WARNING: Extremely high UV index. Avoid sun exposure between 10am and 4pm.',
        );
        recommendations.add(
          'Wear SPF 50+ sunscreen, hat, sunglasses and protective clothing.',
        );
        break;
      case uvi > 7:
        recommendations.add(
          'Very high UV index. Use SPF 30+ sunscreen and seek shade.',
        );
        break;
      case uvi > 5:
        recommendations.add('Wear sunscreen due to high UV index.');
        break;
      case uvi > 2:
        recommendations.add(
          'Moderate UV index. Use sunscreen if exposed for long periods.',
        );
        break;
    }
  }

  // Recomendações baseadas no vento
  function addWindRecommendations(
    recommendations: Set<string>,
    windSpeed?: number,
    tempC?: number,
  ): void {
    if (windSpeed === undefined) return;

    switch (true) {
      case windSpeed > 20:
        recommendations.add(
          'WARNING: Very strong winds. Be careful with loose objects and trees.',
        );
        break;
      case windSpeed > 15:
        recommendations.add(
          'Strong winds. Hold on to light objects and be careful when driving.',
        );
        break;
      case windSpeed > 10:
        recommendations.add(
          'Moderate winds. May cause discomfort during outdoor activities.',
        );
        break;
      case windSpeed > 5:
        recommendations.add(
          'Light winds. Consider wearing a sweater if it is cool.',
        );
        break;
      case windSpeed < 2 && tempC !== undefined && tempC > 25:
        recommendations.add(
          'Little wind and high temperature. Rooms may get stuffy.',
        );
        break;
    }
  }
  // Recomendações baseadas na condição meteorológica
  function addWeatherConditionRecommendations(
    recommendations: Set<string>,
    weatherMain?: string,
    cloudiness?: number,
    uvi?: number,
  ): void {
    if (!weatherMain) return;

    switch (weatherMain) {
      case 'Rain':
      case 'Drizzle':
        recommendations.add('Bring an umbrella or raincoat.');
        break;
      case 'Snow':
        recommendations.add('Be prepared for snowy conditions on the roads.');
        recommendations.add('Wear thermal clothing and snow-safe footwear.');
        break;
      case 'Thunderstorm':
        recommendations.add(
          'WARNING: Lightning storm. Avoid open areas and seek shelter.',
        );
        recommendations.add('Avoid swimming or water sports.');
        break;
      case 'Clouds':
        if (cloudiness && cloudiness > 80) {
          recommendations.add(
            'Partly cloudy skies. Consider bringing an umbrella in case.',
          );
        } else {
          recommendations.add(
            'Partly cloudy skies. Good for outdoor activities.',
          );
        }
        break;

      case 'Clear':
        recommendations.add('Clear skies. Great for outdoor activities.');
        if (uvi && uvi > 3) {
          recommendations.add('Remember to use sun protection on sunny days.');
        }
        break;

      case 'Mist':
      case 'Fog':
        recommendations.add(
          'Reduced visibility. Drive carefully and use fog lights.',
        );
        break;
      case 'Dust':
      case 'Sand':
      case 'Haze':
        recommendations.add(
          'Airborne particles. People with respiratory problems should be careful.',
        );
        recommendations.add(
          'Consider wearing a mask if you have respiratory sensitivity.',
        );
        break;
    }
  }

  // Recomendações baseadas na visibilidade
  function addVisibilityRecommendations(
    recommendations: Set<string>,
    visibility?: number,
  ): void {
    if (visibility === undefined) return;

    switch (true) {
      case visibility < 1000:
        recommendations.add(
          'WARNING: Extremely low visibility. Avoid driving if possible.',
        );
        break;
      case visibility < 5000:
        recommendations.add(
          'Reduced visibility. Drive carefully and maintain greater distance from the vehicle in front.',
        );
        break;
    }
  }

  // Recomendações baseadas no horário do dia (em relação ao nascer e pôr do sol)
  function addDaylightRecommendations(
    now: number,
    recommendations: Set<string>,
    sunrise?: number,
    sunset?: number,
  ): void {
    if (sunrise === undefined || sunset === undefined) return;

    const dayLength = sunset - sunrise;
    const HOURS_IN_SECONDS = 3600;
    const THIRTY_MINUTES_IN_SECONDS = 1800;

    // Verifica duração do dia, se for menor que 8 horas, recomenda planejar atividades ao ar livre com antecedência
    switch (true) {
      case dayLength < 8 * HOURS_IN_SECONDS:
        recommendations.add(
          'Short days. Plan your outdoor activities in advance.',
        );
        break;
    }

    // Verifica período do dia em relação ao nascer e pôr do sol para recomendações específicas
    switch (true) {
      case now < sunrise + THIRTY_MINUTES_IN_SECONDS:
        recommendations.add(
          'Its just dawn, its a good time for morning outdoor activities.',
        );
        break;
      case now > sunset - THIRTY_MINUTES_IN_SECONDS:
        recommendations.add(
          'Dusk is approaching. Visibility will be reduced soon.',
        );
        break;
    }
  }
}
