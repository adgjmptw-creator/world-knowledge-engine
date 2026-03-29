/**
 * Chinese Traditional UI translations
 */
export default {
  app: {
    title: '世界知識引擎',
    subtitle: '國旗猜猜樂！',
  },
  home: {
    startQuiz: '開始答題！',
    explorationMap: '探索地圖',
    encyclopedia: '百科全書',
    parentDashboard: '家長專區',
    specialChallenge: '特別挑戰！',
    countriesMastered: '已掌握 {{count}} 個國家',
    progress: '學習進度',
  },
  quiz: {
    question: '這面國旗屬於哪個國家？',
    questionNumber: '第 {{current}} 題',
    tapToSelect: '點選正確的國旗！',
  },
  result: {
    correct: [
      '太棒了！', '真厲害！', '答對了！', '好聰明！',
      '超級棒！', '太了不起了！', '做得好！', '完美！',
      '你真行！', '非常出色！',
    ],
    incorrect: [
      '差一點！', '好接近了！', '不錯的嘗試！', '加油喔！',
      '繼續努力！', '別放棄！', '你可以的！', '馬上就對了！',
    ],
    correctFlag: '這是 {{country}} 的國旗',
    hint: '提示：{{hint}}',
    funFact: '趣味小知識',
    nextQuestion: '下一題！',
    quit: '退出',
    listenAgain: '再聽一次',
  },
  map: {
    title: '探索地圖',
    countriesDiscovered: '已發現 {{count}} / {{total}}',
    locked: '繼續玩就能發現更多！',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: '百科全書',
    searchPlaceholder: '搜尋國家...',
    allCountries: '所有國家',
    notYetDiscovered: '尚未發現',
  },
  parent: {
    authTitle: '家長驗證',
    authQuestion: '{{a}} × {{b}} 等於多少？',
    authPlaceholder: '輸入答案',
    authSubmit: '送出',
    authError: '回答錯誤，請重試。',
    dashboardTitle: '家長面板',
    masteredCountries: '已掌握',
    weakCountries: '需要練習',
    playTimeLimit: '每日遊戲時間限制',
    playTimeUnlimited: '無限制',
    playTimeCurrent: '今天：{{minutes}} 分鐘',
    minutes: '{{count}} 分鐘',
    back: '返回',
    totalAnswered: '總答題數',
    accuracy: '正確率',
  },
  special: {
    title: '特別挑戰！',
    description: '你能根據趣味知識猜出是哪個國家嗎？',
    whichCountry: '這是哪個國家？',
    completed: '挑戰完成！',
  },
  common: {
    loading: '載入中...',
    error: '發生了一些問題',
    retry: '重試',
    timeLimitReached: '今天的時間到了！明天再來吧！',
  },
};
