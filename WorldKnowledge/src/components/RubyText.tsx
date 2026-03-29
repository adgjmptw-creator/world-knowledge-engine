/**
 * RubyText — ルビ（ふりがな）表示コンポーネント
 *
 * 漢字の上にふりがなを表示する伝統的な日本語ルビ表記。
 * flexWrap: 'wrap' で自然な改行を実現する。
 * 通常テキスト部分もルビと同じ高さの空白を上に持たせてベースラインを揃える。
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
        // プレーンテキスト: ルビスペース分の余白を上に確保
        // 1文字ずつ分割して自然な改行を実現
        return (
          <React.Fragment key={index}>
            {segment.text.split('').map((char, ci) => (
              <View key={`${index}-${ci}`} style={styles.plainGroup}>
                <Text
                  style={[
                    styles.ruby,
                    { fontSize: rubyFontSize, lineHeight: rubyFontSize + 1, color: 'transparent' },
                  ]}
                >
                  {' '}
                </Text>
                <Text style={[styles.base, style]}>{char}</Text>
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
