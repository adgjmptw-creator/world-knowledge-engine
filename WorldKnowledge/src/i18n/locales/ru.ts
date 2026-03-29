/**
 * Russian UI translations
 */
export default {
  app: {
    title: 'Мировой Двигатель Знаний',
    subtitle: 'Приключение с флагами!',
  },
  home: {
    startQuiz: 'Начать викторину!',
    explorationMap: 'Карта исследований',
    encyclopedia: 'Энциклопедия',
    parentDashboard: 'Для родителей',
    specialChallenge: 'Особый вызов!',
    countriesMastered: '{{count}} стран изучено',
    progress: 'Прогресс',
  },
  quiz: {
    question: 'Какой стране принадлежит этот флаг?',
    questionNumber: 'Вопрос {{current}}',
    tapToSelect: 'Нажми на правильный флаг!',
  },
  result: {
    correct: [
      'Потрясающе!', 'Фантастика!', 'Правильно!', 'Блестяще!',
      'Супер!', 'Чудесно!', 'Отлично!', 'Идеально!',
      'Здорово!', 'Молодец!',
    ],
    incorrect: [
      'Почти!', 'Так близко!', 'Хорошая попытка!', 'Неплохо!',
      'Продолжай!', 'Не сдавайся!', 'У тебя получится!', 'Ещё чуть-чуть!',
    ],
    correctFlag: 'Это флаг {{country}}',
    hint: 'Подсказка: {{hint}}',
    funFact: 'Интересный факт',
    nextQuestion: 'Дальше!',
    quit: 'Выйти',
    listenAgain: 'Послушать ещё раз',
  },
  map: {
    title: 'Карта исследований',
    countriesDiscovered: '{{count}} / {{total}} открыто',
    locked: 'Продолжай играть, чтобы открывать!',
    regionProgress: '{{count}} / {{total}}',
  },
  encyclopedia: {
    title: 'Энциклопедия',
    searchPlaceholder: 'Поиск страны...',
    allCountries: 'Все страны',
    notYetDiscovered: 'Ещё не открыта',
  },
  parent: {
    authTitle: 'Проверка для родителей',
    authQuestion: 'Сколько будет {{a}} × {{b}}?',
    authPlaceholder: 'Введите ответ',
    authSubmit: 'Отправить',
    authError: 'Неправильно. Попробуйте ещё раз.',
    dashboardTitle: 'Панель родителей',
    masteredCountries: 'Изучено',
    weakCountries: 'Нужна практика',
    playTimeLimit: 'Дневной лимит игры',
    playTimeUnlimited: 'Без ограничений',
    playTimeCurrent: 'Сегодня: {{minutes}} мин',
    minutes: '{{count}} мин',
    back: 'Назад',
    totalAnswered: 'Всего ответов',
    accuracy: 'Точность',
  },
  special: {
    title: 'Особый вызов!',
    description: 'Сможешь угадать страну по интересному факту?',
    whichCountry: 'Какая это страна?',
    completed: 'Вызов пройден!',
  },
  common: {
    loading: 'Загрузка...',
    error: 'Что-то пошло не так',
    retry: 'Попробовать снова',
    timeLimitReached: 'На сегодня время вышло! Возвращайся завтра!',
  },
};
