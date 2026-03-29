/**
 * 日本語UIテキスト
 * ひらがな中心、漢字にはふりがな（括弧表記）を付与
 */
export default {
  app: {
    title: 'せかいのちしきエンジン',
    subtitle: 'こっきクイズアドベンチャー！',
  },
  home: {
    startQuiz: 'クイズをはじめる！',
    explorationMap: 'たんけんマップ',
    encyclopedia: 'ずかん',
    parentDashboard: 'おうちのひとへ',
    specialChallenge: 'スペシャルチャレンジ！',
    countriesMastered: '{{count}}のくにをマスター',
    progress: 'しんちょく',
  },
  quiz: {
    question: 'このくにのこっきはどれ？',
    questionNumber: 'もんだい {{current}}',
    tapToSelect: 'ただしいこっきをタップしよう！',
  },
  result: {
    correct: [
      'すごい！', 'やったね！', 'せいかい！', 'すばらしい！',
      'さすが！', 'ばっちり！', 'グレート！', 'パーフェクト！',
      'かんぺき！', 'よくできました！',
    ],
    incorrect: [
      'おしい！', 'もうすこし！', 'いいせんいってるよ！', 'がんばったね！',
      'つぎはできるよ！', 'あきらめないで！', 'もういちどチャレンジ！', 'ドンマイ！',
    ],
    correctFlag: 'これは{{country}}のこっきだよ',
    hint: 'ヒント：{{hint}}',
    funFact: 'まめちしき',
    nextQuestion: 'つぎへすすむ！',
    quit: 'やめる',
    listenAgain: 'もういちどきく',
  },
  map: {
    title: 'たんけんマップ',
    countriesDiscovered: '{{count}} / {{total}} はっけん',
    locked: 'クイズをつづけてはっけんしよう！',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'ずかん',
    searchPlaceholder: 'くにをさがす...',
    allCountries: 'すべてのくに',
    notYetDiscovered: 'まだはっけんしていないよ',
  },
  parent: {
    authTitle: 'ほごしゃにんしょう',
    authQuestion: '{{a}} × {{b}} は？',
    authPlaceholder: 'こたえをいれてね',
    authSubmit: 'かくにん',
    authError: 'ちがうよ。もういちどためしてね。',
    dashboardTitle: 'ほごしゃダッシュボード',
    masteredCountries: 'マスターしたくに',
    weakCountries: 'ニガテなくに',
    playTimeLimit: 'いちにちのプレイじかん',
    playTimeUnlimited: 'むせいげん',
    playTimeCurrent: 'きょう：{{minutes}}ふん',
    minutes: '{{count}}ふん',
    back: 'もどる',
    totalAnswered: 'ぜんぶのこたえ',
    accuracy: 'せいかいりつ',
  },
  special: {
    title: 'スペシャルチャレンジ！',
    description: 'まめちしきからくにをあてよう！',
    whichCountry: 'このくにはどこだ？',
    completed: 'チャレンジかんりょう！',
  },
  common: {
    loading: 'よみこみちゅう...',
    error: 'エラーがおきました',
    retry: 'もういちど',
    timeLimitReached: 'きょうはここまで！あしたまたあそぼうね！',
  },
};
