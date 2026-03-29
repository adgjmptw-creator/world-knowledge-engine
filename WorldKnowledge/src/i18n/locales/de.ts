/**
 * German UI translations
 */
export default {
  app: {
    title: 'Weltwissen-Maschine',
    subtitle: 'Flaggen-Quiz-Abenteuer!',
  },
  home: {
    startQuiz: 'Quiz starten!',
    explorationMap: 'Entdeckungskarte',
    encyclopedia: 'Enzyklopädie',
    parentDashboard: 'Für Eltern',
    specialChallenge: 'Spezial-Challenge!',
    countriesMastered: '{{count}} Länder gemeistert',
    progress: 'Fortschritt',
  },
  quiz: {
    question: 'Zu welchem Land gehört diese Flagge?',
    questionNumber: 'Frage {{current}}',
    tapToSelect: 'Tippe auf die richtige Flagge!',
  },
  result: {
    correct: [
      'Unglaublich!', 'Fantastisch!', 'Richtig!', 'Brillant!',
      'Super!', 'Wunderbar!', 'Toll gemacht!', 'Perfekt!',
      'Großartig!', 'Sehr gut!',
    ],
    incorrect: [
      'Fast!', 'So nah dran!', 'Guter Versuch!', 'Guter Einsatz!',
      'Weiter versuchen!', 'Gib nicht auf!', 'Du schaffst das!', 'Beinahe!',
    ],
    correctFlag: 'Das ist die Flagge von {{country}}',
    hint: 'Hinweis: {{hint}}',
    funFact: 'Wusstest du?',
    nextQuestion: 'Weiter!',
    quit: 'Beenden',
    listenAgain: 'Nochmal hören',
  },
  map: {
    title: 'Entdeckungskarte',
    countriesDiscovered: '{{count}} / {{total}} entdeckt',
    locked: 'Spiel weiter, um mehr zu entdecken!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Enzyklopädie',
    searchPlaceholder: 'Land suchen...',
    allCountries: 'Alle Länder',
    notYetDiscovered: 'Noch nicht entdeckt',
  },
  parent: {
    authTitle: 'Eltern-Verifizierung',
    authQuestion: 'Was ist {{a}} × {{b}}?',
    authPlaceholder: 'Antwort eingeben',
    authSubmit: 'Absenden',
    authError: 'Falsch. Bitte versuche es erneut.',
    dashboardTitle: 'Eltern-Dashboard',
    masteredCountries: 'Gemeistert',
    weakCountries: 'Übung nötig',
    playTimeLimit: 'Tägliches Spielzeitlimit',
    playTimeUnlimited: 'Unbegrenzt',
    playTimeCurrent: 'Heute: {{minutes}} Min.',
    minutes: '{{count}} Min.',
    back: 'Zurück',
    totalAnswered: 'Gesamt beantwortet',
    accuracy: 'Genauigkeit',
  },
  special: {
    title: 'Spezial-Challenge!',
    description: 'Kannst du das Land anhand des Fun Facts erraten?',
    whichCountry: 'Welches Land ist das?',
    completed: 'Challenge geschafft!',
  },
  common: {
    loading: 'Wird geladen...',
    error: 'Etwas ist schiefgelaufen',
    retry: 'Erneut versuchen',
    timeLimitReached: 'Die Zeit für heute ist um! Komm morgen wieder!',
  },
};
