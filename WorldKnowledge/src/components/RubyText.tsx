/**
 * RubyText — ルビ（ふりがな）表示コンポーネント
 *
 * 漢字の上にふりがなを表示する伝統的な日本語ルビ表記。
 *
 * 設計:
 * - ルビグループ（漢字+ふりがな）はView内に縦配置
 * - プレーンテキストはそのまま<Text>で出力（OS標準の改行ルールに委ねる）
 * - flexWrap: 'wrap' + alignItems: 'flex-end' でベースラインを揃える
 * - 禁則処理はOS/ブラウザのテキストレンダリングに委任（プレーンテキスト部分）
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
        // プレーンテキスト: 分割せずそのまま出力
        // OS/ブラウザ標準の改行・禁則処理に委ねることで
        // 「ジャ」「ション」等の途中で不自然に切れることを防ぐ
        return (
          <Text key={index} style={[styles.base, style]}>
            {segment.text}
          </Text>
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
