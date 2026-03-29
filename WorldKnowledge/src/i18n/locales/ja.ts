/**
 * 日本語UIテキスト
 * 小学校で習う漢字は漢字表記、ルビを括弧で付与
 * RubyTextコンポーネントが 漢字(かな) をパースして上部ルビ表示する
 */
export default {
  app: {
    title: '世界(せかい)の知識(ちしき)エンジン',
    subtitle: '国旗(こっき)クイズアドベンチャー！',
  },
  home: {
    startQuiz: 'クイズをはじめる！',
    explorationMap: '探検(たんけん)マップ',
    encyclopedia: '図鑑(ずかん)',
    parentDashboard: 'おうちの人(ひと)へ',
    specialChallenge: 'スペシャルチャレンジ！',
    countriesMastered: '{{count}}の国(くに)をマスター',
    progress: '進(すす)み具合(ぐあい)',
  },
  quiz: {
    question: 'この国(くに)の国旗(こっき)はどれ？',
    questionNumber: '問題(もんだい) {{current}}',
    tapToSelect: '正(ただ)しい国旗(こっき)をタップしよう！',
  },
  result: {
    correct: [
      'すごい！', 'やったね！', '正解(せいかい)！', 'すばらしい！',
      'さすが！', 'ばっちり！', 'グレート！', 'パーフェクト！',
      '完璧(かんぺき)！', 'よくできました！',
    ],
    incorrect: [
      'おしい！', 'もう少(すこ)し！', 'いい線(せん)いってるよ！', 'がんばったね！',
      '次(つぎ)はできるよ！', 'あきらめないで！', 'もう一度(いちど)チャレンジ！', 'ドンマイ！',
    ],
    correctFlag: 'これは{{country}}の国旗(こっき)だよ',
    hint: 'ヒント：{{hint}}',
    funFact: '豆知識(まめちしき)',
    nextQuestion: '次(つぎ)へ進(すす)む！',
    quit: 'やめる',
    listenAgain: 'もう一度(いちど)聞(き)く',
  },
  map: {
    title: '探検(たんけん)マップ',
    countriesDiscovered: '{{count}} / {{total}} 発見(はっけん)',
    locked: 'クイズを続(つづ)けて発見(はっけん)しよう！',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: '図鑑(ずかん)',
    searchPlaceholder: '国(くに)をさがす...',
    allCountries: 'すべての国(くに)',
    notYetDiscovered: 'まだ発見(はっけん)していないよ',
  },
  parent: {
    authTitle: '保護者(ほごしゃ)認証(にんしょう)',
    authQuestion: '{{a}} × {{b}} は？',
    authPlaceholder: '答(こた)えを入(い)れてね',
    authSubmit: '確認(かくにん)',
    authError: 'ちがうよ。もう一度(いちど)ためしてね。',
    dashboardTitle: '保護者(ほごしゃ)ダッシュボード',
    masteredCountries: 'マスターした国(くに)',
    weakCountries: 'ニガテな国(くに)',
    playTimeLimit: '1日(にち)のプレイ時間(じかん)',
    playTimeUnlimited: '無制限(むせいげん)',
    playTimeCurrent: '今日(きょう)：{{minutes}}分(ふん)',
    minutes: '{{count}}分(ふん)',
    back: '戻(もど)る',
    totalAnswered: '全(ぜん)回答数(かいとうすう)',
    accuracy: '正解率(せいかいりつ)',
    resetData: '学習(がくしゅう)データをリセット',
    resetConfirmTitle: '本当(ほんとう)にリセットしますか？',
    resetConfirmMessage: 'すべての学習(がくしゅう)データが消(き)えます。元(もと)に戻(もど)せません。',
    resetAuthQuestion: '確認(かくにん)のため、{{a}} × {{b}} は？',
    resetComplete: 'リセットしました',
  },
  special: {
    title: 'スペシャルチャレンジ！',
    description: '豆知識(まめちしき)から国(くに)を当(あ)てよう！',
    whichCountry: 'この国(くに)はどこだ？',
    completed: 'チャレンジ完了(かんりょう)！',
  },
  common: {
    loading: '読(よ)み込(こ)み中(ちゅう)...',
    error: 'エラーがおきました',
    retry: 'もう一度(いちど)',
    timeLimitReached: '今日(きょう)はここまで！明日(あした)またあそぼうね！',
  },
};
