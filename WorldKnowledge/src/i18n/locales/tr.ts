/**
 * Turkish UI translations
 */
export default {
  app: {
    title: 'Dünya Bilgi Motoru',
    subtitle: 'Bayrak Bilgi Yarışması!',
  },
  home: {
    startQuiz: 'Teste Başla!',
    explorationMap: 'Keşif Haritası',
    encyclopedia: 'Ansiklopedi',
    parentDashboard: 'Ebeveyn Alanı',
    specialChallenge: 'Özel Meydan Okuma!',
    countriesMastered: '{{count}} ülke öğrenildi',
    progress: 'İlerleme',
  },
  quiz: {
    question: 'Bu bayrak hangi ülkeye ait?',
    questionNumber: 'Soru {{current}}',
    tapToSelect: 'Doğru bayrağa dokun!',
  },
  result: {
    correct: [
      'İnanılmaz!', 'Harika!', 'Doğru bildin!', 'Mükemmel!',
      'Süper!', 'Muhteşem!', 'Çok iyi!', 'Kusursuz!',
      'Bravo!', 'Aferin!',
    ],
    incorrect: [
      'Neredeyse!', 'Çok yaklaştın!', 'İyi deneme!', 'Güzel çaba!',
      'Denemeye devam!', 'Vazgeçme!', 'Yapabilirsin!', 'Az kaldı!',
    ],
    correctFlag: 'Bu {{country}} bayrağı',
    hint: 'İpucu: {{hint}}',
    funFact: 'İlginç Bilgi',
    nextQuestion: 'Sonraki!',
    quit: 'Çık',
    listenAgain: 'Tekrar dinle',
  },
  map: {
    title: 'Keşif Haritası',
    countriesDiscovered: '{{count}} / {{total}} keşfedildi',
    locked: 'Keşfetmek için oynamaya devam et!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Ansiklopedi',
    searchPlaceholder: 'Ülke ara...',
    allCountries: 'Tüm Ülkeler',
    notYetDiscovered: 'Henüz keşfedilmedi',
  },
  parent: {
    authTitle: 'Ebeveyn Doğrulama',
    authQuestion: '{{a}} × {{b}} kaç eder?',
    authPlaceholder: 'Cevabı girin',
    authSubmit: 'Gönder',
    authError: 'Yanlış. Lütfen tekrar deneyin.',
    dashboardTitle: 'Ebeveyn Paneli',
    masteredCountries: 'Öğrenilen',
    weakCountries: 'Pratik Gerekli',
    playTimeLimit: 'Günlük Oynama Süresi',
    playTimeUnlimited: 'Sınırsız',
    playTimeCurrent: 'Bugün: {{minutes}} dk',
    minutes: '{{count}} dk',
    back: 'Geri',
    totalAnswered: 'Toplam Cevaplanan',
    accuracy: 'Doğruluk',
  },
  special: {
    title: 'Özel Meydan Okuma!',
    description: 'İlginç bilgiden ülkeyi tahmin edebilir misin?',
    whichCountry: 'Bu hangi ülke?',
    completed: 'Meydan Okuma Tamamlandı!',
  },
  common: {
    loading: 'Yükleniyor...',
    error: 'Bir şeyler ters gitti',
    retry: 'Tekrar dene',
    timeLimitReached: 'Bugünlük süre doldu! Yarın tekrar gel!',
  },
};
