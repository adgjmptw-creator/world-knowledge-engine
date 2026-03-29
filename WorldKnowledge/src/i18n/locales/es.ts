/**
 * Spanish UI translations
 */
export default {
  app: {
    title: 'Motor de Conocimiento Mundial',
    subtitle: '¡Aventura de Banderas!',
  },
  home: {
    startQuiz: '¡Empezar!',
    explorationMap: 'Mapa de Exploración',
    encyclopedia: 'Enciclopedia',
    parentDashboard: 'Para Padres',
    specialChallenge: '¡Desafío Especial!',
    countriesMastered: '{{count}} países dominados',
    progress: 'Progreso',
  },
  quiz: {
    question: '¿A qué país pertenece esta bandera?',
    questionNumber: 'Pregunta {{current}}',
    tapToSelect: '¡Toca la bandera correcta!',
  },
  result: {
    correct: [
      '¡Increíble!', '¡Fantástico!', '¡Acertaste!', '¡Brillante!',
      '¡Súper!', '¡Maravilloso!', '¡Buen trabajo!', '¡Perfecto!',
      '¡Genial!', '¡Muy bien!',
    ],
    incorrect: [
      '¡Casi!', '¡Muy cerca!', '¡Buen intento!', '¡Buen esfuerzo!',
      '¡Sigue intentando!', '¡No te rindas!', '¡Tú puedes!', '¡Ya casi!',
    ],
    correctFlag: 'Esta es la bandera de {{country}}',
    hint: 'Pista: {{hint}}',
    funFact: 'Dato Curioso',
    nextQuestion: '¡Siguiente!',
    quit: 'Salir',
    listenAgain: 'Escuchar de nuevo',
  },
  map: {
    title: 'Mapa de Exploración',
    countriesDiscovered: '{{count}} / {{total}} descubiertos',
    locked: '¡Sigue jugando para descubrir!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Enciclopedia',
    searchPlaceholder: 'Buscar país...',
    allCountries: 'Todos los Países',
    notYetDiscovered: 'Aún no descubierto',
  },
  parent: {
    authTitle: 'Verificación de Padres',
    authQuestion: '¿Cuánto es {{a}} × {{b}}?',
    authPlaceholder: 'Ingresa la respuesta',
    authSubmit: 'Enviar',
    authError: 'Incorrecto. Por favor, intenta de nuevo.',
    dashboardTitle: 'Panel de Padres',
    masteredCountries: 'Dominados',
    weakCountries: 'Necesita Práctica',
    playTimeLimit: 'Límite de Tiempo Diario',
    playTimeUnlimited: 'Sin límite',
    playTimeCurrent: 'Hoy: {{minutes}} min',
    minutes: '{{count}} min',
    back: 'Volver',
    totalAnswered: 'Total Respondidas',
    accuracy: 'Precisión',
  },
  special: {
    title: '¡Desafío Especial!',
    description: '¿Puedes adivinar el país por el dato curioso?',
    whichCountry: '¿Qué país es este?',
    completed: '¡Desafío Completado!',
  },
  common: {
    loading: 'Cargando...',
    error: 'Algo salió mal',
    retry: 'Reintentar',
    timeLimitReached: '¡Se acabó el tiempo de hoy! ¡Vuelve mañana!',
  },
};
