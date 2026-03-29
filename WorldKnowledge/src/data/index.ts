/**
 * World Knowledge Engine — 国データ統合インデックス
 *
 * 3つのパートに分割された国データを統合し、
 * presenceScoreの降順でソートした全国リストを提供する。
 * アプリ全体でこのモジュール経由で国データにアクセスする。
 */

import { CountryData } from '../types';
import { COUNTRIES_PART1 } from './countries_part1';
import { COUNTRIES_PART2 } from './countries_part2';
import { COUNTRIES_PART3 } from './countries_part3';

/**
 * 全国連加盟国193カ国のデータ
 * presenceScoreの高い順（国際プレゼンスの高い順）にソート
 */
let _allCountries: CountryData[] | null = null;

/**
 * 全国データを取得する（キャッシュ付き）
 * 初回呼び出し時にソートしてキャッシュする
 */
export function getAllCountries(): CountryData[] {
  if (!_allCountries) {
    _allCountries = [
      ...COUNTRIES_PART1,
      ...COUNTRIES_PART2,
      ...COUNTRIES_PART3,
    ].sort((a, b) => b.presenceScore - a.presenceScore);
  }
  return _allCountries;
}

/**
 * 国IDから国データを検索する
 */
export function getCountryById(id: string): CountryData | undefined {
  return getAllCountries().find(c => c.id === id);
}

/**
 * 地域別の国リストを取得する
 */
export function getCountriesByRegion(regionId: string): CountryData[] {
  return getAllCountries().filter(c => c.region === regionId);
}

/**
 * 全国数を取得する
 */
export function getTotalCountryCount(): number {
  return getAllCountries().length;
}
