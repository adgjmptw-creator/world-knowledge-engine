/**
 * Korean UI translations
 */
export default {
  app: {
    title: '세계 지식 엔진',
    subtitle: '국기 퀴즈 모험!',
  },
  home: {
    startQuiz: '퀴즈 시작!',
    explorationMap: '탐험 지도',
    encyclopedia: '백과사전',
    parentDashboard: '보호자 전용',
    specialChallenge: '특별 도전!',
    countriesMastered: '{{count}}개 나라 마스터',
    progress: '진행 상황',
  },
  quiz: {
    question: '이 국기는 어느 나라의 국기일까요?',
    questionNumber: '{{current}}번 문제',
    tapToSelect: '정답 국기를 터치하세요!',
  },
  result: {
    correct: [
      '대단해요!', '환상적이에요!', '정답이에요!', '훌륭해요!',
      '최고예요!', '멋져요!', '잘했어요!', '완벽해요!',
      '굉장해요!', '아주 잘했어요!',
    ],
    incorrect: [
      '아깝다!', '거의 맞았어요!', '잘 시도했어요!', '좋은 노력이에요!',
      '계속 도전해요!', '포기하지 마세요!', '할 수 있어요!', '거의 다 왔어요!',
    ],
    correctFlag: '이것은 {{country}}의 국기예요',
    hint: '힌트: {{hint}}',
    funFact: '재미있는 사실',
    nextQuestion: '다음!',
    quit: '그만하기',
    listenAgain: '다시 듣기',
  },
  map: {
    title: '탐험 지도',
    countriesDiscovered: '{{count}} / {{total}} 발견',
    locked: '계속 플레이해서 발견하세요!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: '백과사전',
    searchPlaceholder: '나라 검색...',
    allCountries: '모든 나라',
    notYetDiscovered: '아직 발견하지 못했어요',
  },
  parent: {
    authTitle: '보호자 인증',
    authQuestion: '{{a}} × {{b}}는 얼마인가요?',
    authPlaceholder: '답을 입력하세요',
    authSubmit: '확인',
    authError: '틀렸습니다. 다시 시도해 주세요.',
    dashboardTitle: '보호자 대시보드',
    masteredCountries: '마스터한 나라',
    weakCountries: '연습 필요',
    playTimeLimit: '일일 플레이 시간 제한',
    playTimeUnlimited: '무제한',
    playTimeCurrent: '오늘: {{minutes}}분',
    minutes: '{{count}}분',
    back: '뒤로',
    totalAnswered: '총 답변 수',
    accuracy: '정확도',
  },
  special: {
    title: '특별 도전!',
    description: '재미있는 사실로 어느 나라인지 맞춰보세요!',
    whichCountry: '어느 나라일까요?',
    completed: '도전 완료!',
  },
  common: {
    loading: '로딩 중...',
    error: '문제가 발생했어요',
    retry: '다시 시도',
    timeLimitReached: '오늘은 여기까지! 내일 다시 만나요!',
  },
};
