/**
 * ConfettiAnimation — 紙吹雪アニメーション
 *
 * 正解時やコンプリート時に表示するお祝いアニメーション。
 * Animated APIを使用し、カラフルな円形パーティクルを降らせる。
 * パフォーマンスを考慮してuseNativeDriverを使用。
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, StyleSheet, Dimensions, View } from 'react-native';
import { Colors } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** 紙吹雪1粒のデータ */
interface ConfettiPiece {
  /** 水平位置のアニメーション値 */
  x: Animated.Value;
  /** 垂直位置のアニメーション値 */
  y: Animated.Value;
  /** 回転アニメーション値 */
  rotation: Animated.Value;
  /** 透明度アニメーション値 */
  opacity: Animated.Value;
  /** 色 */
  color: string;
  /** サイズ */
  size: number;
  /** 初期X位置 */
  startX: number;
}

interface ConfettiAnimationProps {
  /** アニメーションが表示中かどうか */
  visible: boolean;
  /** 紙吹雪の数（デフォルト30個） */
  count?: number;
  /** アニメーション時間（ms） */
  duration?: number;
}

/** 紙吹雪の色リスト */
const CONFETTI_COLORS = [
  Colors.yellow, Colors.pink, Colors.green,
  Colors.primary, Colors.accent, Colors.purple,
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
];

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  visible,
  count = 30,
  duration = 2000,
}) => {
  // 紙吹雪の各粒を生成
  const pieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: count }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotation: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 8 + Math.random() * 12,
      startX: Math.random() * SCREEN_WIDTH,
    }));
  }, [count]);

  useEffect(() => {
    if (!visible) return;

    // 全紙吹雪のアニメーションを開始
    const animations = pieces.map((piece) => {
      // 値をリセット
      piece.y.setValue(-50);
      piece.x.setValue(0);
      piece.rotation.setValue(0);
      piece.opacity.setValue(1);

      // ランダムな遅延で自然に見せる
      const delay = Math.random() * 500;

      return Animated.parallel([
        // Y軸: 上から下へ落下
        Animated.timing(piece.y, {
          toValue: SCREEN_HEIGHT + 50,
          duration: duration + Math.random() * 1000,
          delay,
          useNativeDriver: true,
        }),
        // X軸: 左右に揺れる
        Animated.timing(piece.x, {
          toValue: (Math.random() - 0.5) * 200,
          duration: duration + Math.random() * 1000,
          delay,
          useNativeDriver: true,
        }),
        // 回転
        Animated.timing(piece.rotation, {
          toValue: Math.random() * 10 - 5,
          duration: duration,
          delay,
          useNativeDriver: true,
        }),
        // フェードアウト（後半で透明に）
        Animated.timing(piece.opacity, {
          toValue: 0,
          duration: duration * 0.8,
          delay: delay + duration * 0.5,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start();
  }, [visible, pieces, duration]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.piece,
            {
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              borderRadius: piece.size / 2,
              left: piece.startX,
              transform: [
                { translateY: piece.y },
                { translateX: piece.x },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [-5, 5],
                    outputRange: ['-180deg', '180deg'],
                  }),
                },
              ],
              opacity: piece.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000, // 他のUIの上に表示
  },
  piece: {
    position: 'absolute',
    top: 0,
  },
});
