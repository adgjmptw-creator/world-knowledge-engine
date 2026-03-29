/**
 * RubyText — ルビ（ふりがな）表示コンポーネント
 *
 * 漢字の上にふりがなを表示する。
 * 伝統的な日本語のルビ表記を再現する。
 * ルビが不要なテキスト（他言語）はそのまま表示する。
 */

import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { parseRubyText, hasRuby } from '../utils/rubyText';
import { FontSizes, Colors } from '../constants/theme';

interface RubyTextProps {
  /** 表示するテキスト（漢字(かな)形式のルビ表記を含む場合あり） */
  text: string;
  /** メインテキストのスタイル */
  style?: TextStyle;
  /** ルビ（ふりがな）のスタイル */
  rubyStyle?: TextStyle;
  /** ルビ表示を有効にするか（日本語以外ではfalseにする） */
  enableRuby?: boolean;
}

/**
 * ルビ付きテキストを表示する
 * enableRuby=true の場合、漢字(かな) 形式のテキストを
 * 漢字の上にふりがなが表示される形式でレンダリングする。
 */
export const RubyText: React.FC<RubyTextProps> = ({
  text,
  style,
  rubyStyle,
  enableRuby = false,
}) => {
  // ルビ不要 or ルビ表記が含まれない場合はプレーンテキスト
  if (!enableRuby || !hasRuby(text)) {
    return <Text style={style}>{text}</Text>;
  }

  const segments = parseRubyText(text);

  return (
    <View style={styles.container}>
      {segments.map((segment, index) => {
        if (segment.type === 'ruby') {
          return (
            <View key={index} style={styles.rubyGroup}>
              <Text style={[styles.ruby, rubyStyle]}>{segment.ruby}</Text>
              <Text style={[styles.base, style]}>{segment.text}</Text>
            </View>
          );
        }
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
    justifyContent: 'center',
  },
  rubyGroup: {
    alignItems: 'center',
  },
  ruby: {
    fontSize: FontSizes.tiny,
    color: Colors.textSecondary,
    lineHeight: FontSizes.tiny + 2,
    textAlign: 'center',
  },
  base: {
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
  },
});
