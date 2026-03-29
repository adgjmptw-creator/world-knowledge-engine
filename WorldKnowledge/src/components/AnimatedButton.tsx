/**
 * AnimatedButton — アニメーション付きボタン
 *
 * タップ時にバウンスアニメーションが付いた子供向けボタン。
 * 押した感触を視覚的に伝えることで、5歳児でも操作しやすくする。
 */

import React, { useRef } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  Text,
} from 'react-native';
import { Colors, FontSizes, BorderRadius, Shadows, Spacing } from '../constants/theme';

interface AnimatedButtonProps {
  /** ボタンのラベルテキスト */
  label: string;
  /** タップ時のコールバック */
  onPress: () => void;
  /** ボタンの色（デフォルトはプライマリ） */
  color?: string;
  /** テキストの色（デフォルトは白） */
  textColor?: string;
  /** 無効状態 */
  disabled?: boolean;
  /** 追加のコンテナスタイル */
  style?: ViewStyle;
  /** テキストスタイル */
  textStyle?: TextStyle;
  /** アイコン（左側に表示するemoji等） */
  icon?: string;
  /** ボタンサイズ */
  size?: 'small' | 'medium' | 'large';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onPress,
  color = Colors.primary,
  textColor = Colors.textLight,
  disabled = false,
  style,
  textStyle,
  icon,
  size = 'medium',
}) => {
  // バウンスアニメーションの値
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /** タップ開始 — 縮小 */
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  /** タップ終了 — 元のサイズに戻る（バウンス付き） */
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  // サイズ別のパディング
  const sizeStyles = {
    small: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
    medium: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
    large: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
  };

  const fontSizes = {
    small: FontSizes.small,
    medium: FontSizes.button,
    large: FontSizes.title,
  };

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          sizeStyles[size],
          Shadows.medium,
          {
            backgroundColor: disabled ? Colors.disabled : color,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        <View style={styles.content}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text
            style={[
              styles.label,
              { fontSize: fontSizes[size], color: textColor },
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
});
