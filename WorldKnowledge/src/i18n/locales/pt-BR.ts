/**
 * Brazilian Portuguese UI translations
 */
export default {
  app: {
    title: 'Motor de Conhecimento Mundial',
    subtitle: 'Aventura das Bandeiras!',
  },
  home: {
    startQuiz: 'Começar!',
    explorationMap: 'Mapa de Exploração',
    encyclopedia: 'Enciclopédia',
    parentDashboard: 'Para os Pais',
    specialChallenge: 'Desafio Especial!',
    countriesMastered: '{{count}} países dominados',
    progress: 'Progresso',
  },
  quiz: {
    question: 'A qual país pertence esta bandeira?',
    questionNumber: 'Pergunta {{current}}',
    tapToSelect: 'Toque na bandeira correta!',
  },
  result: {
    correct: [
      'Incrível!', 'Fantástico!', 'Acertou!', 'Brilhante!',
      'Super!', 'Maravilhoso!', 'Muito bem!', 'Perfeito!',
      'Demais!', 'Mandou bem!',
    ],
    incorrect: [
      'Quase!', 'Tão perto!', 'Boa tentativa!', 'Bom esforço!',
      'Continue tentando!', 'Não desista!', 'Você consegue!', 'Quase lá!',
    ],
    correctFlag: 'Esta é a bandeira do(a) {{country}}',
    hint: 'Dica: {{hint}}',
    funFact: 'Curiosidade',
    nextQuestion: 'Próxima!',
    quit: 'Sair',
    listenAgain: 'Ouvir de novo',
  },
  map: {
    title: 'Mapa de Exploração',
    countriesDiscovered: '{{count}} / {{total}} descobertos',
    locked: 'Continue jogando para descobrir!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Enciclopédia',
    searchPlaceholder: 'Buscar país...',
    allCountries: 'Todos os Países',
    notYetDiscovered: 'Ainda não descoberto',
  },
  parent: {
    authTitle: 'Verificação dos Pais',
    authQuestion: 'Quanto é {{a}} × {{b}}?',
    authPlaceholder: 'Digite a resposta',
    authSubmit: 'Enviar',
    authError: 'Incorreto. Por favor, tente novamente.',
    dashboardTitle: 'Painel dos Pais',
    masteredCountries: 'Dominados',
    weakCountries: 'Precisa Praticar',
    playTimeLimit: 'Limite de Tempo Diário',
    playTimeUnlimited: 'Ilimitado',
    playTimeCurrent: 'Hoje: {{minutes}} min',
    minutes: '{{count}} min',
    back: 'Voltar',
    totalAnswered: 'Total Respondidas',
    accuracy: 'Precisão',
  },
  special: {
    title: 'Desafio Especial!',
    description: 'Consegue adivinhar o país pela curiosidade?',
    whichCountry: 'Qual é este país?',
    completed: 'Desafio Completo!',
  },
  common: {
    loading: 'Carregando...',
    error: 'Algo deu errado',
    retry: 'Tentar de novo',
    timeLimitReached: 'O tempo de hoje acabou! Volte amanhã!',
  },
};
