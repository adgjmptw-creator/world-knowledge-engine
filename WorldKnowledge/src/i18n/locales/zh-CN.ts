/**
 * Chinese Simplified UI translations
 */
export default {
  app: {
    title: '世界知识引擎',
    subtitle: '国旗猜猜乐！',
  },
  home: {
    startQuiz: '开始答题！',
    explorationMap: '探索地图',
    encyclopedia: '百科全书',
    parentDashboard: '家长专区',
    specialChallenge: '特别挑战！',
    countriesMastered: '已掌握 {{count}} 个国家',
    progress: '学习进度',
  },
  quiz: {
    question: '这面国旗属于哪个国家？',
    questionNumber: '第 {{current}} 题',
    tapToSelect: '点击正确的国旗！',
  },
  result: {
    correct: [
      '太棒了！', '真厉害！', '答对了！', '好聪明！',
      '超级棒！', '太了不起了！', '做得好！', '完美！',
      '你真行！', '非常出色！',
    ],
    incorrect: [
      '差一点！', '好接近了！', '不错的尝试！', '加油哦！',
      '继续努力！', '别放弃！', '你可以的！', '马上就对了！',
    ],
    correctFlag: '这是 {{country}} 的国旗',
    hint: '提示：{{hint}}',
    funFact: '趣味小知识',
    nextQuestion: '下一题！',
    quit: '退出',
    listenAgain: '再听一次',
  },
  map: {
    title: '探索地图',
    countriesDiscovered: '已发现 {{count}} / {{total}}',
    locked: '继续玩就能发现更多！',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: '百科全书',
    searchPlaceholder: '搜索国家...',
    allCountries: '所有国家',
    notYetDiscovered: '尚未发现',
  },
  parent: {
    authTitle: '家长验证',
    authQuestion: '{{a}} × {{b}} 等于多少？',
    authPlaceholder: '输入答案',
    authSubmit: '提交',
    authError: '回答错误，请重试。',
    dashboardTitle: '家长面板',
    masteredCountries: '已掌握',
    weakCountries: '需要练习',
    playTimeLimit: '每日游戏时间限制',
    playTimeUnlimited: '无限制',
    playTimeCurrent: '今天：{{minutes}} 分钟',
    minutes: '{{count}} 分钟',
    back: '返回',
    totalAnswered: '总答题数',
    accuracy: '正确率',
  },
  special: {
    title: '特别挑战！',
    description: '你能根据趣味知识猜出是哪个国家吗？',
    whichCountry: '这是哪个国家？',
    completed: '挑战完成！',
  },
  common: {
    loading: '加载中...',
    error: '出了点问题',
    retry: '重试',
    timeLimitReached: '今天的时间到了！明天再来吧！',
  },
};
