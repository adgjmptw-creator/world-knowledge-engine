/**
 * World Knowledge Engine — 地域定義
 *
 * 探検マップ画面で使用する世界の地域分類と、各地域の表示情報。
 */

import { WorldRegion, LanguageCode } from '../types';

/** 地域の表示情報 */
export interface RegionInfo {
  /** 地域識別子 */
  id: WorldRegion;
  /** 各言語での地域名 */
  name: Record<LanguageCode, string>;
  /** 地域のテーマカラー */
  color: string;
  /** 地域のアイコン（emoji） */
  emoji: string;
}

/**
 * 12の世界地域の定義
 * 探検マップ画面でタイル表示される
 */
export const REGIONS: RegionInfo[] = [
  {
    id: 'east_asia',
    name: {
      en: 'East Asia', 'zh-CN': '东亚', 'zh-TW': '東亞', hi: 'पूर्वी एशिया',
      es: 'Asia Oriental', 'pt-BR': 'Ásia Oriental', id: 'Asia Timur',
      ja: 'ひがしアジア', ar: 'شرق آسيا', fr: 'Asie de l\'Est',
      de: 'Ostasien', ko: '동아시아', tr: 'Doğu Asya', ru: 'Восточная Азия',
    },
    color: '#FF6B6B',
    emoji: '🏯',
  },
  {
    id: 'southeast_asia',
    name: {
      en: 'Southeast Asia', 'zh-CN': '东南亚', 'zh-TW': '東南亞', hi: 'दक्षिण-पूर्व एशिया',
      es: 'Sudeste Asiático', 'pt-BR': 'Sudeste Asiático', id: 'Asia Tenggara',
      ja: 'とうなんアジア', ar: 'جنوب شرق آسيا', fr: 'Asie du Sud-Est',
      de: 'Südostasien', ko: '동남아시아', tr: 'Güneydoğu Asya', ru: 'Юго-Восточная Азия',
    },
    color: '#4ECDC4',
    emoji: '🌴',
  },
  {
    id: 'south_asia',
    name: {
      en: 'South Asia', 'zh-CN': '南亚', 'zh-TW': '南亞', hi: 'दक्षिण एशिया',
      es: 'Asia Meridional', 'pt-BR': 'Ásia Meridional', id: 'Asia Selatan',
      ja: 'みなみアジア', ar: 'جنوب آسيا', fr: 'Asie du Sud',
      de: 'Südasien', ko: '남아시아', tr: 'Güney Asya', ru: 'Южная Азия',
    },
    color: '#FFE66D',
    emoji: '🕌',
  },
  {
    id: 'central_asia',
    name: {
      en: 'Central Asia', 'zh-CN': '中亚', 'zh-TW': '中亞', hi: 'मध्य एशिया',
      es: 'Asia Central', 'pt-BR': 'Ásia Central', id: 'Asia Tengah',
      ja: 'ちゅうおうアジア', ar: 'آسيا الوسطى', fr: 'Asie centrale',
      de: 'Zentralasien', ko: '중앙아시아', tr: 'Orta Asya', ru: 'Центральная Азия',
    },
    color: '#C49B63',
    emoji: '🐪',
  },
  {
    id: 'west_asia',
    name: {
      en: 'West Asia', 'zh-CN': '西亚', 'zh-TW': '西亞', hi: 'पश्चिमी एशिया',
      es: 'Asia Occidental', 'pt-BR': 'Ásia Ocidental', id: 'Asia Barat',
      ja: 'にしアジア', ar: 'غرب آسيا', fr: 'Asie de l\'Ouest',
      de: 'Westasien', ko: '서아시아', tr: 'Batı Asya', ru: 'Западная Азия',
    },
    color: '#F4A460',
    emoji: '🏜️',
  },
  {
    id: 'europe',
    name: {
      en: 'Europe', 'zh-CN': '欧洲', 'zh-TW': '歐洲', hi: 'यूरोप',
      es: 'Europa', 'pt-BR': 'Europa', id: 'Eropa',
      ja: 'ヨーロッパ', ar: 'أوروبا', fr: 'Europe',
      de: 'Europa', ko: '유럽', tr: 'Avrupa', ru: 'Европа',
    },
    color: '#6C5CE7',
    emoji: '🏰',
  },
  {
    id: 'north_africa',
    name: {
      en: 'North Africa', 'zh-CN': '北非', 'zh-TW': '北非', hi: 'उत्तरी अफ्रीका',
      es: 'Norte de África', 'pt-BR': 'Norte da África', id: 'Afrika Utara',
      ja: 'きたアフリカ', ar: 'شمال أفريقيا', fr: 'Afrique du Nord',
      de: 'Nordafrika', ko: '북아프리카', tr: 'Kuzey Afrika', ru: 'Северная Африка',
    },
    color: '#FDCB6E',
    emoji: '🐫',
  },
  {
    id: 'sub_saharan_africa',
    name: {
      en: 'Sub-Saharan Africa', 'zh-CN': '撒哈拉以南非洲', 'zh-TW': '撒哈拉以南非洲',
      hi: 'उप-सहारा अफ्रीका', es: 'África Subsahariana', 'pt-BR': 'África Subsaariana',
      id: 'Afrika Sub-Sahara', ja: 'サハラいなんアフリカ', ar: 'أفريقيا جنوب الصحراء',
      fr: 'Afrique subsaharienne', de: 'Subsahara-Afrika', ko: '사하라 이남 아프리카',
      tr: 'Sahra Altı Afrika', ru: 'Африка к югу от Сахары',
    },
    color: '#00B894',
    emoji: '🦁',
  },
  {
    id: 'north_america',
    name: {
      en: 'North America', 'zh-CN': '北美洲', 'zh-TW': '北美洲', hi: 'उत्तरी अमेरिका',
      es: 'América del Norte', 'pt-BR': 'América do Norte', id: 'Amerika Utara',
      ja: 'きたアメリカ', ar: 'أمريكا الشمالية', fr: 'Amérique du Nord',
      de: 'Nordamerika', ko: '북아메리카', tr: 'Kuzey Amerika', ru: 'Северная Америка',
    },
    color: '#0984E3',
    emoji: '🗽',
  },
  {
    id: 'central_america',
    name: {
      en: 'Central America & Caribbean', 'zh-CN': '中美洲与加勒比', 'zh-TW': '中美洲與加勒比',
      hi: 'मध्य अमेरिका', es: 'América Central y Caribe', 'pt-BR': 'América Central e Caribe',
      id: 'Amerika Tengah', ja: 'ちゅうべいとカリブ', ar: 'أمريكا الوسطى والكاريبي',
      fr: 'Amérique centrale et Caraïbes', de: 'Mittelamerika und Karibik',
      ko: '중앙아메리카', tr: 'Orta Amerika ve Karayipler', ru: 'Центральная Америка и Карибы',
    },
    color: '#00CEC9',
    emoji: '🌺',
  },
  {
    id: 'south_america',
    name: {
      en: 'South America', 'zh-CN': '南美洲', 'zh-TW': '南美洲', hi: 'दक्षिण अमेरिका',
      es: 'América del Sur', 'pt-BR': 'América do Sul', id: 'Amerika Selatan',
      ja: 'みなみアメリカ', ar: 'أمريكا الجنوبية', fr: 'Amérique du Sud',
      de: 'Südamerika', ko: '남아메리카', tr: 'Güney Amerika', ru: 'Южная Америка',
    },
    color: '#6AB04C',
    emoji: '🦜',
  },
  {
    id: 'oceania',
    name: {
      en: 'Oceania', 'zh-CN': '大洋洲', 'zh-TW': '大洋洲', hi: 'ओशिनिया',
      es: 'Oceanía', 'pt-BR': 'Oceania', id: 'Oseania',
      ja: 'オセアニア', ar: 'أوقيانوسيا', fr: 'Océanie',
      de: 'Ozeanien', ko: '오세아니아', tr: 'Okyanusya', ru: 'Океания',
    },
    color: '#74B9FF',
    emoji: '🏝️',
  },
];
