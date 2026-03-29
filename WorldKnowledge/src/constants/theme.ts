/**
 * World Knowledge Engine — テーマ定数
 *
 * アプリ全体で一貫したデザインを保つための色・サイズ・フォント定義。
 * 5歳児が魅力的に感じる明るく温かい配色を採用。
 * 子供向け教育アプリ（Khan Academy Kids, Duolingo ABCなど）を参考にしている。
 */

/** メインカラーパレット */
export const Colors = {
  // === プライマリカラー ===
  /** メインの青（信頼感・知性を表現） */
  primary: '#4A90D9',
  /** 明るい青（ホバー・アクティブ状態） */
  primaryLight: '#7DB4E8',
  /** 暗い青（テキスト・強調） */
  primaryDark: '#2B6CB0',

  // === アクセントカラー ===
  /** オレンジ（楽しさ・エネルギー） */
  accent: '#FF8C42',
  /** 明るいオレンジ */
  accentLight: '#FFB07A',
  /** 黄色（ポジティブ・注目） */
  yellow: '#FFD93D',
  /** ピンク（かわいさ・楽しさ） */
  pink: '#FF6B9D',
  /** 緑（正解・成功・進捗） */
  green: '#4CAF50',
  /** 明るい緑 */
  greenLight: '#81C784',
  /** 赤（注意・不正解） — 柔らかい赤を使用 */
  red: '#EF7B7B',
  /** 紫（スペシャル・レア） */
  purple: '#9B59B6',

  // === 背景色 ===
  /** メイン背景（温かみのあるオフホワイト） */
  background: '#FFF8F0',
  /** カード背景 */
  cardBackground: '#FFFFFF',
  /** セカンダリ背景（少し暗い） */
  backgroundSecondary: '#F0E6D8',

  // === テキスト色 ===
  /** メインテキスト */
  textPrimary: '#2D3436',
  /** サブテキスト */
  textSecondary: '#636E72',
  /** 明るいテキスト（暗い背景上） */
  textLight: '#FFFFFF',
  /** リンク・アクションテキスト */
  textAction: '#4A90D9',

  // === その他 ===
  /** ボーダー・区切り線 */
  border: '#E0D6CC',
  /** 無効状態 */
  disabled: '#B2BEC3',
  /** オーバーレイ */
  overlay: 'rgba(0, 0, 0, 0.4)',
  /** シャドウ */
  shadow: 'rgba(0, 0, 0, 0.1)',
} as const;

/** フォントサイズ（5歳児が読みやすい大きめサイズ） */
export const FontSizes = {
  /** 特大見出し（トップ画面タイトルなど） */
  hero: 32,
  /** 大見出し */
  title: 26,
  /** 中見出し */
  subtitle: 22,
  /** 本文（通常テキスト） */
  body: 18,
  /** 小さいテキスト（補足情報） */
  small: 14,
  /** 極小テキスト（著作権表記など） */
  tiny: 11,
  /** クイズ選択肢テキスト */
  quizOption: 16,
  /** 豆知識テキスト */
  funFact: 16,
  /** ボタンテキスト */
  button: 20,
} as const;

/** スペーシング（余白） */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** 角丸の半径 */
export const BorderRadius = {
  /** 小さい角丸（ボタン等） */
  sm: 8,
  /** 中くらいの角丸（カード等） */
  md: 16,
  /** 大きい角丸（モーダル等） */
  lg: 24,
  /** 完全な円 */
  full: 9999,
} as const;

/** 影のスタイル（プラットフォーム共通） */
export const Shadows = {
  /** 軽い影（カード等） */
  light: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  /** 中程度の影（フローティングボタン等） */
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
} as const;

/** アニメーション時間（ミリ秒） */
export const AnimationDuration = {
  /** 非常に速い（ボタンタップ反応等） */
  fast: 150,
  /** 通常（画面遷移等） */
  normal: 300,
  /** ゆっくり（結果表示等） */
  slow: 500,
  /** 非常にゆっくり（大げさなアニメーション） */
  verySlow: 1000,
  /** TTS自動再生までの遅延 */
  ttsDelay: 300,
} as const;

/** 国旗画像のサイズ */
export const FlagSize = {
  /** クイズ選択肢での国旗サイズ */
  quiz: { width: 120, height: 80 },
  /** 結果カードでの国旗サイズ */
  result: { width: 160, height: 107 },
  /** 図鑑一覧での国旗サイズ */
  encyclopedia: { width: 60, height: 40 },
  /** 探検マップでの国旗サイズ */
  map: { width: 40, height: 27 },
} as const;
