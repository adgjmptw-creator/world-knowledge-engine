/**
 * FlagImage — 国旗表示コンポーネント
 *
 * 国旗のemoji表示を行う汎用コンポーネント。
 * 将来的にSVGファイルへの切り替えも容易な設計。
 * 一貫したサイズ・スタイルで国旗を表示する。
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows } from '../constants/theme';

interface FlagImageProps {
  /** 国旗emoji（例: "🇯🇵"） */
  emoji: string;
  /** 表示幅 */
  width?: number;
  /** 表示高さ */
  height?: number;
  /** 追加スタイル */
  style?: ViewStyle;
  /** 影を表示するかどうか */
  showShadow?: boolean;
}

/**
 * 国旗を統一されたスタイルで表示する
 * emojiベースで表示し、角丸と影でカード風に見せる
 */
export const FlagImage: React.FC<FlagImageProps> = ({
  emoji,
  width = 120,
  height = 80,
  style,
  showShadow = true,
}) => {
  // emojiのフォントサイズを表示エリアに合わせて計算
  const fontSize = Math.min(width, height) * 0.7;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
        },
        showShadow && Shadows.light,
        style,
      ]}
    >
      <Text style={[styles.emoji, { fontSize }]}>{emoji}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  emoji: {
    textAlign: 'center',
  },
});
