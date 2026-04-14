/**
 * World Knowledge Engine — ルビ（ふりがな）ユーティリティ
 *
 * 日本語テキスト内の漢字(かな)形式のルビ表記を処理する。
 * - 表示用: React Nativeで漢字の上にルビを表示するためのパース
 * - TTS用: ルビ部分を除去して自然な読み上げテキストを生成
 *
 * 重要: ルビの対象は漢字(CJK統合漢字)のみ。
 * 数字・アルファベット・記号は対象外とし、読み飛ばさない。
 * 例: "14億(おく)" → 表示は「14」+「億(おく)」、TTS用は「14おく」
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
 * 漢字にマッチする正規表現パターン
 * CJK統合漢字(U+4E00-U+9FFF) + CJK統合漢字拡張A(U+3400-U+4DBF) +
 * CJK互換漢字(U+F900-U+FAFF) + 々（繰り返し記号）
 */
const KANJI_CHAR = '[\\u4E00-\\u9FFF\\u3400-\\u4DBF\\uF900-\\uFAFF々]';

/**
 * 漢字(かな) パターンの正規表現
 * 1文字以上の漢字 + (ふりがな) にマッチ
 * 数字・アルファベット・記号はマッチしない
 */
const RUBY_REGEX = new RegExp(`(${KANJI_CHAR}+)\\(([^\\)]+)\\)`, 'g');

/**
 * 漢字(かな) 形式のテキストをパースしてセグメント配列にする
 *
 * 例: "14億(おく)人以上(いじょう)の人(ひと)"
 * → [
 *     { type: 'text', text: '14' },
 *     { type: 'ruby', text: '億', ruby: 'おく' },
 *     { type: 'ruby', text: '人以上', ruby: 'いじょう' },  ← 注: 実際のデータでは分割済み
 *     { type: 'text', text: 'の' },
 *     { type: 'ruby', text: '人', ruby: 'ひと' },
 *   ]
 */
export function parseRubyText(text: string): RubySegment[] {
  const segments: RubySegment[] = [];
  const regex = new RegExp(RUBY_REGEX.source, 'g'); // 新しいインスタンスを作成

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // マッチ前のプレーンテキスト（数字・アルファベット等を含む）
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        text: text.slice(lastIndex, match.index),
      });
    }
    // 漢字+ルビ
    segments.push({
      type: 'ruby',
      text: match[1],  // 漢字部分のみ
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
 * 漢字(かな) → かな に変換（漢字をふりがなに置換）
 * 数字・アルファベットはそのまま残す
 *
 * 例: "14億(おく)人以上(いじょう)の人(ひと)が住(す)んでいます"
 * → "14おくいじょうのひとがすんでいます"
 *
 * 例: "1443年(ねん)に世宗王(セジョンおう)が作(つく)りました"
 * → "1443ねんにセジョンおうがつくりました"
 */
export function stripRubyForTTS(text: string): string {
  return text.replace(new RegExp(`${KANJI_CHAR}+\\(([^\\)]+)\\)`, 'g'), '$1');
}

/**
 * プレーンテキスト表示用にルビ括弧表記を除去する
 * 漢字(かな) → 漢字 に変換（漢字を残してふりがなを削除）
 * ブラウザタイトル・スクリーンリーダー用の純粋な文字列が必要な場合に使用
 *
 * 例: "世界(せかい)の知識(ちしき)エンジン"
 * → "世界の知識エンジン"
 */
export function stripRubyForDisplay(text: string): string {
  return text.replace(new RegExp(`(${KANJI_CHAR}+)\\([^\\)]+\\)`, 'g'), '$1');
}

/**
 * テキストにルビ表記が含まれるかチェック
 */
export function hasRuby(text: string): boolean {
  return new RegExp(`${KANJI_CHAR}+\\([^\\)]+\\)`).test(text);
}
