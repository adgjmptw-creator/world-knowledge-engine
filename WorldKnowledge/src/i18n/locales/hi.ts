/**
 * Hindi UI translations
 */
export default {
  app: {
    title: 'वर्ल्ड नॉलेज इंजन',
    subtitle: 'झंडा क्विज़ एडवेंचर!',
  },
  home: {
    startQuiz: 'क्विज़ शुरू करो!',
    explorationMap: 'खोज का नक्शा',
    encyclopedia: 'विश्वकोश',
    parentDashboard: 'माता-पिता के लिए',
    specialChallenge: 'विशेष चुनौती!',
    countriesMastered: '{{count}} देश सीख लिए',
    progress: 'प्रगति',
  },
  quiz: {
    question: 'यह झंडा किस देश का है?',
    questionNumber: 'सवाल {{current}}',
    tapToSelect: 'सही झंडे पर टैप करो!',
  },
  result: {
    correct: [
      'शानदार!', 'बहुत बढ़िया!', 'सही जवाब!', 'कमाल!',
      'सुपर!', 'अद्भुत!', 'बहुत अच्छे!', 'परफ़ेक्ट!',
      'वाह!', 'जबरदस्त!',
    ],
    incorrect: [
      'लगभग!', 'बहुत करीब!', 'अच्छी कोशिश!', 'अच्छा प्रयास!',
      'कोशिश जारी रखो!', 'हार मत मानो!', 'तुम कर सकते हो!', 'बस थोड़ा और!',
    ],
    correctFlag: 'यह {{country}} का झंडा है',
    hint: 'संकेत: {{hint}}',
    funFact: 'मज़ेदार तथ्य',
    nextQuestion: 'अगला!',
    quit: 'बाहर',
    listenAgain: 'फिर से सुनो',
  },
  map: {
    title: 'खोज का नक्शा',
    countriesDiscovered: '{{count}} / {{total}} खोजे गए',
    locked: 'खेलते रहो और खोजो!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'विश्वकोश',
    searchPlaceholder: 'देश खोजें...',
    allCountries: 'सभी देश',
    notYetDiscovered: 'अभी तक नहीं खोजा',
  },
  parent: {
    authTitle: 'अभिभावक सत्यापन',
    authQuestion: '{{a}} × {{b}} कितना होता है?',
    authPlaceholder: 'जवाब लिखें',
    authSubmit: 'जमा करें',
    authError: 'गलत जवाब। कृपया फिर से कोशिश करें।',
    dashboardTitle: 'अभिभावक डैशबोर्ड',
    masteredCountries: 'सीखे हुए',
    weakCountries: 'अभ्यास ज़रूरी',
    playTimeLimit: 'दैनिक खेल समय सीमा',
    playTimeUnlimited: 'असीमित',
    playTimeCurrent: 'आज: {{minutes}} मिनट',
    minutes: '{{count}} मिनट',
    back: 'वापस',
    totalAnswered: 'कुल उत्तर दिए',
    accuracy: 'सटीकता',
  },
  special: {
    title: 'विशेष चुनौती!',
    description: 'क्या तुम मज़ेदार तथ्य से देश पहचान सकते हो?',
    whichCountry: 'यह कौन सा देश है?',
    completed: 'चुनौती पूरी!',
  },
  common: {
    loading: 'लोड हो रहा है...',
    error: 'कुछ गड़बड़ हो गई',
    retry: 'फिर से कोशिश करें',
    timeLimitReached: 'आज का समय खत्म! कल फिर आना!',
  },
};
