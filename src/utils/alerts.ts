export function determineAlertSeverity(
  description: string,
  tags: string[],
): string {
  // Palavras-chave que indicam severidade presente no campo description da api OpenWeather (pode ser ajustado conforme necessário)
  const severeKeywords = ['severe', 'extreme', 'dangerous', 'heavy', 'risk'];
  const moderateKeywords = ['moderate', 'caution', 'advisory'];

  // Verifica se há indicação de nível no texto
  if (description.includes('level 3') || description.includes('level 4')) {
    return 'High';
  } else if (description.includes('level 2')) {
    return 'Average';
  } else if (description.includes('level 1')) {
    return 'Low';
  }

  // Verifica palavras-chave na descrição
  const lowerDesc = description.toLowerCase();
  for (const keyword of severeKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 'High';
    }
  }

  for (const keyword of moderateKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 'Average';
    }
  }

  // Verifica tags
  const severeTags = [
    'Extreme temperature',
    'Hurricane',
    'Tornado',
    'Severe thunderstorm',
  ];
  for (const tag of tags) {
    if (severeTags.includes(tag)) {
      return 'High';
    }
  }

  // Padrão
  return 'Low';
}

// Formula para calcular a direção do vento (em graus) para uma string.
// Considere erros, nao existe uma formula especifica para isso, mas a formula abaixo é uma sugestão que deu certo em testes.
export function getWindDirection(degrees: number): string {
  const directions = [
    'North',
    'North East',
    'East',
    'Southeast',
    'South',
    'South-west',
    'West',
    'Northwest',
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
