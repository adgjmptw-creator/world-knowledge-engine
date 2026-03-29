/**
 * World Knowledge Engine — 国データ生成ヘルパー
 *
 * 1国1ファイルからCountryData構造を生成するファクトリ関数。
 * 全13言語の国名・首都名・豆知識を保持する。
 */
import { CountryData, LanguageCode, WorldRegion, LocalizedName, LocalizedFunFacts } from '../types';

/** 言語コードの順序（配列インデックスに対応） */
export const LANGS: LanguageCode[] = [
  'en', 'zh-CN', 'zh-TW', 'hi', 'es', 'pt-BR', 'id', 'ja', 'ar', 'fr', 'de', 'ko', 'tr', 'ru'
];

/**
 * 14言語の名前配列からLocalizedNameオブジェクトを生成
 * 空文字の場合はenの値にフォールバック
 */
export function buildNames(arr: string[]): LocalizedName {
  const result: any = {};
  LANGS.forEach((lang, i) => {
    result[lang] = arr[i] || arr[0];
  });
  return result;
}

/**
 * 14言語×2件の豆知識配列からLocalizedFunFactsオブジェクトを生成
 * facts[lang] = [fact1, fact2]
 */
export function buildFacts(facts: Record<string, [string, string]>): LocalizedFunFacts {
  const result: any = {};
  LANGS.forEach((lang) => {
    result[lang] = facts[lang] || facts['en'];
  });
  return result;
}

/**
 * 1国分のデータを生成するファクトリ関数
 *
 * @param id ISO 3166-1 alpha-2コード
 * @param nameEn 英語名
 * @param names 14言語の国名配列（LANGSの順）
 * @param furigana ひらがな読み
 * @param emoji 国旗emoji
 * @param region 地域
 * @param score 国際プレゼンススコア
 * @param capitalEn 首都英語名
 * @param capitalNames 14言語の首都名配列（LANGSの順）
 * @param facts 13言語の豆知識 Record<langCode, [fact1, fact2]>
 */
export function country(
  id: string, nameEn: string, names: string[],
  furigana: string, emoji: string, region: WorldRegion, score: number,
  capitalEn: string, capitalNames: string[],
  facts: Record<string, [string, string]>
): CountryData {
  return {
    id, nameEn,
    localizedNames: buildNames(names),
    furigana,
    flag: { svgFile: `${id.toLowerCase()}.svg`, emoji },
    region, presenceScore: score,
    capitalEn,
    capitalLocalized: buildNames(capitalNames),
    funFacts: buildFacts(facts),
  };
}
