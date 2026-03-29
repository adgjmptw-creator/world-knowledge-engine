/**
 * Indonesian UI translations
 */
export default {
  app: {
    title: 'Mesin Pengetahuan Dunia',
    subtitle: 'Petualangan Kuis Bendera!',
  },
  home: {
    startQuiz: 'Mulai Kuis!',
    explorationMap: 'Peta Penjelajahan',
    encyclopedia: 'Ensiklopedia',
    parentDashboard: 'Untuk Orang Tua',
    specialChallenge: 'Tantangan Spesial!',
    countriesMastered: '{{count}} negara dikuasai',
    progress: 'Kemajuan',
  },
  quiz: {
    question: 'Bendera ini milik negara mana?',
    questionNumber: 'Pertanyaan {{current}}',
    tapToSelect: 'Ketuk bendera yang benar!',
  },
  result: {
    correct: [
      'Luar biasa!', 'Fantastis!', 'Benar!', 'Cemerlang!',
      'Super!', 'Hebat sekali!', 'Bagus!', 'Sempurna!',
      'Keren!', 'Mantap!',
    ],
    incorrect: [
      'Hampir!', 'Sangat dekat!', 'Coba lagi ya!', 'Usaha yang bagus!',
      'Terus mencoba!', 'Jangan menyerah!', 'Kamu pasti bisa!', 'Sedikit lagi!',
    ],
    correctFlag: 'Ini adalah bendera {{country}}',
    hint: 'Petunjuk: {{hint}}',
    funFact: 'Fakta Menarik',
    nextQuestion: 'Lanjut!',
    quit: 'Keluar',
    listenAgain: 'Dengar lagi',
  },
  map: {
    title: 'Peta Penjelajahan',
    countriesDiscovered: '{{count}} / {{total}} ditemukan',
    locked: 'Terus bermain untuk menemukan!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Ensiklopedia',
    searchPlaceholder: 'Cari negara...',
    allCountries: 'Semua Negara',
    notYetDiscovered: 'Belum ditemukan',
  },
  parent: {
    authTitle: 'Verifikasi Orang Tua',
    authQuestion: 'Berapa {{a}} × {{b}}?',
    authPlaceholder: 'Masukkan jawaban',
    authSubmit: 'Kirim',
    authError: 'Salah. Silakan coba lagi.',
    dashboardTitle: 'Dasbor Orang Tua',
    masteredCountries: 'Dikuasai',
    weakCountries: 'Perlu Latihan',
    playTimeLimit: 'Batas Waktu Bermain Harian',
    playTimeUnlimited: 'Tidak terbatas',
    playTimeCurrent: 'Hari ini: {{minutes}} menit',
    minutes: '{{count}} menit',
    back: 'Kembali',
    totalAnswered: 'Total Dijawab',
    accuracy: 'Akurasi',
  },
  special: {
    title: 'Tantangan Spesial!',
    description: 'Bisakah kamu menebak negara dari fakta menarik ini?',
    whichCountry: 'Negara apa ini?',
    completed: 'Tantangan Selesai!',
  },
  common: {
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    retry: 'Coba lagi',
    timeLimitReached: 'Waktu hari ini sudah habis! Kembali besok ya!',
  },
};
