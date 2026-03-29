/**
 * World Knowledge Engine — 型定義
 *
 * アプリ全体で使用するTypeScript型を一元管理する。
 * 国データ・クイズロジック・ユーザー進捗など、主要なデータ構造を定義。
 */

// ============================================================
// 対応言語コード（13言語 + 中国語の簡体字/繁体字を区別）
// ============================================================
export type LanguageCode =
  | 'en'    // 英語
  | 'zh-CN' // 中国語（簡体字）
  | 'zh-TW' // 中国語（繁体字）
  | 'hi'    // ヒンディー語
  | 'es'    // スペイン語
  | 'pt-BR' // ポルトガル語（ブラジル）
  | 'id'    // インドネシア語
  | 'ja'    // 日本語
  | 'ar'    // アラビア語
  | 'fr'    // フランス語
  | 'de'    // ドイツ語
  | 'ko'    // 韓国語
  | 'tr'    // トルコ語
  | 'ru';   // ロシア語

// ============================================================
// 国データ構造
// ============================================================

/** 各言語での国名を格納するマップ */
export type LocalizedName = {
  [key in LanguageCode]: string;
};

/** 各言語での豆知識テキスト（最大2件）を格納 */
export type LocalizedFunFacts = {
  [key in LanguageCode]: string[];
};

/** 国旗のSVGデータへの参照方式 */
export type FlagSource = {
  /** ISO 3166-1 alpha-2コードを使ったSVGファイルパス（例: "jp.svg"） */
  svgFile: string;
  /** 代替として使用するemoji国旗（例: "🇯🇵"） */
  emoji: string;
};

/**
 * 国データの完全な構造
 * 国連加盟国193カ国すべてのデータを保持する
 */
export interface CountryData {
  /** ISO 3166-1 alpha-2コード（例: "JP"） */
  id: string;
  /** 英語の正式国名 */
  nameEn: string;
  /** 各言語での国名（ルビ情報は日本語のみ別途保持） */
  localizedNames: LocalizedName;
  /** 日本語でのふりがな（ひらがな表記、例: "にほん"） */
  furigana: string;
  /** 国旗リソース */
  flag: FlagSource;
  /** 地域分類（探検マップ画面で使用） */
  region: WorldRegion;
  /** 国際プレゼンスのスコア（大きいほど高い、出題順の基準） */
  presenceScore: number;
  /** 各言語での豆知識（最大2件ずつ） */
  funFacts: LocalizedFunFacts;
  /** 首都の英語名 */
  capitalEn: string;
  /** 各言語での首都名 */
  capitalLocalized: LocalizedName;
}

/**
 * 世界の地域分類
 * 探検マップ画面での地域別表示に使用
 */
export type WorldRegion =
  | 'east_asia'       // 東アジア
  | 'southeast_asia'  // 東南アジア
  | 'south_asia'      // 南アジア
  | 'central_asia'    // 中央アジア
  | 'west_asia'       // 西アジア
  | 'europe'          // ヨーロッパ
  | 'north_africa'    // 北アフリカ
  | 'sub_saharan_africa' // サブサハラアフリカ
  | 'north_america'   // 北アメリカ
  | 'central_america' // 中央アメリカ
  | 'south_america'   // 南アメリカ
  | 'oceania';        // オセアニア

// ============================================================
// クイズ関連の型
// ============================================================

/**
 * クイズの1問分のデータ構造
 */
export interface QuizQuestion {
  /** 正解の国 */
  correctCountry: CountryData;
  /** 選択肢の国リスト（正解1 + 不正解3、シャッフル済み） */
  choices: CountryData[];
}

/**
 * クイズ回答の結果
 */
export interface QuizAnswer {
  /** 出題された国のID */
  countryId: string;
  /** ユーザーが選んだ国のID */
  selectedCountryId: string;
  /** 正解かどうか */
  isCorrect: boolean;
  /** 回答にかかった時間（ミリ秒）— Brainscape自信度の判定に使用 */
  responseTimeMs: number;
  /** 回答日時 */
  answeredAt: number;
}

// ============================================================
// 間隔反復（Spaced Repetition）関連
// ============================================================

/**
 * 自信度レベル（1〜5）
 * 回答時間から自動算出する（ユーザー申告ではない）
 *
 * 1: 非常に低い（10秒以上 or 不正解）
 * 2: 低い（7〜10秒）
 * 3: 普通（4〜7秒）
 * 4: 高い（2〜4秒）
 * 5: 非常に高い（2秒未満で正解）
 */
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 各国の学習状態を記録する構造
 * Brainscape方式の間隔反復で使用
 */
export interface CountryLearningState {
  /** 国のID */
  countryId: string;
  /** 現在の自信度レベル */
  confidenceLevel: ConfidenceLevel;
  /** 次回の復習予定時刻（Unix timestamp ms） */
  nextReviewAt: number;
  /** 現在の復習間隔（ミリ秒） */
  intervalMs: number;
  /** 正解回数の累計 */
  correctCount: number;
  /** 不正解回数の累計 */
  incorrectCount: number;
  /** 直近の回答時間（ミリ秒）リスト（最大5件） */
  recentResponseTimes: number[];
  /** 最後に出題された日時 */
  lastSeenAt: number;
  /** この国が「マスター済み」かどうか（自信度5が3回連続） */
  isMastered: boolean;
  /** スペシャルチャレンジで正解したかどうか */
  specialChallengeCleared: boolean;
}

// ============================================================
// ユーザー進捗データ
// ============================================================

/**
 * ユーザーの全体的な進捗データ
 * AsyncStorageに保存される
 */
export interface UserProgress {
  /** 各国の学習状態マップ（キーは国ID） */
  countryStates: Record<string, CountryLearningState>;
  /** 現在アンロック済みの国数（適応的難易度に応じて増加） */
  unlockedCountryCount: number;
  /** 直近の回答履歴（適応的難易度調整用、最大20件） */
  recentAnswers: QuizAnswer[];
  /** 全体の正答率（適応的難易度の85%ルール監視用） */
  overallAccuracy: number;
  /** 総出題数 */
  totalQuestionsAnswered: number;
  /** 全国旗コンプリート済みかどうか */
  allFlagsCompleted: boolean;
  /** 今日のプレイ時間（ミリ秒） */
  todayPlayTimeMs: number;
  /** 今日の日付（YYYY-MM-DD、日付が変わったらリセット） */
  todayDate: string;
  /** スペシャルチャレンジの進捗 */
  specialChallengeProgress: {
    /** クリアした国数 */
    clearedCount: number;
    /** 全クリアしたかどうか */
    allCleared: boolean;
  };
}

// ============================================================
// 保護者ダッシュボード関連
// ============================================================

/**
 * 保護者設定データ
 */
export interface ParentalSettings {
  /** 1日のプレイ時間制限（分）。0は無制限 */
  dailyTimeLimitMinutes: number;
}

// ============================================================
// アニメーション・フィードバック関連
// ============================================================

/**
 * 正解時のフィードバックパターン
 * 毎回異なるメッセージとアニメーションを表示するために使用
 */
export interface FeedbackPattern {
  /** フィードバックメッセージ（各言語） */
  message: LocalizedName;
  /** アニメーションの種類 */
  animationType: 'confetti' | 'stars' | 'bounce' | 'fireworks' | 'sparkle' | 'rainbow';
}

/**
 * 不正解時のフィードバックパターン
 * モチベーションを維持するための励ましメッセージ
 */
export interface IncorrectFeedbackPattern {
  /** 励ましメッセージ（各言語） */
  message: LocalizedName;
  /** アニメーションの種類 */
  animationType: 'gentle_shake' | 'soft_glow' | 'encouraging_wave' | 'try_again_bounce';
}

// ============================================================
// ナビゲーション関連
// ============================================================

/**
 * ルートナビゲーションのパラメータ型
 */
export type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Result: {
    question: QuizQuestion;
    answer: QuizAnswer;
  };
  ExplorationMap: undefined;
  Encyclopedia: undefined;
  ParentalAuth: undefined;
  ParentalDashboard: undefined;
  SpecialChallenge: undefined;
  SpecialChallengeResult: {
    question: QuizQuestion;
    answer: QuizAnswer;
    funFactUsed: string;
  };
};
