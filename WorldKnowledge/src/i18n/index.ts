/**
 * World Knowledge Engine — i18n設定
 *
 * i18nextを使用して13言語のUI翻訳を管理する。
 * ユーザーのデバイス言語を自動検出し、対応する翻訳を適用する。
 * 対応していない言語の場合は英語にフォールバックする。
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// 各言語のUIテキストをインポート
import en from './locales/en';
import ja from './locales/ja';
import zhCN from './locales/zh-CN';
import zhTW from './locales/zh-TW';
import hi from './locales/hi';
import es from './locales/es';
import ptBR from './locales/pt-BR';
import id from './locales/id';
import ar from './locales/ar';
import fr from './locales/fr';
import de from './locales/de';
import ko from './locales/ko';
import tr from './locales/tr';
import ru from './locales/ru';
import { LanguageCode } from '../types';

/**
 * デバイスの言語設定から、アプリが対応する言語コードを判定する
 * 対応していない言語の場合は'en'を返す
 */
function detectLanguage(): LanguageCode {
  // Expoのローカライゼーションから言語タグを取得
  const locales = Localization.getLocales();
  const deviceLang = locales?.[0]?.languageTag || 'en';

  // 中国語: 簡体字/繁体字を区別
  if (deviceLang.startsWith('zh')) {
    if (deviceLang.includes('TW') || deviceLang.includes('HK') || deviceLang.includes('Hant')) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }

  // ポルトガル語: ブラジル向け
  if (deviceLang.startsWith('pt')) {
    return 'pt-BR';
  }

  // その他の言語はプレフィックスで判定
  const langPrefix = deviceLang.split('-')[0];
  const supportedLangs: LanguageCode[] = [
    'en', 'hi', 'es', 'id', 'ja', 'ar', 'fr', 'de', 'ko', 'tr', 'ru',
  ];

  if (supportedLangs.includes(langPrefix as LanguageCode)) {
    return langPrefix as LanguageCode;
  }

  // デフォルトは英語
  return 'en';
}

/** 検出された現在の言語コード */
export const currentLanguage: LanguageCode = detectLanguage();

// i18nの初期化
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
      'zh-CN': { translation: zhCN },
      'zh-TW': { translation: zhTW },
      hi: { translation: hi },
      es: { translation: es },
      'pt-BR': { translation: ptBR },
      id: { translation: id },
      ar: { translation: ar },
      fr: { translation: fr },
      de: { translation: de },
      ko: { translation: ko },
      tr: { translation: tr },
      ru: { translation: ru },
    },
    lng: currentLanguage,
    fallbackLng: 'en', // 対応していないキーは英語にフォールバック
    interpolation: {
      escapeValue: false, // Reactで使うのでエスケープ不要
    },
  });

export default i18n;
