/**
 * SpecialChallengeResultScreen — スペシャルチャレンジ結果画面
 *
 * スペシャルチャレンジの回答結果を表示する。
 * ResultScreenと同様の構成だが、使用した豆知識ヒントも表示する。
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlagImage } from '../components/FlagImage';
import { ConfettiAnimation } from '../components/ConfettiAnimation';
import { AnimatedButton } from '../components/AnimatedButton';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows, AnimationDuration } from '../constants/theme';
import { speakCountryName, speakFunFact, stopSpeaking } from '../services/ttsService';
import { currentLanguage } from '../i18n';
import { RootStackParamList } from '../types';
import { Animated } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'SpecialChallengeResult'>;

export const SpecialChallengeResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { question, answer, funFactUsed } = route.params;
  const country = question.correctCountry;
  const isCorrect = answer.isCorrect;

  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0)).current;

  const [feedbackMessage] = useState(() => {
    const messages = isCorrect
      ? (t('result.correct', { returnObjects: true }) as string[])
      : (t('result.incorrect', { returnObjects: true }) as string[]);
    return messages[Math.floor(Math.random() * messages.length)];
  });

  const localName = country.localizedNames[currentLanguage as keyof typeof country.localizedNames]
    || country.nameEn;

  const funFacts = country.funFacts[currentLanguage as keyof typeof country.funFacts]
    || country.funFacts.en;

  useEffect(() => {
    Animated.spring(headerScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 10,
      bounciness: 12,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    }).start();

    if (isCorrect) {
      setTimeout(() => setShowConfetti(true), 200);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [fadeAnim, headerScale, isCorrect]);

  useEffect(() => {
    if (hasAutoPlayed) return;
    const timer = setTimeout(async () => {
      setHasAutoPlayed(true);
      await speakCountryName(localName, country.nameEn, currentLanguage);
    }, AnimationDuration.ttsDelay);
    return () => { clearTimeout(timer); stopSpeaking(); };
  }, [hasAutoPlayed, localName, country.nameEn]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ConfettiAnimation visible={showConfetti} />

      {/* 結果ヘッダー */}
      <Animated.View
        style={[
          styles.header,
          isCorrect ? styles.headerCorrect : styles.headerIncorrect,
          { transform: [{ scale: headerScale }] },
        ]}
      >
        <Text style={styles.headerEmoji}>{isCorrect ? '⭐' : '💪'}</Text>
        <Text style={[
          styles.headerText,
          isCorrect ? { color: Colors.purple } : { color: Colors.accent },
        ]}>
          {feedbackMessage}
        </Text>
      </Animated.View>

      {/* 国旗＋国名 */}
      <Animated.View style={[styles.countryCard, { opacity: fadeAnim }]}>
        <FlagImage emoji={country.flag.emoji} width={160} height={107} />
        <Text style={styles.countryNameLocal}>{localName}</Text>
        {currentLanguage === 'ja' && country.furigana && (
          <Text style={styles.furigana}>{country.furigana}</Text>
        )}
        <Text style={styles.countryNameEn}>{country.nameEn}</Text>
        <TouchableOpacity
          style={styles.speakButton}
          onPress={() => speakCountryName(localName, country.nameEn, currentLanguage)}
        >
          <Text style={styles.speakIcon}>🔊</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 使用した豆知識ヒント */}
      <Animated.View style={[styles.hintCard, { opacity: fadeAnim }]}>
        <Text style={styles.hintLabel}>💡 {t('result.hint', { hint: '' }).replace('{{hint}}', '').trim()}</Text>
        <Text style={styles.hintText}>{funFactUsed}</Text>
      </Animated.View>

      {/* 豆知識セクション */}
      {funFacts.map((fact, index) => (
        <Animated.View key={index} style={[styles.funFactCard, { opacity: fadeAnim }]}>
          <View style={styles.funFactHeader}>
            <Text style={styles.funFactLabel}>{t('result.funFact')} {index + 1}</Text>
            <TouchableOpacity
              style={styles.funFactSpeakBtn}
              onPress={() => speakFunFact(fact, currentLanguage)}
            >
              <Text style={styles.speakIcon}>🔊</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.funFactText}>{fact}</Text>
        </Animated.View>
      ))}

      {/* アクションボタン */}
      <View style={styles.actions}>
        <AnimatedButton
          label={t('result.nextQuestion')}
          onPress={() => { stopSpeaking(); navigation.replace('SpecialChallenge'); }}
          color={Colors.purple}
          size="large"
          icon="⭐"
          style={styles.nextButton}
        />
        <AnimatedButton
          label={t('result.quit')}
          onPress={() => { stopSpeaking(); navigation.navigate('Home'); }}
          color={Colors.disabled}
          textColor={Colors.textSecondary}
          size="small"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadows.light,
  },
  headerCorrect: {
    backgroundColor: Colors.purple + '20',
    borderWidth: 2,
    borderColor: Colors.purple,
  },
  headerIncorrect: {
    backgroundColor: Colors.accent + '20',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  headerEmoji: { fontSize: 40, marginBottom: Spacing.xs },
  headerText: { fontSize: FontSizes.title, fontWeight: 'bold', textAlign: 'center' },
  countryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
    ...Shadows.light,
  },
  countryNameLocal: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  furigana: { fontSize: FontSizes.small, color: Colors.textSecondary, marginTop: 2 },
  countryNameEn: { fontSize: FontSizes.body, color: Colors.textSecondary, marginTop: Spacing.xs },
  speakButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: BorderRadius.full,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakIcon: { fontSize: 22 },
  hintCard: {
    backgroundColor: Colors.purple + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.purple,
  },
  hintLabel: { fontSize: FontSizes.small, fontWeight: 'bold', color: Colors.purple, marginBottom: Spacing.xs },
  hintText: { fontSize: FontSizes.body, color: Colors.textPrimary, lineHeight: 24 },
  funFactCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadows.light,
  },
  funFactHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  funFactLabel: { fontSize: FontSizes.small, fontWeight: 'bold', color: Colors.primary },
  funFactSpeakBtn: {
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: BorderRadius.full,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  funFactText: { fontSize: FontSizes.funFact, color: Colors.textPrimary, lineHeight: 24 },
  actions: { width: '100%', marginTop: Spacing.lg, alignItems: 'center' },
  nextButton: { width: '100%', marginBottom: Spacing.sm },
});
