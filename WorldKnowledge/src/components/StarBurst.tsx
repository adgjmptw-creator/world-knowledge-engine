/**
 * StarBurst — 星のバーストアニメーション
 *
 * 正解時に星が中心から放射状に広がるアニメーション。
 * 紙吹雪とは別のパターンとして使い分け、毎回異なる演出を提供する。
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/theme';

interface StarBurstProps {
  /** アニメーション表示中かどうか */
  visible: boolean;
  /** 中心のX座標 */
  centerX?: number;
  /** 中心のY座標 */
  centerY?: number;
}

const STAR_COLORS = [Colors.yellow, Colors.accent, Colors.pink, Colors.green, Colors.purple];
const STAR_COUNT = 12;

export const StarBurst: React.FC<StarBurstProps> = ({
  visible,
  centerX = 0,
  centerY = 0,
}) => {
  // 各星のアニメーション値
  const animations = useRef(
    Array.from({ length: STAR_COUNT }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;

    // 各星を放射状に移動させる
    const starAnimations = animations.map((anim, index) => {
      // 星の角度（均等に配置）
      const angle = (index / STAR_COUNT) * 2 * Math.PI;
      const distance = 80 + Math.random() * 60; // 飛距離

      // リセット
      anim.scale.setValue(0);
      anim.translateX.setValue(0);
      anim.translateY.setValue(0);
      anim.opacity.setValue(1);

      return Animated.parallel([
        // 大きくなる
        Animated.spring(anim.scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 8,
          delay: index * 30,
        }),
        // 外側に移動
        Animated.timing(anim.translateX, {
          toValue: Math.cos(angle) * distance,
          duration: 600,
          delay: index * 30,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: Math.sin(angle) * distance,
          duration: 600,
          delay: index * 30,
          useNativeDriver: true,
        }),
        // フェードアウト
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 400,
          delay: 400 + index * 30,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(starAnimations).start();
  }, [visible, animations]);

  if (!visible) return null;

  return (
    <View style={[styles.container, { left: centerX, top: centerY }]} pointerEvents="none">
      {animations.map((anim, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.star,
            {
              color: STAR_COLORS[index % STAR_COLORS.length],
              transform: [
                { scale: anim.scale },
                { translateX: anim.translateX },
                { translateY: anim.translateY },
              ],
              opacity: anim.opacity,
            },
          ]}
        >
          ★
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  star: {
    position: 'absolute',
    fontSize: 24,
    textAlign: 'center',
  },
});
