/**
 * World Knowledge Engine — クイズエンジン
 *
 * 適応的難易度調整（Adaptive Difficulty）と間隔反復（Spaced Repetition）を
 * 組み合わせたクイズ出題アルゴリズム。
 *
 * === 適応的難易度調整 ===
 * Wilson et al.（2019, Nature Communications）の研究に基づき、
 * 正答率が約85%（誤答率15.87%）を維持するよう出題を調整する。
 * - 正答率が85%を超える → 新しい（難しい）国をアンロック
 * - 正答率が85%を下回る → 既知の国を繰り返し出題
 *
 * === 間隔反復（Brainscape方式） ===
 * 自信度（1〜5）に応じて復習間隔を調整する。
 * 自信度はユーザー申告ではなく、回答までの時間で自動判定する。
 * - 自信度1: 30秒後に再出題
 * - 自信度2: 5分後
 * - 自信度3: 30分後
 * - 自信度4: 6時間後
 * - 自信度5: 2日後
 *
 * === 出題順 ===
 * 国際プレゼンスの高い順（presenceScore）で国を出題し、
 * 適応的難易度調整を行いながら出題する国を増やしていく。
 */

import {
  CountryData,
  QuizQuestion,
  QuizAnswer,
  ConfidenceLevel,
  CountryLearningState,
  UserProgress,
} from '../types';
import { createDefaultCountryState } from './storageService';

// ============================================================
// 定数
// ============================================================

/** 目標正答率（85%） */
const TARGET_ACCURACY = 0.85;

/** 正答率の計算に使う直近の回答数 */
const RECENT_ANSWERS_WINDOW = 20;

/** 新しい国をアンロックする正答率の閾値 */
const UNLOCK_THRESHOLD = 0.87;

/** 国数を減らす正答率の閾値（アンロック済みの国が多すぎる場合） */
const STRUGGLE_THRESHOLD = 0.70;

/** 1回にアンロックする国数 */
const UNLOCK_BATCH_SIZE = 2;

/** 最小アンロック国数（ゲーム開始時） */
const MIN_UNLOCKED_COUNTRIES = 5;

/** 自信度別の復習間隔（ミリ秒） */
const CONFIDENCE_INTERVALS: Record<ConfidenceLevel, number> = {
  1: 30 * 1000,         // 30秒
  2: 5 * 60 * 1000,     // 5分
  3: 30 * 60 * 1000,    // 30分
  4: 6 * 60 * 60 * 1000,  // 6時間
  5: 2 * 24 * 60 * 60 * 1000, // 2日
};

/**
 * 回答時間（ミリ秒）から自信度を算出する
 * 不正解の場合は常に自信度1を返す
 *
 * 判定基準:
 * - 2秒未満で正解 → 自信度5（非常に高い）
 * - 2〜4秒で正解 → 自信度4（高い）
 * - 4〜7秒で正解 → 自信度3（普通）
 * - 7〜10秒で正解 → 自信度2（低い）
 * - 10秒以上 or 不正解 → 自信度1（非常に低い）
 */
export function calculateConfidence(
  responseTimeMs: number,
  isCorrect: boolean
): ConfidenceLevel {
  if (!isCorrect) return 1;

  if (responseTimeMs < 2000) return 5;
  if (responseTimeMs < 4000) return 4;
  if (responseTimeMs < 7000) return 3;
  if (responseTimeMs < 10000) return 2;
  return 1;
}

/**
 * 回答結果に基づいて国の学習状態を更新する
 *
 * Brainscape方式:
 * - 自信度が上がれば間隔を長くする
 * - 自信度が下がれば間隔を短くする
 * - 自信度5が3回連続ならマスター済みとする
 */
export function updateLearningState(
  currentState: CountryLearningState,
  answer: QuizAnswer
): CountryLearningState {
  const confidence = calculateConfidence(answer.responseTimeMs, answer.isCorrect);
  const now = Date.now();

  // 直近の回答時間リスト（最大5件）を更新
  const recentTimes = [
    answer.responseTimeMs,
    ...currentState.recentResponseTimes,
  ].slice(0, 5);

  // 次回の復習間隔を計算
  const intervalMs = CONFIDENCE_INTERVALS[confidence];
  const nextReviewAt = now + intervalMs;

  // マスター判定: 自信度5が3回連続
  const isMastered = confidence === 5 &&
    currentState.confidenceLevel === 5 &&
    currentState.correctCount >= 2 &&
    answer.isCorrect;

  return {
    ...currentState,
    confidenceLevel: confidence,
    nextReviewAt,
    intervalMs,
    correctCount: answer.isCorrect
      ? currentState.correctCount + 1
      : currentState.correctCount,
    incorrectCount: !answer.isCorrect
      ? currentState.incorrectCount + 1
      : currentState.incorrectCount,
    recentResponseTimes: recentTimes,
    lastSeenAt: now,
    isMastered,
  };
}

/**
 * 直近の回答から現在の正答率を計算する
 * 適応的難易度調整に使用
 */
export function calculateRecentAccuracy(recentAnswers: QuizAnswer[]): number {
  if (recentAnswers.length === 0) return TARGET_ACCURACY;
  const correct = recentAnswers.filter(a => a.isCorrect).length;
  return correct / recentAnswers.length;
}

/**
 * 適応的難易度に基づいてアンロック国数を調整する
 *
 * - 正答率が高すぎる（>87%）→ 新しい国を追加
 * - 正答率が低すぎる（<70%）→ アンロック数は増やさない
 * - それ以外 → 現状維持
 *
 * @returns 更新後のアンロック国数
 */
export function adjustUnlockedCount(
  currentUnlocked: number,
  recentAnswers: QuizAnswer[],
  totalCountries: number
): number {
  if (recentAnswers.length < 5) return currentUnlocked; // データ不足

  const accuracy = calculateRecentAccuracy(recentAnswers);

  if (accuracy >= UNLOCK_THRESHOLD && currentUnlocked < totalCountries) {
    // 正答率が高い → 新しい国を追加
    return Math.min(currentUnlocked + UNLOCK_BATCH_SIZE, totalCountries);
  }

  // 正答率が低くても、既にアンロック済みの国は減らさない
  return Math.max(currentUnlocked, MIN_UNLOCKED_COUNTRIES);
}

/**
 * 次に出題する国を選択する
 *
 * 優先順位:
 * 1. 復習時期が来ている国（nextReviewAt < now）で、自信度が低い順
 * 2. まだ一度も出題されていない国
 * 3. アンロック済みの国からランダム
 *
 * これにより、85%ルールと間隔反復を両立する
 */
export function selectNextCountry(
  countries: CountryData[],
  progress: UserProgress
): CountryData {
  const now = Date.now();
  const unlockedCountries = countries
    .sort((a, b) => b.presenceScore - a.presenceScore)
    .slice(0, progress.unlockedCountryCount);

  // 1. 復習時期が来ている国を探す（自信度が低い順）
  const dueForReview = unlockedCountries
    .filter(c => {
      const state = progress.countryStates[c.id];
      return state && state.nextReviewAt <= now && !state.isMastered;
    })
    .sort((a, b) => {
      const stateA = progress.countryStates[a.id];
      const stateB = progress.countryStates[b.id];
      return (stateA?.confidenceLevel || 1) - (stateB?.confidenceLevel || 1);
    });

  if (dueForReview.length > 0) {
    return dueForReview[0];
  }

  // 2. まだ一度も出題されていない国
  const unseen = unlockedCountries.filter(c => !progress.countryStates[c.id]);
  if (unseen.length > 0) {
    return unseen[0]; // プレゼンス順で最初の未出題国
  }

  // 3. アンロック済みの国からランダム（マスター済みは優先度低）
  const nonMastered = unlockedCountries.filter(
    c => !progress.countryStates[c.id]?.isMastered
  );
  const pool = nonMastered.length > 0 ? nonMastered : unlockedCountries;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 不正解の選択肢を3つ選ぶ
 *
 * 選択ルール:
 * - 正解の国と重複しない
 * - 選択肢同士でも重複しない
 * - アンロック済みの国から優先的に選ぶ（見たことがある国旗の方が学習効果が高い）
 */
export function selectDistractors(
  correctCountry: CountryData,
  allCountries: CountryData[],
  progress: UserProgress
): CountryData[] {
  // 正解を除外したアンロック済みの国
  const unlockedPool = allCountries
    .sort((a, b) => b.presenceScore - a.presenceScore)
    .slice(0, Math.max(progress.unlockedCountryCount, 10))
    .filter(c => c.id !== correctCountry.id);

  // アンロック済みが足りなければ全国から補充
  const pool = unlockedPool.length >= 3
    ? unlockedPool
    : allCountries.filter(c => c.id !== correctCountry.id);

  // シャッフルして3つ選ぶ
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

/**
 * クイズの1問を生成する
 *
 * @param countries 全国データ（presenceScoreでソート済み前提）
 * @param progress ユーザーの進捗データ
 * @returns 生成されたクイズ問題
 */
export function generateQuestion(
  countries: CountryData[],
  progress: UserProgress
): QuizQuestion {
  // 適応的難易度に基づいてアンロック数を調整
  const adjustedUnlocked = adjustUnlockedCount(
    progress.unlockedCountryCount,
    progress.recentAnswers,
    countries.length
  );
  progress.unlockedCountryCount = adjustedUnlocked;

  // 出題する国を選択
  const correctCountry = selectNextCountry(countries, progress);

  // 不正解の選択肢を選択
  const distractors = selectDistractors(correctCountry, countries, progress);

  // 4つの選択肢をシャッフル
  const choices = [correctCountry, ...distractors].sort(
    () => Math.random() - 0.5
  );

  return {
    correctCountry,
    choices,
  };
}

/**
 * 回答を処理し、進捗データを更新する
 *
 * @returns 更新後のUserProgress
 */
export function processAnswer(
  progress: UserProgress,
  question: QuizQuestion,
  selectedCountryId: string,
  responseTimeMs: number,
  totalCountries: number
): { updatedProgress: UserProgress; answer: QuizAnswer } {
  const isCorrect = selectedCountryId === question.correctCountry.id;

  const answer: QuizAnswer = {
    countryId: question.correctCountry.id,
    selectedCountryId,
    isCorrect,
    responseTimeMs,
    answeredAt: Date.now(),
  };

  // 直近の回答履歴を更新（最大20件）
  const recentAnswers = [answer, ...progress.recentAnswers].slice(
    0,
    RECENT_ANSWERS_WINDOW
  );

  // 国の学習状態を更新
  const currentCountryState =
    progress.countryStates[question.correctCountry.id] ||
    createDefaultCountryState(question.correctCountry.id);
  const updatedCountryState = updateLearningState(currentCountryState, answer);

  // 全体の統計を更新
  const totalAnswered = progress.totalQuestionsAnswered + 1;
  const totalCorrect = Math.round(progress.overallAccuracy * progress.totalQuestionsAnswered)
    + (isCorrect ? 1 : 0);
  const overallAccuracy = totalCorrect / totalAnswered;

  // 全国旗コンプリート判定
  const updatedStates = {
    ...progress.countryStates,
    [question.correctCountry.id]: updatedCountryState,
  };
  const masteredCount = Object.values(updatedStates).filter(s => s.isMastered).length;
  const allFlagsCompleted = masteredCount >= totalCountries;

  const updatedProgress: UserProgress = {
    ...progress,
    countryStates: updatedStates,
    recentAnswers,
    overallAccuracy,
    totalQuestionsAnswered: totalAnswered,
    allFlagsCompleted,
    unlockedCountryCount: adjustUnlockedCount(
      progress.unlockedCountryCount,
      recentAnswers,
      totalCountries
    ),
  };

  return { updatedProgress, answer };
}

/**
 * スペシャルチャレンジ用の問題を生成する
 * 豆知識をヒントとして、4つの国旗から正解を選ばせる
 *
 * @param countries 全国データ
 * @param progress ユーザーの進捗データ
 * @param language 現在の言語
 * @returns クイズ問題と使用した豆知識
 */
export function generateSpecialChallengeQuestion(
  countries: CountryData[],
  progress: UserProgress,
  language: string
): { question: QuizQuestion; funFact: string } | null {
  // まだスペシャルチャレンジをクリアしていない国を探す
  const uncleared = countries.filter(c => {
    const state = progress.countryStates[c.id];
    return state?.isMastered && !state.specialChallengeCleared;
  });

  if (uncleared.length === 0) return null;

  // ランダムに1つ選ぶ
  const correctCountry = uncleared[Math.floor(Math.random() * uncleared.length)];

  // 豆知識をランダムに1つ選ぶ
  const langKey = language as keyof typeof correctCountry.funFacts;
  const facts = correctCountry.funFacts[langKey] || correctCountry.funFacts.en;
  const funFact = facts[Math.floor(Math.random() * facts.length)];

  // 不正解の選択肢
  const distractors = selectDistractors(correctCountry, countries, progress);

  const choices = [correctCountry, ...distractors].sort(
    () => Math.random() - 0.5
  );

  return {
    question: { correctCountry, choices },
    funFact,
  };
}
