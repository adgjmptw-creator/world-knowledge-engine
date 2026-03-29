/**
 * HomeScreen — ホーム画面
 *
 * アプリのメイン画面。5歳児が直感的に操作できるよう、
 * 大きなボタンとカラフルなデザインで構成。
 *
 * 構成要素:
 * - アプリタイトル（アニメーション付き）
 * - クイズ開始ボタン（メイン）
 * - たんけんマップボタン
 * - ずかんボタン
 * - 保護者ダッシュボードボタン（小さめ）
 * - スペシャルチャレンジボタン（全国旗コンプリート後のみ表示）
 * - 学習進捗の簡易表示
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnimatedButton } from '../components/AnimatedButton';
import { RubyText } from '../components/RubyText';
import { ConfettiAnimation } from '../components/ConfettiAnimation';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { loadUserProgress } from '../services/storageService';
import { currentLanguage } from '../i18n';
import { UserProgress, RootStackParamList } from '../types';
import { getAllCountries } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // タイトルのバウンスアニメーション
  const titleBounce = useRef(new Animated.Value(0)).current;
  // 地球emojiの回転アニメーション
  const globeRotation = useRef(new Animated.Value(0)).current;
  // ボタンの順次フェードインアニメーション
  const buttonOpacities = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // 画面フォーカス時に進捗を再読み込み
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const p = await loadUserProgress();
      setProgress(p);
    });
    return unsubscribe;
  }, [navigation]);

  // 初回ロードアニメーション
  useEffect(() => {
    // タイトルのバウンス
    Animated.spring(titleBounce, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 15,
    }).start();

    // 地球の回転（ゆっくり継続）
    Animated.loop(
      Animated.timing(globeRotation, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

    // ボタンの順次フェードイン
    const staggerAnimations = buttonOpacities.map((opacity, index) =>
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: 300 + index * 150,
        useNativeDriver: true,
      })
    );
    Animated.stagger(150, staggerAnimations).start();
  }, [titleBounce, globeRotation, buttonOpacities]);

  const countries = getAllCountries();
  const masteredCount = progress
    ? Object.values(progress.countryStates).filter(s => s.isMastered).length
    : 0;

  /** 地球emojiの回転補間 */
  const globeSpin = globeRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* お祝い紙吹雪（全コンプリート時） */}
      <ConfettiAnimation visible={showConfetti} />

      {/* === アプリタイトル部分 === */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            transform: [
              { scale: titleBounce },
            ],
          },
        ]}
      >
        {/* 回転する地球emoji */}
        <Animated.Text
          style={[
            styles.globe,
            { transform: [{ rotate: globeSpin }] },
          ]}
        >
          🌍
        </Animated.Text>
        <RubyText text={t('app.title')} style={styles.title} enableRuby={currentLanguage === 'ja'} />
        <RubyText text={t('app.subtitle')} style={styles.subtitle} enableRuby={currentLanguage === 'ja'} />
      </Animated.View>

      {/* === 学習進捗バー === */}
      {progress && (
        <View style={styles.progressContainer}>
          <RubyText text={t('home.countriesMastered', { count: masteredCount })} style={styles.progressText} enableRuby={currentLanguage === 'ja'} />
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(
                    (masteredCount / countries.length) * 100,
                    100
                  )}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressDetail}>
            {masteredCount} / {countries.length}
          </Text>
        </View>
      )}

      {/* === メインボタン群 === */}
      <View style={styles.buttonsContainer}>
        {/* クイズ開始（メインアクション） */}
        <Animated.View style={{ opacity: buttonOpacities[0] }}>
          <AnimatedButton
            label={t('home.startQuiz')}
            onPress={() => navigation.navigate('Quiz')}
            color={Colors.accent}
            size="large"
            icon="🎯"
            style={styles.mainButton}
          />
        </Animated.View>

        {/* スペシャルチャレンジ（全コンプリート後のみ） */}
        {progress?.allFlagsCompleted && (
          <Animated.View style={{ opacity: buttonOpacities[1] }}>
            <AnimatedButton
              label={t('home.specialChallenge')}
              onPress={() => {
                setShowConfetti(true);
                setTimeout(() => {
                  setShowConfetti(false);
                  navigation.navigate('SpecialChallenge');
                }, 1500);
              }}
              color={Colors.purple}
              size="large"
              icon="⭐"
              style={styles.specialButton}
            />
          </Animated.View>
        )}

        {/* 2列ボタン: たんけんマップ & ずかん */}
        <View style={styles.buttonRow}>
          <Animated.View style={[styles.halfButton, { opacity: buttonOpacities[2] }]}>
            <AnimatedButton
              label={t('home.explorationMap')}
              onPress={() => navigation.navigate('ExplorationMap')}
              color={Colors.green}
              icon="🗺️"
              style={styles.gridButton}
            />
          </Animated.View>
          <Animated.View style={[styles.halfButton, { opacity: buttonOpacities[3] }]}>
            <AnimatedButton
              label={t('home.encyclopedia')}
              onPress={() => navigation.navigate('Encyclopedia')}
              color={Colors.primaryLight}
              icon="📖"
              style={styles.gridButton}
            />
          </Animated.View>
        </View>

        {/* 保護者ダッシュボード（控えめなデザイン） */}
        <Animated.View style={{ opacity: buttonOpacities[4] }}>
          <AnimatedButton
            label={t('home.parentDashboard')}
            onPress={() => navigation.navigate('ParentalAuth')}
            color={Colors.backgroundSecondary}
            textColor={Colors.textSecondary}
            size="small"
            icon="🔒"
            style={styles.parentButton}
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  globe: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.hero,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.subtitle,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.light,
  },
  progressText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 6,
  },
  progressDetail: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mainButton: {
    width: SCREEN_WIDTH - Spacing.lg * 2,
    marginBottom: Spacing.md,
  },
  specialButton: {
    width: SCREEN_WIDTH - Spacing.lg * 2,
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.yellow,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.md,
  },
  halfButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  gridButton: {
    width: '100%',
    minHeight: 70,
  },
  parentButton: {
    marginTop: Spacing.lg,
  },
});
