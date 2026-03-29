/**
 * English UI translations
 */
export default {
  app: {
    title: 'World Knowledge Engine',
    subtitle: 'Flag Quiz Adventure!',
  },
  home: {
    startQuiz: 'Start Quiz!',
    explorationMap: 'Exploration Map',
    encyclopedia: 'Encyclopedia',
    parentDashboard: 'For Parents',
    specialChallenge: 'Special Challenge!',
    countriesMastered: '{{count}} countries mastered',
    progress: 'Progress',
  },
  quiz: {
    question: 'Which flag belongs to this country?',
    questionNumber: 'Question {{current}}',
    tapToSelect: 'Tap the correct flag!',
  },
  result: {
    correct: [
      'Amazing!', 'Fantastic!', 'You got it!', 'Brilliant!',
      'Super!', 'Wonderful!', 'Great job!', 'Perfect!',
      'Awesome!', 'Well done!',
    ],
    incorrect: [
      'Almost!', 'So close!', 'Nice try!', 'Good effort!',
      'Keep trying!', "Don't give up!", 'You can do it!', 'Nearly there!',
    ],
    correctFlag: 'This is the flag of {{country}}',
    hint: 'Hint: {{hint}}',
    funFact: 'Fun Fact',
    nextQuestion: 'Next!',
    quit: 'Quit',
    listenAgain: 'Listen again',
  },
  map: {
    title: 'Exploration Map',
    countriesDiscovered: '{{count}} / {{total}} discovered',
    locked: 'Keep playing to discover!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Encyclopedia',
    searchPlaceholder: 'Search country...',
    allCountries: 'All Countries',
    notYetDiscovered: 'Not yet discovered',
  },
  parent: {
    authTitle: 'Parent Verification',
    authQuestion: 'What is {{a}} × {{b}}?',
    authPlaceholder: 'Enter answer',
    authSubmit: 'Submit',
    authError: 'Incorrect. Please try again.',
    dashboardTitle: 'Parent Dashboard',
    masteredCountries: 'Mastered',
    weakCountries: 'Needs Practice',
    playTimeLimit: 'Daily Play Time Limit',
    playTimeUnlimited: 'Unlimited',
    playTimeCurrent: 'Today: {{minutes}} min',
    minutes: '{{count}} min',
    back: 'Back',
    totalAnswered: 'Total Answered',
    accuracy: 'Accuracy',
  },
  special: {
    title: 'Special Challenge!',
    description: 'Can you guess the country from the fun fact?',
    whichCountry: 'Which country is this?',
    completed: 'Challenge Complete!',
  },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    timeLimitReached: "Time's up for today! Come back tomorrow!",
  },
};
