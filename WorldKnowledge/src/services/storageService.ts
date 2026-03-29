/**
 * World Knowledge Engine — ストレージサービス
 *
 * AsyncStorageを使用してユーザーの学習進捗と設定をローカルに保存する。
 * オフライン対応のため、すべてのデータはデバイス上にのみ保存される。
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, ParentalSettings, CountryLearningState } from '../types';

// ストレージキーの定数
const STORAGE_KEYS = {
  /** ユーザーの学習進捗データ */
  USER_PROGRESS: '@wke_user_progress',
  /** 保護者設定 */
  PARENTAL_SETTINGS: '@wke_parental_settings',
} as const;

/**
 * デフォルトのユーザー進捗データ
 * 初回起動時に使用される
 */
const DEFAULT_USER_PROGRESS: UserProgress = {
  countryStates: {},
  unlockedCountryCount: 10, // 最初は上位10カ国からスタート
  recentAnswers: [],
  overallAccuracy: 0,
  totalQuestionsAnswered: 0,
  allFlagsCompleted: false,
  todayPlayTimeMs: 0,
  todayDate: new Date().toISOString().split('T')[0],
  specialChallengeProgress: {
    clearedCount: 0,
    allCleared: false,
  },
};

/**
 * デフォルトの保護者設定
 */
const DEFAULT_PARENTAL_SETTINGS: ParentalSettings = {
  dailyTimeLimitMinutes: 0, // 0 = 無制限
};

// ============================================================
// ユーザー進捗の読み書き
// ============================================================

/**
 * ユーザー進捗データを読み込む
 * データが存在しない場合はデフォルト値を返す
 */
export async function loadUserProgress(): Promise<UserProgress> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (json) {
      const progress: UserProgress = JSON.parse(json);
      // 日付が変わっていたらプレイ時間をリセット
      const today = new Date().toISOString().split('T')[0];
      if (progress.todayDate !== today) {
        progress.todayPlayTimeMs = 0;
        progress.todayDate = today;
      }
      return progress;
    }
    return { ...DEFAULT_USER_PROGRESS };
  } catch (error) {
    console.error('Failed to load user progress:', error);
    return { ...DEFAULT_USER_PROGRESS };
  }
}

/**
 * ユーザー進捗データを保存する
 */
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROGRESS,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
}

/**
 * 特定の国の学習状態を更新する
 * 既存のデータとマージして保存する
 */
export async function updateCountryState(
  countryId: string,
  update: Partial<CountryLearningState>
): Promise<UserProgress> {
  const progress = await loadUserProgress();
  const existing = progress.countryStates[countryId] || createDefaultCountryState(countryId);
  progress.countryStates[countryId] = { ...existing, ...update };
  await saveUserProgress(progress);
  return progress;
}

/**
 * 国の学習状態のデフォルト値を作成する
 * まだ出題されていない国に対して使用
 */
export function createDefaultCountryState(countryId: string): CountryLearningState {
  return {
    countryId,
    confidenceLevel: 1,
    nextReviewAt: 0, // すぐに出題可能
    intervalMs: 0,
    correctCount: 0,
    incorrectCount: 0,
    recentResponseTimes: [],
    lastSeenAt: 0,
    isMastered: false,
    specialChallengeCleared: false,
  };
}

// ============================================================
// 保護者設定の読み書き
// ============================================================

/**
 * 保護者設定を読み込む
 */
export async function loadParentalSettings(): Promise<ParentalSettings> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.PARENTAL_SETTINGS);
    if (json) {
      return JSON.parse(json);
    }
    return { ...DEFAULT_PARENTAL_SETTINGS };
  } catch (error) {
    console.error('Failed to load parental settings:', error);
    return { ...DEFAULT_PARENTAL_SETTINGS };
  }
}

/**
 * 保護者設定を保存する
 */
export async function saveParentalSettings(settings: ParentalSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PARENTAL_SETTINGS,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Failed to save parental settings:', error);
  }
}

// ============================================================
// プレイ時間管理
// ============================================================

/**
 * プレイ時間を加算して保存する
 * @param elapsedMs 経過時間（ミリ秒）
 * @returns 更新後のプレイ時間（ミリ秒）
 */
export async function addPlayTime(elapsedMs: number): Promise<number> {
  const progress = await loadUserProgress();
  // 日付が変わっていればリセット
  const today = new Date().toISOString().split('T')[0];
  if (progress.todayDate !== today) {
    progress.todayPlayTimeMs = 0;
    progress.todayDate = today;
  }
  progress.todayPlayTimeMs += elapsedMs;
  await saveUserProgress(progress);
  return progress.todayPlayTimeMs;
}

/**
 * プレイ時間制限に達しているかチェックする
 * @returns true なら制限に達している
 */
export async function isPlayTimeLimitReached(): Promise<boolean> {
  const [progress, settings] = await Promise.all([
    loadUserProgress(),
    loadParentalSettings(),
  ]);
  // 0 = 無制限
  if (settings.dailyTimeLimitMinutes === 0) return false;
  const limitMs = settings.dailyTimeLimitMinutes * 60 * 1000;
  return progress.todayPlayTimeMs >= limitMs;
}

// ============================================================
// データリセット（デバッグ用）
// ============================================================

/**
 * すべてのユーザーデータをリセットする（デバッグ・テスト用）
 */
export async function resetAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROGRESS,
      STORAGE_KEYS.PARENTAL_SETTINGS,
    ]);
  } catch (error) {
    console.error('Failed to reset data:', error);
  }
}
