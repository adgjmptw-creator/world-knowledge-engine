/**
 * SpecialChallengeScreen — スペシャルチャレンジ画面
 *
 * 全国旗コンプリート後に解放される上級モード。
 * 豆知識をヒントとして表示し、「この国はどこだ？」と問いかけ、
 * 4つの国旗から正解を選ばせる。
 *
 * 仕様:
 * - 豆知識テキストを表示（TTS読み上げ対応）
 * - 4つの国旗選択肢を表示
 * - 回答後はResultScreenと同様のフィードバック
 * - 正答した国は探検マップに特別マークを表示
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlagImage } from '../components/FlagImage';
import { AnimatedButton } from '../components/AnimatedButton';
import { RubyText } from '../components/RubyText';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { generateSpecialChallengeQuestion, processAnswer } from '../services/quizEngine';
import { loadUserProgress, saveUserProgress } from '../services/storageService';
import { speakFunFact, stopSpeaking } from '../services/ttsService';
import { currentLanguage } from '../i18n';
import { QuizQuestion, UserProgress, RootStackParamList, CountryData } from '../types';
import { getAllCountries } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'SpecialChallenge'>;

export const SpecialChallengeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [funFact, setFunFact] = useState<string>('');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [allCleared, setAllCleared] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const countries = getAllCountries();

  /** 新しい問題を読み込む */
  const loadQuestion = useCallback(async () => {
    const p = await loadUserProgress();
    setProgress(p);

    const result = generateSpecialChallengeQuestion(countries, p, currentLanguage);
    if (!result) {
      // すべてのスペシャルチャレンジをクリア
      setAllCleared(true);
      return;
    }

    setQuestion(result.question);
    setFunFact(result.funFact);
    setQuestionStartTime(Date.now());
    setSelectedId(null);

    // フェードインアニメーション
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // 豆知識を自動読み上げ
    setTimeout(() => {
      speakFunFact(result.funFact, currentLanguage);
    }, 500);
  }, [countries, fadeAnim]);

  useEffect(() => {
    loadQuestion();
    return () => stopSpeaking();
  }, [loadQuestion]);

  /** 選択肢をタップ */
  const handleChoiceSelect = async (selected: CountryData) => {
    if (!question || !progress || selectedId) return;

    setSelectedId(selected.id);
    const responseTimeMs = Date.now() - questionStartTime;
    const isCorrect = selected.id === question.correctCountry.id;

    // 進捗を更新
    const { updatedProgress, answer } = processAnswer(
      progress,
      question,
      selected.id,
      responseTimeMs,
      countries.length
    );

    // スペシャルチャレンジのクリア状態を更新
    if (isCorrect && updatedProgress.countryStates[question.correctCountry.id]) {
      updatedProgress.countryStates[question.correctCountry.id].specialChallengeCleared = true;
      updatedProgress.specialChallengeProgress.clearedCount += 1;

      // 全スペシャルチャレンジクリアチェック
      const totalMastered = Object.values(updatedProgress.countryStates)
        .filter(s => s.isMastered).length;
      const totalSpecialCleared = Object.values(updatedProgress.countryStates)
        .filter(s => s.specialChallengeCleared).length;
      if (totalSpecialCleared >= totalMastered) {
        updatedProgress.specialChallengeProgress.allCleared = true;
      }
    }

    await saveUserProgress(updatedProgress);

    setTimeout(() => {
      navigation.navigate('SpecialChallengeResult', {
        question,
        answer,
        funFactUsed: funFact,
      });
    }, 300);
  };

  // 全クリア画面
  if (allCleared) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎊🏆🎊</Text>
        <RubyText text={t('special.completed')} style={styles.completedTitle} enableRuby={currentLanguage === 'ja'} />
        <AnimatedButton
          label={t('parent.back')}
          onPress={() => navigation.navigate('Home')}
          color={Colors.primary}
          size="large"
        />
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ヘッダー */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerEmoji}>⭐</Text>
        <RubyText text={t('special.title')} style={styles.headerTitle} enableRuby={currentLanguage === 'ja'} />
      </Animated.View>

      {/* 豆知識ヒントカード */}
      <Animated.View style={[styles.funFactCard, { opacity: fadeAnim }]}>
        <RubyText text={funFact} style={styles.funFactText} enableRuby={currentLanguage === 'ja'} />
        <TouchableOpacity
          style={styles.speakButton}
          onPress={() => speakFunFact(funFact, currentLanguage)}
        >
          <Text style={styles.speakIcon}>🔊</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 問い */}
      <RubyText text={t('special.whichCountry')} style={styles.questionText} enableRuby={currentLanguage === 'ja'} />

      {/* 4つの国旗選択肢 */}
      <View style={styles.choicesGrid}>
        {question.choices.map((choice) => (
          <TouchableOpacity
            key={choice.id}
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
              width={130}
              height={87}
              showShadow={false}
            />
          </TouchableOpacity>
        ))}
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  completedEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  completedTitle: {
    fontSize: FontSizes.hero,
    fontWeight: 'bold',
    color: Colors.purple,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
  },
  headerTitle: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.purple,
  },
  funFactCard: {
    backgroundColor: Colors.purple + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.purple + '40',
    flexDirection: 'row',
    alignItems: 'center',
  },
  funFactText: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  speakButton: {
    backgroundColor: Colors.purple + '30',
    borderRadius: BorderRadius.full,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  speakIcon: {
    fontSize: 22,
  },
  questionText: {
    fontSize: FontSizes.subtitle,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  choiceButton: {
    width: '46%',
    aspectRatio: 1.3,
    margin: '2%',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    ...Shadows.light,
  },
  choiceSelected: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purple + '15',
  },
});
