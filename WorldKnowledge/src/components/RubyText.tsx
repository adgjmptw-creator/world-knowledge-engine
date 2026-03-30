/**
 * RubyText — ルビ（ふりがな）表示コンポーネント
 *
 * 漢字の上にふりがなを表示する伝統的な日本語ルビ表記。
 * flexWrap: 'wrap' で自然な改行を実現する。
 *
 * 禁則処理:
 * - 行頭禁則: 句読点「。」「、」感嘆符「！」「？」閉じ括弧「」）等は行頭に来ない
 * - 行末禁則: 開き括弧「（等は行末に来ない
 * - 前の文字とグループ化することで禁則を回避
 */

import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { parseRubyText, hasRuby } from '../utils/rubyText';
import { FontSizes, Colors } from '../constants/theme';

interface RubyTextProps {
  /** 表示するテキスト（漢字(かな)形式のルビ表記を含む場合あり） */
  text: string;
  /** メインテキストのスタイル */
  style?: TextStyle;
  /** ルビ（ふりがな）のスタイル */
  rubyStyle?: TextStyle;
  /** コンテナのスタイル */
  containerStyle?: ViewStyle;
  /** ルビ表示を有効にするか（日本語以外ではfalseにする） */
  enableRuby?: boolean;
}

/**
 * 行頭禁則文字（行頭に来てはいけない文字）
 * 日本語・中国語・韓国語の共通禁則 + 一般的な句読点
 */
const LINE_START_PROHIBITED = new Set([
  // 日本語句読点
  '。', '、', '！', '？', '・',
  // 全角記号
  '）', '】', '》', '』', '」', '｝', '〕', '〉',
  // 半角記号
  ')', ']', '}', '>', '!', '?', '.', ',', ':', ';',
  // 繰り返し記号・長音
  'ー', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'っ', 'ゃ', 'ゅ', 'ょ',
  'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ッ', 'ャ', 'ュ', 'ョ',
  '々', '〻',
  // その他
  '…', '‥', '～',
]);

/**
 * 行末禁則文字（行末に来てはいけない文字）
 */
const LINE_END_PROHIBITED = new Set([
  '（', '【', '《', '『', '「', '｛', '〔', '〈',
  '(', '[', '{', '<',
]);

/**
 * プレーンテキストを禁則処理を考慮したチャンクに分割する
 *
 * 禁則文字は前の文字とグループ化して、行頭に単独で来ないようにする。
 * 行末禁則文字は次の文字とグループ化する。
 *
 * 例: "です！地図" → ["で", "す！", "地", "図"]
 * 例: "「こんにちは」" → ["「こ", "ん", "に", "ち", "は」"]
 */
function splitWithKinsoku(text: string): string[] {
  const chars = Array.from(text); // サロゲートペア対応
  if (chars.length === 0) return [];

  const chunks: string[] = [];
  let current = chars[0];

  for (let i = 1; i < chars.length; i++) {
    const char = chars[i];

    if (LINE_START_PROHIBITED.has(char)) {
      // 行頭禁則: この文字を前のチャンクに結合
      current += char;
    } else if (LINE_END_PROHIBITED.has(current[current.length - 1])) {
      // 行末禁則: 前のチャンクの最後が開き括弧なら次の文字と結合
      current += char;
    } else {
      // 通常: 現在のチャンクを確定し、新しいチャンクを開始
      chunks.push(current);
      current = char;
    }
  }
  // 最後のチャンクを追加
  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export const RubyText: React.FC<RubyTextProps> = ({
  text,
  style,
  rubyStyle,
  containerStyle,
  enableRuby = false,
}) => {
  // ルビ不要 or ルビ表記が含まれない場合はプレーンテキスト
  if (!enableRuby || !hasRuby(text)) {
    return <Text style={style}>{text}</Text>;
  }

  const segments = parseRubyText(text);
  const baseFontSize = (style as any)?.fontSize || FontSizes.body;
  const rubyFontSize = Math.max(Math.floor(baseFontSize * 0.45), 8);

  return (
    <View style={[styles.container, containerStyle]}>
      {segments.map((segment, index) => {
        if (segment.type === 'ruby') {
          // 漢字+ルビのペア
          return (
            <View key={index} style={styles.rubyGroup}>
              <Text
                style={[
                  styles.ruby,
                  { fontSize: rubyFontSize, lineHeight: rubyFontSize + 1 },
                  rubyStyle,
                ]}
                numberOfLines={1}
              >
                {segment.ruby}
              </Text>
              <Text style={[styles.base, style]} numberOfLines={1}>
                {segment.text}
              </Text>
            </View>
          );
        }
        // プレーンテキスト: 禁則処理を適用してチャンク分割
        const chunks = splitWithKinsoku(segment.text);
        return (
          <React.Fragment key={index}>
            {chunks.map((chunk, ci) => (
              <View key={`${index}-${ci}`} style={styles.plainGroup}>
                <Text
                  style={[
                    styles.ruby,
                    { fontSize: rubyFontSize, lineHeight: rubyFontSize + 1, color: 'transparent' },
                  ]}
                >
                  {' '}
                </Text>
                <Text style={[styles.base, style]}>{chunk}</Text>
              </View>
            ))}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  rubyGroup: {
    alignItems: 'center',
  },
  plainGroup: {
    alignItems: 'center',
  },
  ruby: {
    fontSize: FontSizes.tiny,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  base: {
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
  },
});
