/**
 * World Knowledge Engine — TTSサービス
 *
 * デバイス内蔵のTTSエンジンを使用して、国名や豆知識を読み上げる。
 * expo-speechを使用し、オフライン環境でも動作する。
 *
 * 仕様:
 * - 結果カード表示300ms後に自動再生（現地語→英語の順）
 * - 音声再生ボタンで豆知識テキスト全文を読み上げ
 * - 自動再生は1回のみ
 */

import * as Speech from 'expo-speech';
import { LanguageCode } from '../types';
import { stripRubyForTTS } from '../utils/rubyText';

/**
 * 言語コードからTTSエンジンのlocale識別子へのマッピング
 * デバイスのTTSエンジンが認識できる形式に変換する
 */
const LANGUAGE_TO_TTS_LOCALE: Record<LanguageCode, string> = {
  en: 'en-US',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  hi: 'hi-IN',
  es: 'es-ES',
  'pt-BR': 'pt-BR',
  id: 'id-ID',
  ja: 'ja-JP',
  ar: 'ar-SA',
  fr: 'fr-FR',
  de: 'de-DE',
  ko: 'ko-KR',
  tr: 'tr-TR',
  ru: 'ru-RU',
};

/**
 * 現在の読み上げを停止する
 * 新しい読み上げを開始する前に呼び出す
 */
export function stopSpeaking(): void {
  Speech.stop();
}

/**
 * テキストを指定した言語で読み上げる
 * @param text 読み上げるテキスト
 * @param language 言語コード
 * @param rate 読み上げ速度（0.5〜2.0、デフォルトは0.85で子供向けにゆっくり）
 * @returns 読み上げ完了を示すPromise
 */
export function speak(
  text: string,
  language: LanguageCode,
  rate: number = 0.85
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 既存の読み上げがあれば停止
    Speech.stop();

    // 日本語のルビ括弧表記を除去して自然な読み上げにする
    // 例: "富士山(ふじさん)" → "ふじさん" で読み上げ
    const cleanText = stripRubyForTTS(text);

    Speech.speak(cleanText, {
      language: LANGUAGE_TO_TTS_LOCALE[language],
      rate,
      pitch: 1.0,
      onDone: () => resolve(),
      onError: (error) => {
        console.warn('TTS error:', error);
        resolve(); // エラーでもrejectせず処理を続行（子供がエラーで困らないように）
      },
      onStopped: () => resolve(),
    });
  });
}

/**
 * 国名を現地語→英語の順で読み上げる
 * 結果カードで使用する
 *
 * @param localName 現地語の国名
 * @param englishName 英語の国名
 * @param language ユーザーの言語コード
 */
export async function speakCountryName(
  localName: string,
  englishName: string,
  language: LanguageCode
): Promise<void> {
  // 現地語で読み上げ
  await speak(localName, language);

  // 少し間を置いてから英語で読み上げ
  await new Promise(resolve => setTimeout(resolve, 300));

  // 英語が現地語と同じ場合は2回読まない
  if (language !== 'en') {
    await speak(englishName, 'en');
  }
}

/**
 * 豆知識テキストを読み上げる
 * @param text 豆知識テキスト
 * @param language 言語コード
 */
export async function speakFunFact(
  text: string,
  language: LanguageCode
): Promise<void> {
  await speak(text, language, 0.8); // 豆知識はさらにゆっくり読む
}

/**
 * TTSエンジンが利用可能かチェックする
 * @returns 利用可能な場合true
 */
export async function isTTSAvailable(): Promise<boolean> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.length > 0;
  } catch {
    return false;
  }
}

/**
 * 現在読み上げ中かどうかチェックする
 */
export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
