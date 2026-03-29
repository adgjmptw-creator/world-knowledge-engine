/**
 * 国データ生成ヘルパー
 * コンパクトな配列データからCountryData構造に変換するファクトリ関数。
 * 言語フォールバック: funFacts/capitalLocalizedはen/jaのみ保持、他言語はenにフォールバック。
 */
import { CountryData, LanguageCode, WorldRegion, LocalizedName, LocalizedFunFacts } from '../types';

/** 言語コードの順序（配列インデックス） */
const LANGS: LanguageCode[] = [
  'en','zh-CN','zh-TW','hi','es','pt-BR','id','ja','ar','fr','de','ko','tr','ru'
];

/**
 * 14言語の名前配列からLocalizedNameオブジェクトを生成
 * 空文字の場合はenの値にフォールバック
 */
export function buildNames(arr: string[]): LocalizedName {
  const result: any = {};
  LANGS.forEach((lang, i) => {
    result[lang] = arr[i] || arr[0]; // 空ならenにフォールバック
  });
  return result;
}

/**
 * 英語+日本語の豆知識から全言語のLocalizedFunFactsを生成
 * 英語・日本語以外はenにフォールバック
 */
export function buildFacts(enFacts: string[], jaFacts: string[]): LocalizedFunFacts {
  const result: any = {};
  LANGS.forEach((lang) => {
    result[lang] = lang === 'ja' ? jaFacts : enFacts;
  });
  return result;
}

/**
 * コンパクトデータからCountryDataを生成するファクトリ関数
 */
export function c(
  id: string, nameEn: string, names: string[],
  furigana: string, emoji: string, region: WorldRegion, score: number,
  capitalEn: string, capitalJa: string,
  factsEn: [string, string], factsJa: [string, string]
): CountryData {
  // 首都のローカライズ名（en+jaのみ、他はenフォールバック）
  const capNames = LANGS.map(l => l === 'ja' ? capitalJa : capitalEn);
  return {
    id, nameEn,
    localizedNames: buildNames(names),
    furigana,
    flag: { svgFile: `${id.toLowerCase()}.svg`, emoji },
    region, presenceScore: score,
    capitalEn,
    capitalLocalized: buildNames(capNames),
    funFacts: buildFacts(factsEn, factsJa),
  };
}
