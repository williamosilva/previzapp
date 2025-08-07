// src/modules/telegram/i18n/i18n.ts

export interface TranslationKeys {
  // Mensagens de boas-vindas
  WELCOME_TITLE: string;
  WELCOME_MESSAGE: string;
  WELCOME_EXAMPLES: string;
  WELCOME_HELP_TIP: string;

  // Comandos de ajuda
  HELP_TITLE: string;
  HELP_STEP1: string;
  HELP_STEP2: string;
  HELP_STEP3: string;
  HELP_AVAILABLE_COMMANDS: string;
  HELP_START_COMMAND: string;
  HELP_HELP_COMMAND: string;
  HELP_CANCEL_COMMAND: string;
  HELP_USAGE_EXAMPLES: string;
  HELP_SUPPORTED_LANGUAGES: string;

  // Seleção de idioma
  LANGUAGE_SELECTION_TITLE: string;
  LANGUAGE_SELECTION_MESSAGE: string;
  LANGUAGE_FALLBACK_MESSAGE: string;
  LANGUAGE_FALLBACK_INSTRUCTION: string;

  // Mensagens de erro
  ERROR_TEXT_ONLY: string;
  ERROR_OPERATION_CANCELLED: string;
  ERROR_INVALID_SESSION: string;
  ERROR_LANGUAGE_NOT_RECOGNIZED: string;
  ERROR_SESSION_EXPIRED: string;
  ERROR_WEATHER_FETCH: string;
  ERROR_CITY_NOT_FOUND: string;
  ERROR_NETWORK_PROBLEM: string;

  // Feedback e navegação
  LANGUAGE_SELECTED: string;
  NEW_CONSULTATION_TIP: string;
  TYPING_ACTION: string;

  // Formatação da resposta do clima
  WEATHER_FORECAST_FOR: string;
  CURRENT_CONDITIONS: string;
  TEMPERATURE_LABEL: string;
  FEELS_LIKE: string;
  CONDITION_LABEL: string;
  HUMIDITY_LABEL: string;
  WIND_LABEL: string;
  UV_LABEL: string;
  CLOUDINESS_LABEL: string;
  CLASSIFICATIONS_TITLE: string;
  TEMPERATURE_CLASS: string;
  HUMIDITY_CLASS: string;
  WIND_CLASS: string;
  UV_INDEX_CLASS: string;
  SUN_TITLE: string;
  SUNRISE_LABEL: string;
  SUNSET_LABEL: string;
  MY_ADVICE_TITLE: string;
  ATTENTION_ALERTS: string;
  UPDATED_AT: string;
  SUMMARY_TITLE: string;
  NO_DESCRIPTION: string;
}

export const translations: Record<string, TranslationKeys> = {
  pt: {
    WELCOME_TITLE: '🌤️ *Bem-vindo ao Bot Previzapp!*',
    WELCOME_MESSAGE:
      'Envie o nome de uma cidade ou endereço e eu te darei as informações meteorológicas em seu idioma preferido!',
    WELCOME_EXAMPLES:
      'Exemplos:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: 'Digite /help para mais informações.',

    HELP_TITLE: '🆘 *Como usar o Bot Previzapp:*',
    HELP_STEP1: '1️⃣ Envie o nome de uma cidade',
    HELP_STEP2: '2️⃣ Escolha seu idioma preferido',
    HELP_STEP3: '3️⃣ Receba as informações meteorológicas',
    HELP_AVAILABLE_COMMANDS: '*Comandos disponíveis:*',
    HELP_START_COMMAND: '/start - Iniciar o bot',
    HELP_HELP_COMMAND: '/help - Mostrar esta ajuda',
    HELP_CANCEL_COMMAND: '/cancel - Cancelar operação atual',
    HELP_USAGE_EXAMPLES:
      '*Exemplos de uso:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*Idiomas suportados:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE:
      '🌍 *Escolha seu idioma preferido para {location}:*',
    LANGUAGE_SELECTION_MESSAGE: 'Selecione uma opção abaixo:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *Escolha seu idioma para {location}:*',
    LANGUAGE_FALLBACK_INSTRUCTION: 'Digite o número da sua escolha (1-9):',

    ERROR_TEXT_ONLY:
      'Por favor, envie apenas mensagens de texto com o nome da cidade.',
    ERROR_OPERATION_CANCELLED:
      '❌ Operação cancelada. Digite o nome de uma cidade para começar novamente.',
    ERROR_INVALID_SESSION:
      '❌ Erro: sessão inválida. Digite o nome de uma cidade para começar.',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ Idioma não reconhecido. Por favor, digite o número (1-9) ou o nome do idioma da lista anterior.',
    ERROR_SESSION_EXPIRED: '❌ Sessão expirada. Digite uma cidade novamente.',
    ERROR_WEATHER_FETCH:
      '❌ Desculpe, ocorreu um erro ao buscar as informações meteorológicas.',
    ERROR_CITY_NOT_FOUND:
      '🏙️ Cidade não encontrada. Verifique o nome e tente novamente.',
    ERROR_NETWORK_PROBLEM:
      '🌐 Problema de conexão. Tente novamente em alguns instantes.',

    LANGUAGE_SELECTED: 'Idioma selecionado: {language}',
    NEW_CONSULTATION_TIP:
      '🔄 Digite o nome de outra cidade para uma nova consulta!',
    TYPING_ACTION: 'Digitando...',

    WEATHER_FORECAST_FOR: '🌤️ *PREVISÃO PARA\\: {location}*',
    CURRENT_CONDITIONS: '📊 *CONDIÇÕES ATUAIS*',
    TEMPERATURE_LABEL: '🌡️ Temperatura',
    FEELS_LIKE: 'Sensação',
    CONDITION_LABEL: '🌤️ Condição',
    HUMIDITY_LABEL: '💧 Umidade',
    WIND_LABEL: '💨 Vento',
    UV_LABEL: '☀️ UV',
    CLOUDINESS_LABEL: '☁️ Nebulosidade',
    CLASSIFICATIONS_TITLE: '🏷️ *CLASSIFICAÇÕES*',
    TEMPERATURE_CLASS: '• Temperatura',
    HUMIDITY_CLASS: '• Umidade',
    WIND_CLASS: '• Vento',
    UV_INDEX_CLASS: '• Índice UV',
    SUN_TITLE: '🌞 *SOL*',
    SUNRISE_LABEL: 'Nascer',
    SUNSET_LABEL: 'Pôr',
    MY_ADVICE_TITLE: '💡 *MEUS CONSELHOS*',
    ATTENTION_ALERTS: '⚠️ *ATENÇÃO\\! ALERTAS ATIVOS* ⚠️',
    UPDATED_AT: '_Atualizado às {time}_',
    SUMMARY_TITLE: '💬 *RESUMO DO DIA*',
    NO_DESCRIPTION: 'Sem descrição',
  },

  en: {
    WELCOME_TITLE: '🌤️ *Welcome to the Previzapp!*',
    WELCOME_MESSAGE:
      'Send the name of a city or address and I will give you weather information in your preferred language!',
    WELCOME_EXAMPLES:
      'Examples:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: 'Type /help for more information.',

    HELP_TITLE: '🆘 *How to use the Previzapp:*',
    HELP_STEP1: '1️⃣ Send the name of a city',
    HELP_STEP2: '2️⃣ Choose your preferred language',
    HELP_STEP3: '3️⃣ Receive weather information',
    HELP_AVAILABLE_COMMANDS: '*Available commands:*',
    HELP_START_COMMAND: '/start - Start the bot',
    HELP_HELP_COMMAND: '/help - Show this help',
    HELP_CANCEL_COMMAND: '/cancel - Cancel current operation',
    HELP_USAGE_EXAMPLES:
      '*Usage examples:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*Supported languages:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE:
      '🌍 *Choose your preferred language for {location}:*',
    LANGUAGE_SELECTION_MESSAGE: 'Select an option below:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *Choose your language for {location}:*',
    LANGUAGE_FALLBACK_INSTRUCTION: 'Type the number of your choice (1-9):',

    ERROR_TEXT_ONLY: 'Please send only text messages with the city name.',
    ERROR_OPERATION_CANCELLED:
      '❌ Operation cancelled. Type a city name to start again.',
    ERROR_INVALID_SESSION:
      '❌ Error: invalid session. Type a city name to start.',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ Language not recognized. Please type the number (1-9) or the language name from the previous list.',
    ERROR_SESSION_EXPIRED: '❌ Session expired. Type a city again.',
    ERROR_WEATHER_FETCH:
      '❌ Sorry, an error occurred while fetching weather information.',
    ERROR_CITY_NOT_FOUND: '🏙️ City not found. Check the name and try again.',
    ERROR_NETWORK_PROBLEM: '🌐 Connection problem. Try again in a few moments.',

    LANGUAGE_SELECTED: 'Language selected: {language}',
    NEW_CONSULTATION_TIP: '🔄 Type another city name for a new query!',
    TYPING_ACTION: 'Typing...',

    WEATHER_FORECAST_FOR: '🌤️ *FORECAST FOR\\: {location}*',
    CURRENT_CONDITIONS: '📊 *CURRENT CONDITIONS*',
    TEMPERATURE_LABEL: '🌡️ Temperature',
    FEELS_LIKE: 'Feels like',
    CONDITION_LABEL: '🌤️ Condition',
    HUMIDITY_LABEL: '💧 Humidity',
    WIND_LABEL: '💨 Wind',
    UV_LABEL: '☀️ UV',
    CLOUDINESS_LABEL: '☁️ Cloudiness',
    CLASSIFICATIONS_TITLE: '🏷️ *CLASSIFICATIONS*',
    TEMPERATURE_CLASS: '• Temperature',
    HUMIDITY_CLASS: '• Humidity',
    WIND_CLASS: '• Wind',
    UV_INDEX_CLASS: '• UV Index',
    SUN_TITLE: '🌞 *SUN*',
    SUNRISE_LABEL: 'Sunrise',
    SUNSET_LABEL: 'Sunset',
    MY_ADVICE_TITLE: '💡 *MY ADVICE*',
    ATTENTION_ALERTS: '⚠️ *ATTENTION\\! ACTIVE ALERTS* ⚠️',
    UPDATED_AT: '_Updated at {time}_',
    SUMMARY_TITLE: '💬 *DAILY SUMMARY*',
    NO_DESCRIPTION: 'No description',
  },

  es: {
    WELCOME_TITLE: '🌤️ *¡Bienvenido al Bot Previzapp!*',
    WELCOME_MESSAGE:
      '¡Envía el nombre de una ciudad o dirección y te daré la información meteorológica en tu idioma preferido!',
    WELCOME_EXAMPLES:
      'Ejemplos:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: 'Escribe /help para más información.',

    HELP_TITLE: '🆘 *Cómo usar el Bot Previzapp:*',
    HELP_STEP1: '1️⃣ Envía el nombre de una ciudad',
    HELP_STEP2: '2️⃣ Elige tu idioma preferido',
    HELP_STEP3: '3️⃣ Recibe la información meteorológica',
    HELP_AVAILABLE_COMMANDS: '*Comandos disponibles:*',
    HELP_START_COMMAND: '/start - Iniciar el bot',
    HELP_HELP_COMMAND: '/help - Mostrar esta ayuda',
    HELP_CANCEL_COMMAND: '/cancel - Cancelar operación actual',
    HELP_USAGE_EXAMPLES:
      '*Ejemplos de uso:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*Idiomas soportados:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE: '🌍 *Elige tu idioma preferido para {location}:*',
    LANGUAGE_SELECTION_MESSAGE: 'Selecciona una opción abajo:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *Elige tu idioma para {location}:*',
    LANGUAGE_FALLBACK_INSTRUCTION: 'Escribe el número de tu elección (1-9):',

    ERROR_TEXT_ONLY:
      'Por favor, envía solo mensajes de texto con el nombre de la ciudad.',
    ERROR_OPERATION_CANCELLED:
      '❌ Operación cancelada. Escribe el nombre de una ciudad para empezar de nuevo.',
    ERROR_INVALID_SESSION:
      '❌ Error: sesión inválida. Escribe el nombre de una ciudad para empezar.',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ Idioma no reconocido. Por favor, escribe el número (1-9) o el nombre del idioma de la lista anterior.',
    ERROR_SESSION_EXPIRED: '❌ Sesión expirada. Escribe una ciudad de nuevo.',
    ERROR_WEATHER_FETCH:
      '❌ Lo siento, ocurrió un error al buscar la información meteorológica.',
    ERROR_CITY_NOT_FOUND:
      '🏙️ Ciudad no encontrada. Verifica el nombre e inténtalo de nuevo.',
    ERROR_NETWORK_PROBLEM:
      '🌐 Problema de conexión. Inténtalo de nuevo en unos momentos.',

    LANGUAGE_SELECTED: 'Idioma seleccionado: {language}',
    NEW_CONSULTATION_TIP:
      '🔄 ¡Escribe el nombre de otra ciudad para una nueva consulta!',
    TYPING_ACTION: 'Escribiendo...',

    WEATHER_FORECAST_FOR: '🌤️ *PRONÓSTICO PARA\\: {location}*',
    CURRENT_CONDITIONS: '📊 *CONDICIONES ACTUALES*',
    TEMPERATURE_LABEL: '🌡️ Temperatura',
    FEELS_LIKE: 'Sensación',
    CONDITION_LABEL: '🌤️ Condición',
    HUMIDITY_LABEL: '💧 Humedad',
    WIND_LABEL: '💨 Viento',
    UV_LABEL: '☀️ UV',
    CLOUDINESS_LABEL: '☁️ Nubosidad',
    CLASSIFICATIONS_TITLE: '🏷️ *CLASIFICACIONES*',
    TEMPERATURE_CLASS: '• Temperatura',
    HUMIDITY_CLASS: '• Humedad',
    WIND_CLASS: '• Viento',
    UV_INDEX_CLASS: '• Índice UV',
    SUN_TITLE: '🌞 *SOL*',
    SUNRISE_LABEL: 'Amanecer',
    SUNSET_LABEL: 'Atardecer',
    MY_ADVICE_TITLE: '💡 *MIS CONSEJOS*',
    ATTENTION_ALERTS: '⚠️ *¡ATENCIÓN\\! ALERTAS ACTIVAS* ⚠️',
    UPDATED_AT: '_Actualizado a las {time}_',
    SUMMARY_TITLE: '💬 *RESUMEN DEL DÍA*',
    NO_DESCRIPTION: 'Sin descripción',
  },

  fr: {
    WELCOME_TITLE: '🌤️ *Bienvenue au Bot Previzapp!*',
    WELCOME_MESSAGE:
      "Envoyez le nom d'une ville ou une adresse et je vous donnerai les informations météorologiques dans votre langue préférée!",
    WELCOME_EXAMPLES:
      'Exemples:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: "Tapez /help pour plus d'informations.",

    HELP_TITLE: '🆘 *Comment utiliser le Bot Previzapp:*',
    HELP_STEP1: "1️⃣ Envoyez le nom d'une ville",
    HELP_STEP2: '2️⃣ Choisissez votre langue préférée',
    HELP_STEP3: '3️⃣ Recevez les informations météorologiques',
    HELP_AVAILABLE_COMMANDS: '*Commandes disponibles:*',
    HELP_START_COMMAND: '/start - Démarrer le bot',
    HELP_HELP_COMMAND: '/help - Afficher cette aide',
    HELP_CANCEL_COMMAND: "/cancel - Annuler l'opération en cours",
    HELP_USAGE_EXAMPLES:
      "*Exemples d'utilisation:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England",
    HELP_SUPPORTED_LANGUAGES:
      '*Langues supportées:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE:
      '🌍 *Choisissez votre langue préférée pour {location}:*',
    LANGUAGE_SELECTION_MESSAGE: 'Sélectionnez une option ci-dessous:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *Choisissez votre langue pour {location}:*',
    LANGUAGE_FALLBACK_INSTRUCTION: 'Tapez le numéro de votre choix (1-9):',

    ERROR_TEXT_ONLY:
      'Veuillez envoyer uniquement des messages texte avec le nom de la ville.',
    ERROR_OPERATION_CANCELLED:
      "❌ Opération annulée. Tapez le nom d'une ville pour recommencer.",
    ERROR_INVALID_SESSION:
      "❌ Erreur: session invalide. Tapez le nom d'une ville pour commencer.",
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ Langue non reconnue. Veuillez taper le numéro (1-9) ou le nom de la langue de la liste précédente.',
    ERROR_SESSION_EXPIRED: '❌ Session expirée. Tapez une ville à nouveau.',
    ERROR_WEATHER_FETCH:
      "❌ Désolé, une erreur s'est produite lors de la récupération des informations météorologiques.",
    ERROR_CITY_NOT_FOUND: '🏙️ Ville non trouvée. Vérifiez le nom et réessayez.',
    ERROR_NETWORK_PROBLEM:
      '🌐 Problème de connexion. Réessayez dans quelques instants.',

    LANGUAGE_SELECTED: 'Langue sélectionnée: {language}',
    NEW_CONSULTATION_TIP:
      "🔄 Tapez le nom d'une autre ville pour une nouvelle consultation!",
    TYPING_ACTION: 'En train de taper...',

    WEATHER_FORECAST_FOR: '🌤️ *PRÉVISIONS POUR\\: {location}*',
    CURRENT_CONDITIONS: '📊 *CONDITIONS ACTUELLES*',
    TEMPERATURE_LABEL: '🌡️ Température',
    FEELS_LIKE: 'Ressenti',
    CONDITION_LABEL: '🌤️ Condition',
    HUMIDITY_LABEL: '💧 Humidité',
    WIND_LABEL: '💨 Vent',
    UV_LABEL: '☀️ UV',
    CLOUDINESS_LABEL: '☁️ Nébulosité',
    CLASSIFICATIONS_TITLE: '🏷️ *CLASSIFICATIONS*',
    TEMPERATURE_CLASS: '• Température',
    HUMIDITY_CLASS: '• Humidité',
    WIND_CLASS: '• Vent',
    UV_INDEX_CLASS: '• Indice UV',
    SUN_TITLE: '🌞 *SOLEIL*',
    SUNRISE_LABEL: 'Lever',
    SUNSET_LABEL: 'Coucher',
    MY_ADVICE_TITLE: '💡 *MES CONSEILS*',
    ATTENTION_ALERTS: '⚠️ *ATTENTION\\! ALERTES ACTIVES* ⚠️',
    UPDATED_AT: '_Mis à jour à {time}_',
    SUMMARY_TITLE: '💬 *RÉSUMÉ DU JOUR*',
    NO_DESCRIPTION: 'Aucune description',
  },
  de: {
    WELCOME_TITLE: '🌤️ *Willkommen beim Previzapp!*',
    WELCOME_MESSAGE:
      'Senden Sie den Namen einer Stadt oder Adresse und ich gebe Ihnen Wetterinformationen in Ihrer bevorzugten Sprache!',
    WELCOME_EXAMPLES:
      'Beispiele:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: 'Tippen Sie /help für weitere Informationen.',

    HELP_TITLE: '🆘 *So verwenden Sie den Previzapp:*',
    HELP_STEP1: '1️⃣ Senden Sie den Namen einer Stadt',
    HELP_STEP2: '2️⃣ Wählen Sie Ihre bevorzugte Sprache',
    HELP_STEP3: '3️⃣ Erhalten Sie Wetterinformationen',
    HELP_AVAILABLE_COMMANDS: '*Verfügbare Befehle:*',
    HELP_START_COMMAND: '/start - Bot starten',
    HELP_HELP_COMMAND: '/help - Diese Hilfe anzeigen',
    HELP_CANCEL_COMMAND: '/cancel - Aktuellen Vorgang abbrechen',
    HELP_USAGE_EXAMPLES:
      '*Verwendungsbeispiele:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*Unterstützte Sprachen:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE:
      '🌍 *Wählen Sie Ihre bevorzugte Sprache für {location}:*',
    LANGUAGE_SELECTION_MESSAGE: 'Wählen Sie eine Option unten:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *Wählen Sie Ihre Sprache für {location}:*',
    LANGUAGE_FALLBACK_INSTRUCTION: 'Tippen Sie die Nummer Ihrer Wahl (1-9):',

    ERROR_TEXT_ONLY: 'Bitte senden Sie nur Textnachrichten mit dem Stadtnamen.',
    ERROR_OPERATION_CANCELLED:
      '❌ Vorgang abgebrochen. Tippen Sie einen Stadtnamen, um neu zu starten.',
    ERROR_INVALID_SESSION:
      '❌ Fehler: ungültige Sitzung. Tippen Sie einen Stadtnamen zum Starten.',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ Sprache nicht erkannt. Bitte tippen Sie die Nummer (1-9) oder den Sprachnamen aus der vorherigen Liste.',
    ERROR_SESSION_EXPIRED:
      '❌ Sitzung abgelaufen. Tippen Sie wieder eine Stadt.',
    ERROR_WEATHER_FETCH:
      '❌ Entschuldigung, beim Abrufen der Wetterinformationen ist ein Fehler aufgetreten.',
    ERROR_CITY_NOT_FOUND:
      '🏙️ Stadt nicht gefunden. Überprüfen Sie den Namen und versuchen Sie es erneut.',
    ERROR_NETWORK_PROBLEM:
      '🌐 Verbindungsproblem. Versuchen Sie es in wenigen Augenblicken erneut.',

    LANGUAGE_SELECTED: 'Sprache ausgewählt: {language}',
    NEW_CONSULTATION_TIP:
      '🔄 Tippen Sie einen anderen Stadtnamen für eine neue Abfrage!',
    TYPING_ACTION: 'Tippt...',

    WEATHER_FORECAST_FOR: '🌤️ *VORHERSAGE FÜR\\: {location}*',
    CURRENT_CONDITIONS: '📊 *AKTUELLE BEDINGUNGEN*',
    TEMPERATURE_LABEL: '🌡️ Temperatur',
    FEELS_LIKE: 'Gefühlt',
    CONDITION_LABEL: '🌤️ Zustand',
    HUMIDITY_LABEL: '💧 Feuchtigkeit',
    WIND_LABEL: '💨 Wind',
    UV_LABEL: '☀️ UV',
    CLOUDINESS_LABEL: '☁️ Bewölkung',
    CLASSIFICATIONS_TITLE: '🏷️ *KLASSIFIKATIONEN*',
    TEMPERATURE_CLASS: '• Temperatur',
    HUMIDITY_CLASS: '• Feuchtigkeit',
    WIND_CLASS: '• Wind',
    UV_INDEX_CLASS: '• UV-Index',
    SUN_TITLE: '🌞 *SONNE*',
    SUNRISE_LABEL: 'Sonnenaufgang',
    SUNSET_LABEL: 'Sonnenuntergang',
    MY_ADVICE_TITLE: '💡 *MEINE RATSCHLÄGE*',
    ATTENTION_ALERTS: '⚠️ *ACHTUNG\\! AKTIVE WARNUNGEN* ⚠️',
    UPDATED_AT: '_Aktualisiert um {time}_',
    SUMMARY_TITLE: '💬 *TAGESZUSAMMENFASSUNG*',
    NO_DESCRIPTION: 'Keine Beschreibung',
  },

  it: {
    WELCOME_TITLE: '🌤️ *Benvenuto al Bot Previzapp!*',
    WELCOME_MESSAGE:
      'Invia il nome di una città o indirizzo e ti darò le informazioni meteorologiche nella tua lingua preferita!',
    WELCOME_EXAMPLES:
      'Esempi:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: 'Digita /help per maggiori informazioni.',

    HELP_TITLE: '🆘 *Come usare il Bot Previzapp:*',
    HELP_STEP1: '1️⃣ Invia il nome di una città',
    HELP_STEP2: '2️⃣ Scegli la tua lingua preferita',
    HELP_STEP3: '3️⃣ Ricevi le informazioni meteorologiche',
    HELP_AVAILABLE_COMMANDS: '*Comandi disponibili:*',
    HELP_START_COMMAND: '/start - Avvia il bot',
    HELP_HELP_COMMAND: '/help - Mostra questo aiuto',
    HELP_CANCEL_COMMAND: '/cancel - Annulla operazione corrente',
    HELP_USAGE_EXAMPLES:
      '*Esempi di utilizzo:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*Lingue supportate:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE:
      '🌍 *Scegli la tua lingua preferita per {location}:*',
    LANGUAGE_SELECTION_MESSAGE: "Seleziona un'opzione qui sotto:",
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *Scegli la tua lingua per {location}:*',
    LANGUAGE_FALLBACK_INSTRUCTION: 'Digita il numero della tua scelta (1-9):',

    ERROR_TEXT_ONLY:
      'Per favore, invia solo messaggi di testo con il nome della città.',
    ERROR_OPERATION_CANCELLED:
      '❌ Operazione annullata. Digita il nome di una città per ricominciare.',
    ERROR_INVALID_SESSION:
      '❌ Errore: sessione non valida. Digita il nome di una città per iniziare.',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ Lingua non riconosciuta. Per favore, digita il numero (1-9) o il nome della lingua dalla lista precedente.',
    ERROR_SESSION_EXPIRED: '❌ Sessione scaduta. Digita una città di nuovo.',
    ERROR_WEATHER_FETCH:
      '❌ Scusa, si è verificato un errore nel recuperare le informazioni meteorologiche.',
    ERROR_CITY_NOT_FOUND: '🏙️ Città non trovata. Controlla il nome e riprova.',
    ERROR_NETWORK_PROBLEM:
      '🌐 Problema di connessione. Riprova tra qualche istante.',

    LANGUAGE_SELECTED: 'Lingua selezionata: {language}',
    NEW_CONSULTATION_TIP:
      "🔄 Digita il nome di un'altra città per una nuova consultazione!",
    TYPING_ACTION: 'Digitando...',

    WEATHER_FORECAST_FOR: '🌤️ *PREVISIONI PER\\: {location}*',
    CURRENT_CONDITIONS: '📊 *CONDIZIONI ATTUALI*',
    TEMPERATURE_LABEL: '🌡️ Temperatura',
    FEELS_LIKE: 'Percepita',
    CONDITION_LABEL: '🌤️ Condizione',
    HUMIDITY_LABEL: '💧 Umidità',
    WIND_LABEL: '💨 Vento',
    UV_LABEL: '☀️ UV',
    CLOUDINESS_LABEL: '☁️ Nuvolosità',
    CLASSIFICATIONS_TITLE: '🏷️ *CLASSIFICAZIONI*',
    TEMPERATURE_CLASS: '• Temperatura',
    HUMIDITY_CLASS: '• Umidità',
    WIND_CLASS: '• Vento',
    UV_INDEX_CLASS: '• Indice UV',
    SUN_TITLE: '🌞 *SOLE*',
    SUNRISE_LABEL: 'Alba',
    SUNSET_LABEL: 'Tramonto',
    MY_ADVICE_TITLE: '💡 *I MIEI CONSIGLI*',
    ATTENTION_ALERTS: '⚠️ *ATTENZIONE\\! ALLERTE ATTIVE* ⚠️',
    UPDATED_AT: '_Aggiornato alle {time}_',
    SUMMARY_TITLE: '💬 *RIASSUNTO DEL GIORNO*',
    NO_DESCRIPTION: 'Nessuna descrizione',
  },

  ru: {
    WELCOME_TITLE: '🌤️ *Добро пожаловать в Погодного Бота!*',
    WELCOME_MESSAGE:
      'Отправьте название города или адрес, и я дам вам информацию о погоде на вашем предпочтительном языке!',
    WELCOME_EXAMPLES:
      'Примеры:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: 'Наберите /help для получения дополнительной информации.',

    HELP_TITLE: '🆘 *Как использовать Погодного Бота:*',
    HELP_STEP1: '1️⃣ Отправьте название города',
    HELP_STEP2: '2️⃣ Выберите предпочтительный язык',
    HELP_STEP3: '3️⃣ Получите информацию о погоде',
    HELP_AVAILABLE_COMMANDS: '*Доступные команды:*',
    HELP_START_COMMAND: '/start - Запустить бота',
    HELP_HELP_COMMAND: '/help - Показать эту помощь',
    HELP_CANCEL_COMMAND: '/cancel - Отменить текущую операцию',
    HELP_USAGE_EXAMPLES:
      '*Примеры использования:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*Поддерживаемые языки:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE:
      '🌍 *Выберите предпочтительный язык для {location}:*',
    LANGUAGE_SELECTION_MESSAGE: 'Выберите вариант ниже:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *Выберите ваш язык для {location}:*',
    LANGUAGE_FALLBACK_INSTRUCTION: 'Введите номер вашего выбора (1-9):',

    ERROR_TEXT_ONLY:
      'Пожалуйста, отправляйте только текстовые сообщения с названием города.',
    ERROR_OPERATION_CANCELLED:
      '❌ Операция отменена. Введите название города, чтобы начать заново.',
    ERROR_INVALID_SESSION:
      '❌ Ошибка: недействительная сессия. Введите название города для начала.',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ Язык не распознан. Пожалуйста, введите номер (1-9) или название языка из предыдущего списка.',
    ERROR_SESSION_EXPIRED: '❌ Сессия истекла. Введите город снова.',
    ERROR_WEATHER_FETCH:
      '❌ Извините, произошла ошибка при получении информации о погоде.',
    ERROR_CITY_NOT_FOUND:
      '🏙️ Город не найден. Проверьте название и попробуйте снова.',
    ERROR_NETWORK_PROBLEM:
      '🌐 Проблема с подключением. Попробуйте снова через несколько мгновений.',

    LANGUAGE_SELECTED: 'Выбран язык: {language}',
    NEW_CONSULTATION_TIP:
      '🔄 Введите название другого города для нового запроса!',
    TYPING_ACTION: 'Печатает...',

    WEATHER_FORECAST_FOR: '🌤️ *ПРОГНОЗ ДЛЯ\\: {location}*',
    CURRENT_CONDITIONS: '📊 *ТЕКУЩИЕ УСЛОВИЯ*',
    TEMPERATURE_LABEL: '🌡️ Температура',
    FEELS_LIKE: 'Ощущается',
    CONDITION_LABEL: '🌤️ Состояние',
    HUMIDITY_LABEL: '💧 Влажность',
    WIND_LABEL: '💨 Ветер',
    UV_LABEL: '☀️ УФ',
    CLOUDINESS_LABEL: '☁️ Облачность',
    CLASSIFICATIONS_TITLE: '🏷️ *КЛАССИФИКАЦИИ*',
    TEMPERATURE_CLASS: '• Температура',
    HUMIDITY_CLASS: '• Влажность',
    WIND_CLASS: '• Ветер',
    UV_INDEX_CLASS: '• УФ-индекс',
    SUN_TITLE: '🌞 *СОЛНЦЕ*',
    SUNRISE_LABEL: 'Восход',
    SUNSET_LABEL: 'Закат',
    MY_ADVICE_TITLE: '💡 *МОИ СОВЕТЫ*',
    ATTENTION_ALERTS: '⚠️ *ВНИМАНИЕ\\! АКТИВНЫЕ ПРЕДУПРЕЖДЕНИЯ* ⚠️',
    UPDATED_AT: '_Обновлено в {time}_',
    SUMMARY_TITLE: '💬 *СВОДКА ДНЯ*',
    NO_DESCRIPTION: 'Без описания',
  },

  ja: {
    WELCOME_TITLE: '🌤️ *天気ボットへようこそ！*',
    WELCOME_MESSAGE:
      '都市名や住所を送信していただければ、お好みの言語で天気情報をお知らせします！',
    WELCOME_EXAMPLES:
      '例:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: '詳細については/helpと入力してください。',

    HELP_TITLE: '🆘 *天気ボットの使い方:*',
    HELP_STEP1: '1️⃣ 都市名を送信',
    HELP_STEP2: '2️⃣ お好みの言語を選択',
    HELP_STEP3: '3️⃣ 天気情報を受け取る',
    HELP_AVAILABLE_COMMANDS: '*利用可能なコマンド:*',
    HELP_START_COMMAND: '/start - ボットを開始',
    HELP_HELP_COMMAND: '/help - このヘルプを表示',
    HELP_CANCEL_COMMAND: '/cancel - 現在の操作をキャンセル',
    HELP_USAGE_EXAMPLES:
      '*使用例:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*サポート言語:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE:
      '🌍 *{location}のお好みの言語を選択してください:*',
    LANGUAGE_SELECTION_MESSAGE: '以下のオプションを選択してください:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *{location}の言語を選択してください:*',
    LANGUAGE_FALLBACK_INSTRUCTION: '選択番号を入力してください (1-9):',

    ERROR_TEXT_ONLY: '都市名のテキストメッセージのみ送信してください。',
    ERROR_OPERATION_CANCELLED:
      '❌ 操作がキャンセルされました。再開するには都市名を入力してください。',
    ERROR_INVALID_SESSION:
      '❌ エラー: 無効なセッションです。開始するには都市名を入力してください。',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ 言語が認識されません。番号 (1-9) または前のリストの言語名を入力してください。',
    ERROR_SESSION_EXPIRED:
      '❌ セッションが期限切れです。再度都市を入力してください。',
    ERROR_WEATHER_FETCH:
      '❌ 申し訳ございません、天気情報の取得中にエラーが発生しました。',
    ERROR_CITY_NOT_FOUND:
      '🏙️ 都市が見つかりません。名前を確認して再試行してください。',
    ERROR_NETWORK_PROBLEM:
      '🌐 接続の問題です。しばらくしてから再試行してください。',

    LANGUAGE_SELECTED: '選択された言語: {language}',
    NEW_CONSULTATION_TIP: '🔄 新しい検索のために他の都市名を入力してください！',
    TYPING_ACTION: '入力中...',

    WEATHER_FORECAST_FOR: '🌤️ *{location}の予報*',
    CURRENT_CONDITIONS: '📊 *現在の状況*',
    TEMPERATURE_LABEL: '🌡️ 気温',
    FEELS_LIKE: '体感',
    CONDITION_LABEL: '🌤️ 状態',
    HUMIDITY_LABEL: '💧 湿度',
    WIND_LABEL: '💨 風',
    UV_LABEL: '☀️ UV',
    CLOUDINESS_LABEL: '☁️ 雲量',
    CLASSIFICATIONS_TITLE: '🏷️ *分類*',
    TEMPERATURE_CLASS: '• 気温',
    HUMIDITY_CLASS: '• 湿度',
    WIND_CLASS: '• 風',
    UV_INDEX_CLASS: '• UVインデックス',
    SUN_TITLE: '🌞 *太陽*',
    SUNRISE_LABEL: '日の出',
    SUNSET_LABEL: '日の入り',
    MY_ADVICE_TITLE: '💡 *アドバイス*',
    ATTENTION_ALERTS: '⚠️ *注意\\! アクティブな警報* ⚠️',
    UPDATED_AT: '_{time}更新_',
    SUMMARY_TITLE: '💬 *今日のまとめ*',
    NO_DESCRIPTION: '説明なし',
  },

  zh: {
    WELCOME_TITLE: '🌤️ *欢迎使用天气机器人！*',
    WELCOME_MESSAGE: '发送城市名称或地址，我将为您提供您首选语言的天气信息！',
    WELCOME_EXAMPLES:
      '示例:\n• São Paulo\n• Rio de Janeiro, RJ\n• New York\n• London, UK',
    WELCOME_HELP_TIP: '输入 /help 获取更多信息。',

    HELP_TITLE: '🆘 *如何使用天气机器人:*',
    HELP_STEP1: '1️⃣ 发送城市名称',
    HELP_STEP2: '2️⃣ 选择您的首选语言',
    HELP_STEP3: '3️⃣ 接收天气信息',
    HELP_AVAILABLE_COMMANDS: '*可用命令:*',
    HELP_START_COMMAND: '/start - 启动机器人',
    HELP_HELP_COMMAND: '/help - 显示此帮助',
    HELP_CANCEL_COMMAND: '/cancel - 取消当前操作',
    HELP_USAGE_EXAMPLES:
      '*使用示例:*\n• São Paulo\n• Rio de Janeiro, Brasil\n• New York, USA\n• London, England',
    HELP_SUPPORTED_LANGUAGES:
      '*支持的语言:*\n🇧🇷 Português | 🇺🇸 English | 🇪🇸 Español\n🇫🇷 Français | 🇩🇪 Deutsch | 🇮🇹 Italiano\n🇷🇺 Русский | 🇯🇵 日本語 | 🇨🇳 中文',

    LANGUAGE_SELECTION_TITLE: '🌍 *选择您对 {location} 的首选语言:*',
    LANGUAGE_SELECTION_MESSAGE: '请选择下面的选项:',
    LANGUAGE_FALLBACK_MESSAGE: '🌍 *选择您对 {location} 的语言:*',
    LANGUAGE_FALLBACK_INSTRUCTION: '输入您的选择编号 (1-9):',

    ERROR_TEXT_ONLY: '请只发送包含城市名称的文本消息。',
    ERROR_OPERATION_CANCELLED: '❌ 操作已取消。输入城市名称重新开始。',
    ERROR_INVALID_SESSION: '❌ 错误: 无效会话。输入城市名称开始。',
    ERROR_LANGUAGE_NOT_RECOGNIZED:
      '❌ 语言未识别。请输入编号 (1-9) 或上一个列表中的语言名称。',
    ERROR_SESSION_EXPIRED: '❌ 会话已过期。请重新输入城市。',
    ERROR_WEATHER_FETCH: '❌ 抱歉，获取天气信息时发生错误。',
    ERROR_CITY_NOT_FOUND: '🏙️ 未找到城市。检查名称并重试。',
    ERROR_NETWORK_PROBLEM: '🌐 连接问题。请稍后重试。',

    LANGUAGE_SELECTED: '已选择语言: {language}',
    NEW_CONSULTATION_TIP: '🔄 输入另一个城市名称进行新查询！',
    TYPING_ACTION: '正在输入...',

    WEATHER_FORECAST_FOR: '🌤️ *{location} 的天气预报*',
    CURRENT_CONDITIONS: '📊 *当前状况*',
    TEMPERATURE_LABEL: '🌡️ 温度',
    FEELS_LIKE: '体感',
    CONDITION_LABEL: '🌤️ 状况',
    HUMIDITY_LABEL: '💧 湿度',
    WIND_LABEL: '💨 风',
    UV_LABEL: '☀️ 紫外线',
    CLOUDINESS_LABEL: '☁️ 云量',
    CLASSIFICATIONS_TITLE: '🏷️ *分类*',
    TEMPERATURE_CLASS: '• 温度',
    HUMIDITY_CLASS: '• 湿度',
    WIND_CLASS: '• 风',
    UV_INDEX_CLASS: '• 紫外线指数',
    SUN_TITLE: '🌞 *太阳*',
    SUNRISE_LABEL: '日出',
    SUNSET_LABEL: '日落',
    MY_ADVICE_TITLE: '💡 *我的建议*',
    ATTENTION_ALERTS: '⚠️ *注意\\! 活跃警报* ⚠️',
    UPDATED_AT: '_{time} 更新_',
    SUMMARY_TITLE: '💬 *每日摘要*',
    NO_DESCRIPTION: '无描述',
  },
};

export class I18nService {
  static t(
    key: keyof TranslationKeys,
    lang: string = 'en',
    placeholders?: Record<string, string>,
  ): string {
    const translation = translations[lang] || translations['pt'];
    let text = translation[key] || translations['pt'][key];

    if (placeholders) {
      Object.entries(placeholders).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
      });
    }

    return text;
  }

  static isLanguageSupported(lang: string): boolean {
    return lang in translations;
  }

  static getSupportedLanguages(): string[] {
    return Object.keys(translations);
  }

  static getLanguageDisplayName(lang: string): string {
    const languageMap: Record<string, string> = {
      pt: '🇧🇷 Português',
      en: '🇺🇸 English',
      es: '🇪🇸 Español',
      fr: '🇫🇷 Français',
      de: '🇩🇪 Deutsch',
      it: '🇮🇹 Italiano',
      ru: '🇷🇺 Русский',
      ja: '🇯🇵 日本語',
      zh: '🇨🇳 中文',
    };
    return languageMap[lang] || languageMap['pt'];
  }

  static getDefaultLanguage(sessionLang?: string): string {
    if (sessionLang && this.isLanguageSupported(sessionLang)) {
      return sessionLang;
    }
    return 'en';
  }
}
