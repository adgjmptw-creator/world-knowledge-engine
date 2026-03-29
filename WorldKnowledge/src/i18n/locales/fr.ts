/**
 * French UI translations
 */
export default {
  app: {
    title: 'Moteur de Connaissances Mondiales',
    subtitle: 'Aventure des Drapeaux !',
  },
  home: {
    startQuiz: 'Commencer !',
    explorationMap: 'Carte d\'Exploration',
    encyclopedia: 'Encyclopédie',
    parentDashboard: 'Espace Parents',
    specialChallenge: 'Défi Spécial !',
    countriesMastered: '{{count}} pays maîtrisés',
    progress: 'Progression',
  },
  quiz: {
    question: 'À quel pays appartient ce drapeau ?',
    questionNumber: 'Question {{current}}',
    tapToSelect: 'Touche le bon drapeau !',
  },
  result: {
    correct: [
      'Incroyable !', 'Fantastique !', 'Bien joué !', 'Brillant !',
      'Super !', 'Merveilleux !', 'Bravo !', 'Parfait !',
      'Génial !', 'Excellent !',
    ],
    incorrect: [
      'Presque !', 'Très proche !', 'Bel essai !', 'Bon effort !',
      'Continue !', 'N\'abandonne pas !', 'Tu peux y arriver !', 'Encore un peu !',
    ],
    correctFlag: 'Voici le drapeau de {{country}}',
    hint: 'Indice : {{hint}}',
    funFact: 'Le savais-tu ?',
    nextQuestion: 'Suivant !',
    quit: 'Quitter',
    listenAgain: 'Réécouter',
  },
  map: {
    title: 'Carte d\'Exploration',
    countriesDiscovered: '{{count}} / {{total}} découverts',
    locked: 'Continue à jouer pour découvrir !',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Encyclopédie',
    searchPlaceholder: 'Chercher un pays...',
    allCountries: 'Tous les Pays',
    notYetDiscovered: 'Pas encore découvert',
  },
  parent: {
    authTitle: 'Vérification Parentale',
    authQuestion: 'Combien font {{a}} × {{b}} ?',
    authPlaceholder: 'Entrez la réponse',
    authSubmit: 'Valider',
    authError: 'Incorrect. Veuillez réessayer.',
    dashboardTitle: 'Tableau de Bord Parents',
    masteredCountries: 'Maîtrisés',
    weakCountries: 'À Réviser',
    playTimeLimit: 'Limite de Temps Quotidienne',
    playTimeUnlimited: 'Illimité',
    playTimeCurrent: 'Aujourd\'hui : {{minutes}} min',
    minutes: '{{count}} min',
    back: 'Retour',
    totalAnswered: 'Total Répondu',
    accuracy: 'Précision',
  },
  special: {
    title: 'Défi Spécial !',
    description: 'Peux-tu deviner le pays grâce à cette anecdote ?',
    whichCountry: 'Quel est ce pays ?',
    completed: 'Défi Terminé !',
  },
  common: {
    loading: 'Chargement...',
    error: 'Quelque chose s\'est mal passé',
    retry: 'Réessayer',
    timeLimitReached: 'Le temps est écoulé pour aujourd\'hui ! Reviens demain !',
  },
};
