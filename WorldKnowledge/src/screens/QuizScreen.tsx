/**
 * QuizScreen — クイズ画面
 *
 * 国名を表示し、4つの国旗選択肢から正解を選ばせるメイン画面。
 *
 * 仕様:
 * - 国名を現地語（日本語はルビ付き）＋英語名で表示
 * - 4つの国旗をシャッフル表示（正解1 + 不正解3）
 * - 回答時間を計測し、Brainscape自信度の自動判定に使用
 * - タップ後は結果画面（ResultScreen）に遷移
 * - 適応的難易度調整により85%正答率を維持
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlagImage } from '../components/FlagImage';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { generateQuestion, processAnswer } from '../services/quizEngine';
import { loadUserProgress, saveUserProgress } from '../services/storageService';
import { usePlayTime } from '../hooks/usePlayTime';
import { currentLanguage } from '../i18n';
import { QuizQuestion, UserProgress, RootStackParamList, CountryData } from '../types';
import { getAllCountries } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const QuizScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // カードのフェードインアニメーション
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // 選択肢のスケールアニメーション
  const choiceScales = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const countries = getAllCountries();

  // プレイ時間管理
  const { isLimited } = usePlayTime({
    onTimeLimitReached: () => {
      navigation.replace('Home');
    },
  });

  /** 新しい問題を読み込む */
  const loadNewQuestion = useCallback(async () => {
    const p = await loadUserProgress();
    setProgress(p);
    const q = generateQuestion(countries, p);
    setQuestion(q);
    setQuestionStartTime(Date.now());
    setSelectedId(null);

    // アニメーションリセット＆再生
    fadeAnim.setValue(0);
    choiceScales.forEach(s => s.setValue(0));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 選択肢を順次ポップイン
    Animated.stagger(
      100,
      choiceScales.map(scale =>
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 8,
        })
      )
    ).start();
  }, [countries, fadeAnim, choiceScales]);

  // 初回ロード
  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  /** 選択肢をタップした時の処理 */
  const handleChoiceSelect = async (selected: CountryData) => {
    if (!question || !progress || selectedId) return; // 二重タップ防止

    setSelectedId(selected.id);
    const responseTimeMs = Date.now() - questionStartTime;

    // 回答を処理して進捗を更新
    const { updatedProgress, answer } = processAnswer(
      progress,
      question,
      selected.id,
      responseTimeMs,
      countries.length
    );

    // 進捗を保存
    await saveUserProgress(updatedProgress);

    // 少し待ってから結果画面に遷移（タップアニメーションが見えるように）
    setTimeout(() => {
      navigation.navigate('Result', { question, answer });
    }, 300);
  };

  /** 現地語での国名取得 */
  const getLocalizedName = (country: CountryData): string => {
    const langKey = currentLanguage as keyof typeof country.localizedNames;
    return country.localizedNames[langKey] || country.nameEn;
  };

  if (!question || isLimited) {
    if (isLimited) {
      return (
        <View style={styles.limitContainer}>
          <Text style={styles.limitEmoji}>⏰</Text>
          <Text style={styles.limitText}>{t('common.timeLimitReached')}</Text>
        </View>
      );
    }
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
        {/* 問題ヘッダー */}
        <Text style={styles.questionLabel}>{t('quiz.question')}</Text>

        {/* 国名表示: 現地語 + 英語 */}
        <Text style={styles.countryNameLocal}>
          {getLocalizedName(question.correctCountry)}
        </Text>
        {/* 日本語の場合はふりがなも表示 */}
        {currentLanguage === 'ja' && question.correctCountry.furigana && (
          <Text style={styles.furigana}>
            {question.correctCountry.furigana}
          </Text>
        )}
        <Text style={styles.countryNameEn}>
          {question.correctCountry.nameEn}
        </Text>
      </Animated.View>

      {/* 4つの国旗選択肢（2×2グリッド） */}
      <View style={styles.choicesGrid}>
        {question.choices.map((choice, index) => (
          <Animated.View
            key={choice.id}
            style={[
              styles.choiceWrapper,
              { transform: [{ scale: choiceScales[index] }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.choiceButton,
                selectedId === choice.id && styles.choiceSelected,
              ]}
              onPress={() => handleChoiceSelect(choice)}
              activeOpacity={0.7}
              disabled={!!selectedId}
            >
              <FlagImage
                emoji={choice.flag.emoji}
                width={SCREEN_WIDTH * 0.35}
                height={(SCREEN_WIDTH * 0.35) * 0.67}
                showShadow={false}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* タップ促進テキスト */}
      <Text style={styles.hintText}>{t('quiz.tapToSelect')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  limitContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  limitEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  limitText: {
    fontSize: FontSizes.subtitle,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.lg,
    ...Shadows.light,
  },
  questionLabel: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  countryNameLocal: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  furigana: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countryNameEn: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  choiceWrapper: {
    width: '48%',
    aspectRatio: 1.3,
    margin: '1%',
  },
  choiceButton: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    ...Shadows.light,
  },
  choiceSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  hintText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    fontWeight: '500',
  },
});
