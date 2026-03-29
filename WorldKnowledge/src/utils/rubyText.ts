/**
 * World Knowledge Engine — ルビ（ふりがな）ユーティリティ
 *
 * 日本語テキスト内の漢字(かな)形式のルビ表記を処理する。
 * - 表示用: React Nativeで漢字の上にルビを表示するためのパース
 * - TTS用: ルビ部分を除去して自然な読み上げテキストを生成
 */

/**
 * ルビ付きテキストのパース結果
 * 漢字+ルビのペア、またはプレーンテキストの配列
 */
export interface RubySegment {
  /** 'ruby' = 漢字+ルビ、'text' = プレーンテキスト */
  type: 'ruby' | 'text';
  /** 表示テキスト（漢字 or プレーンテキスト） */
  text: string;
  /** ルビ（ふりがな）。type === 'ruby' の場合のみ */
  ruby?: string;
}

/**
 * 漢字(かな) 形式のテキストをパースしてセグメント配列にする
 *
 * 例: "富士山(ふじさん)は日本(にほん)で一番(いちばん)高(たか)い"
 * → [
 *     { type: 'ruby', text: '富士山', ruby: 'ふじさん' },
 *     { type: 'text', text: 'は' },
 *     { type: 'ruby', text: '日本', ruby: 'にほん' },
 *     { type: 'text', text: 'で' },
 *     { type: 'ruby', text: '一番', ruby: 'いちばん' },
 *     { type: 'ruby', text: '高', ruby: 'たか' },
 *     { type: 'text', text: 'い' },
 *   ]
 */
export function parseRubyText(text: string): RubySegment[] {
  const segments: RubySegment[] = [];
  // 漢字(かな) のパターン: 1文字以上の非括弧文字 + (ひらがな/カタカナ)
  const regex = /([^\s()\u3040-\u309F\u30A0-\u30FF]+)\(([^\)]+)\)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // マッチ前のプレーンテキスト
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        text: text.slice(lastIndex, match.index),
      });
    }
    // 漢字+ルビ
    segments.push({
      type: 'ruby',
      text: match[1],  // 漢字部分
      ruby: match[2],  // ふりがな部分
    });
    lastIndex = match.index + match[0].length;
  }

  // 残りのプレーンテキスト
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      text: text.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * TTS読み上げ用にルビ括弧表記を除去する
 * 漢字(かな) → かな に変換（ルビのかな読みだけ残す）
 *
 * 例: "富士山(ふじさん)は日本(にほん)で一番(いちばん)高(たか)い"
 * → "ふじさんはにほんでいちばんたかい"
 */
export function stripRubyForTTS(text: string): string {
  return text.replace(/([^\s()\u3040-\u309F\u30A0-\u30FF]+)\(([^\)]+)\)/g, '$2');
}

/**
 * テキストにルビ表記が含まれるかチェック
 */
export function hasRuby(text: string): boolean {
  return /[^\s()\u3040-\u309F\u30A0-\u30FF]+\([^\)]+\)/.test(text);
}
