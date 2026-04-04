/**
 * RubyText — ルビ（ふりがな）表示コンポーネント
 *
 * 漢字の上にふりがなを表示する伝統的な日本語ルビ表記。
 *
 * 設計:
 * - flexWrap: 'wrap' + alignItems: 'flex-end' でベースラインを揃える
 * - ルビグループだけが上部にルビテキストを持ち、高さが大きくなる
 * - プレーンテキストは高さを持たず、ベースラインで揃う
 *
 * 禁則処理:
 * - 行頭禁則: 句読点「。」「、」感嘆符「！」「？」閉じ括弧等は行頭に来ない
 * - 行末禁則: 開き括弧等は行末に来ない
 */

import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { parseRubyText, hasRuby } from '../utils/rubyText';
import { FontSizes, Colors } from '../constants/theme';

interface RubyTextProps {
  text: string;
  style?: TextStyle;
  rubyStyle?: TextStyle;
  containerStyle?: ViewStyle;
  enableRuby?: boolean;
}

/**
 * 行頭禁則文字（行頭に来てはいけない文字）
 */
const LINE_START_PROHIBITED = new Set([
  '。', '、', '！', '？', '・',
  '）', '】', '》', '』', '」', '｝', '〕', '〉',
  ')', ']', '}', '>', '!', '?', '.', ',', ':', ';',
  'ー', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'っ', 'ゃ', 'ゅ', 'ょ',
  'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ッ', 'ャ', 'ュ', 'ョ',
  '々', '〻', '…', '‥', '～',
]);

/**
 * 行末禁則文字（行末に来てはいけない文字）
 */
const LINE_END_PROHIBITED = new Set([
  '（', '【', '《', '『', '「', '｛', '〔', '〈',
  '(', '[', '{', '<',
]);

/**
 * 禁則処理を考慮してチャンク分割
 */
function splitWithKinsoku(text: string): string[] {
  const chars = Array.from(text);
  if (chars.length === 0) return [];

  const chunks: string[] = [];
  let current = chars[0];

  for (let i = 1; i < chars.length; i++) {
    const char = chars[i];
    if (LINE_START_PROHIBITED.has(char)) {
      current += char;
    } else if (LINE_END_PROHIBITED.has(current[current.length - 1])) {
      current += char;
    } else {
      chunks.push(current);
      current = char;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export const RubyText: React.FC<RubyTextProps> = ({
  text,
  style,
  rubyStyle,
  containerStyle,
  enableRuby = false,
}) => {
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
          // 漢字+ルビのペア: ルビの分だけ高さが大きくなる
          return (
            <View key={index} style={styles.rubyGroup}>
              <Text
                style={[
                  styles.ruby,
                  { fontSize: rubyFontSize, lineHeight: rubyFontSize + 2 },
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
        // プレーンテキスト: スペーサーなし、ベースラインで揃う
        const chunks = splitWithKinsoku(segment.text);
        return (
          <React.Fragment key={index}>
            {chunks.map((chunk, ci) => (
              <Text key={`${index}-${ci}`} style={[styles.base, style]}>
                {chunk}
              </Text>
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
