/**
 * Arabic UI translations
 */
export default {
  app: {
    title: 'محرك المعرفة العالمية',
    subtitle: 'مغامرة أعلام الدول!',
  },
  home: {
    startQuiz: 'ابدأ الاختبار!',
    explorationMap: 'خريطة الاستكشاف',
    encyclopedia: 'الموسوعة',
    parentDashboard: 'للوالدين',
    specialChallenge: 'تحدٍّ خاص!',
    countriesMastered: 'تم إتقان {{count}} دولة',
    progress: 'التقدم',
  },
  quiz: {
    question: 'لأي دولة ينتمي هذا العلم؟',
    questionNumber: 'السؤال {{current}}',
    tapToSelect: 'اضغط على العلم الصحيح!',
  },
  result: {
    correct: [
      'رائع!', 'مذهل!', 'أحسنت!', 'ممتاز!',
      'خارق!', 'عظيم!', 'أداء رائع!', 'مثالي!',
      'بطل!', 'عمل متقن!',
    ],
    incorrect: [
      'تقريباً!', 'قريب جداً!', 'محاولة جيدة!', 'جهد رائع!',
      'استمر بالمحاولة!', 'لا تستسلم!', 'يمكنك فعلها!', 'أوشكت!',
    ],
    correctFlag: 'هذا علم {{country}}',
    hint: 'تلميح: {{hint}}',
    funFact: 'معلومة ممتعة',
    nextQuestion: 'التالي!',
    quit: 'خروج',
    listenAgain: 'استمع مرة أخرى',
  },
  map: {
    title: 'خريطة الاستكشاف',
    countriesDiscovered: '{{count}} / {{total}} تم اكتشافها',
    locked: 'استمر باللعب لتكتشف المزيد!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'الموسوعة',
    searchPlaceholder: 'ابحث عن دولة...',
    allCountries: 'جميع الدول',
    notYetDiscovered: 'لم تُكتشف بعد',
  },
  parent: {
    authTitle: 'تحقق الوالدين',
    authQuestion: 'كم يساوي {{a}} × {{b}}؟',
    authPlaceholder: 'أدخل الإجابة',
    authSubmit: 'إرسال',
    authError: 'إجابة خاطئة. حاول مرة أخرى.',
    dashboardTitle: 'لوحة الوالدين',
    masteredCountries: 'تم إتقانها',
    weakCountries: 'تحتاج تدريب',
    playTimeLimit: 'حد وقت اللعب اليومي',
    playTimeUnlimited: 'غير محدود',
    playTimeCurrent: 'اليوم: {{minutes}} دقيقة',
    minutes: '{{count}} دقيقة',
    back: 'رجوع',
    totalAnswered: 'إجمالي الإجابات',
    accuracy: 'الدقة',
  },
  special: {
    title: 'تحدٍّ خاص!',
    description: 'هل تستطيع تخمين الدولة من المعلومة الممتعة؟',
    whichCountry: 'ما هذه الدولة؟',
    completed: 'تم إكمال التحدي!',
  },
  common: {
    loading: 'جارٍ التحميل...',
    error: 'حدث خطأ ما',
    retry: 'إعادة المحاولة',
    timeLimitReached: 'انتهى وقت اليوم! عُد غداً!',
  },
};
