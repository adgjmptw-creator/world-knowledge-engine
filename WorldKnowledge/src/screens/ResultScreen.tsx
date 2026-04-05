/**
 * ResultScreen — 結果カード画面
 *
 * クイズ回答後に表示される結果画面。出題と置き換わる形で遷移する。
 *
 * 正解時:
 * - 褒め言葉（毎回変化）+ アニメーション（紙吹雪/星など変化）
 *
 * 不正解時:
 * - 「おしい！」など励ましの言葉 + 即時フィードバック（どう考えれば良かったか）
 *
 * 構成要素:
 * 1. 結果ヘッダー（正解/不正解）
 * 2. 国旗＋国名カード（国旗、現地語国名、英語国名、音声再生ボタン）
 * 3. 豆知識セクション（最大2件、画像＋テキスト＋音声ボタン）
 * 4. アクションボタン（つぎへすすむ！/ やめる）
 *
 * 音声自動再生: 表示300ms後にTTS再生（現地語→英語、1回のみ）
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlagImage } from '../components/FlagImage';
import { RubyText } from '../components/RubyText';
import { ConfettiAnimation } from '../components/ConfettiAnimation';
import { StarBurst } from '../components/StarBurst';
import { AnimatedButton } from '../components/AnimatedButton';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows, AnimationDuration } from '../constants/theme';
import { speakCountryName, speakFunFact, stopSpeaking } from '../services/ttsService';
import { playCorrectSound, playIncorrectSound, playMasterSound } from '../services/soundService';
import { currentLanguage } from '../i18n';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

/** 正解時のアニメーションパターンをランダムに選択 */
type AnimationPattern = 'confetti' | 'stars';

export const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { question, answer, justMastered } = route.params;
  const country = question.correctCountry;
  const isCorrect = answer.isCorrect;

  // ランダムなフィードバックメッセージを選択
  const [feedbackMessage] = useState(() => {
    const messages = isCorrect
      ? (t('result.correct', { returnObjects: true }) as string[])
      : (t('result.incorrect', { returnObjects: true }) as string[]);
    return messages[Math.floor(Math.random() * messages.length)];
  });

  // アニメーションパターンを選択（マスター達成時は必ず紙吹雪）
  const [animPattern] = useState<AnimationPattern>(
    () => justMastered ? 'confetti' : (Math.random() > 0.5 ? 'confetti' : 'stars')
  );

  const [showAnimation, setShowAnimation] = useState(false);
  const masterScale = useRef(new Animated.Value(0)).current;
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // フェードインアニメーション
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0)).current;

  /** 現地語の国名を取得 */
  const localName = country.localizedNames[currentLanguage as keyof typeof country.localizedNames]
    || country.nameEn;

  /** 現地語の豆知識を取得（最大2件） */
  const funFacts = country.funFacts[currentLanguage as keyof typeof country.funFacts]
    || country.funFacts.en;

  // エントリーアニメーション
  useEffect(() => {
    // 結果ヘッダーのポップイン
    Animated.spring(headerScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 10,
      bounciness: 12,
      delay: 100,
    }).start();

    // カードのスライドイン
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 効果音を再生
    if (justMastered) {
      // マスター達成 → 特別なファンファーレ（正解音の代わり）
      playMasterSound();
    } else if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    // 正解の場合はお祝いアニメーションを表示
    if (isCorrect) {
      setTimeout(() => setShowAnimation(true), 200);
      setTimeout(() => setShowAnimation(false), justMastered ? 4000 : 2500);
    }

    // マスター達成バナーのポップインアニメーション（少し遅れて登場）
    if (justMastered) {
      Animated.spring(masterScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 6,
        bounciness: 15,
        delay: 600,
      }).start();
    }
  }, [fadeAnim, slideAnim, headerScale, isCorrect, justMastered, masterScale]);

  // 300ms後にTTS自動再生（1回のみ）
  useEffect(() => {
    if (hasAutoPlayed) return;

    const timer = setTimeout(async () => {
      setHasAutoPlayed(true);
      await speakCountryName(localName, country.nameEn, currentLanguage);
    }, AnimationDuration.ttsDelay);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [hasAutoPlayed, localName, country.nameEn]);

  /** 音声再生ボタンのハンドラ */
  const handleSpeakCountry = () => {
    speakCountryName(localName, country.nameEn, currentLanguage);
  };

  /** 豆知識の音声再生ハンドラ */
  const handleSpeakFunFact = (text: string) => {
    speakFunFact(text, currentLanguage);
  };

  /** つぎへすすむ */
  const handleNext = () => {
    stopSpeaking();
    navigation.replace('Quiz');
  };

  /** やめる（ホームに戻る） */
  const handleQuit = () => {
    stopSpeaking();
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* お祝いアニメーション */}
      {isCorrect && animPattern === 'confetti' && (
        <ConfettiAnimation visible={showAnimation} />
      )}
      {isCorrect && animPattern === 'stars' && (
        <StarBurst visible={showAnimation} centerX={180} centerY={120} />
      )}

      {/* === 1. 結果ヘッダー === */}
      <Animated.View
        style={[
          styles.headerContainer,
          isCorrect ? styles.headerCorrect : styles.headerIncorrect,
          { transform: [{ scale: headerScale }] },
        ]}
      >
        <Text style={styles.headerEmoji}>
          {isCorrect ? '🎉' : '💪'}
        </Text>
        <RubyText
          text={feedbackMessage}
          style={{
            ...styles.headerText,
            ...(isCorrect ? styles.headerTextCorrect : styles.headerTextIncorrect),
          }}
          enableRuby={currentLanguage === 'ja'}
        />
      </Animated.View>

      {/* === マスター達成バナー === */}
      {justMastered && (
        <Animated.View
          style={[
            styles.masterBanner,
            { transform: [{ scale: masterScale }] },
          ]}
        >
          <Text style={styles.masterEmoji}>⭐🏆⭐</Text>
          <RubyText
            text={t('result.mastered', { country: localName })}
            style={styles.masterText}
            enableRuby={currentLanguage === 'ja'}
          />
        </Animated.View>
      )}

      {/* === 2. 国旗＋国名カード === */}
      <Animated.View
        style={[
          styles.countryCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <FlagImage
          emoji={country.flag.emoji}
          width={160}
          height={107}
        />
        <View style={styles.countryNameContainer}>
          <RubyText
            text={localName}
            style={styles.countryNameLocal}
            enableRuby={currentLanguage === 'ja'}
          />
          <Text style={styles.countryNameEn}>{country.nameEn}</Text>
        </View>
        {/* 音声再生ボタン */}
        <TouchableOpacity
          style={styles.speakButton}
          onPress={handleSpeakCountry}
        >
          <Text style={styles.speakIcon}>🔊</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* === 不正解時の即時フィードバック === */}
      {!isCorrect && (
        <Animated.View
          style={[
            styles.hintCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.hintTitle}>💡</Text>
          <RubyText text={t('result.correctFlag', { country: localName })} style={styles.hintText} enableRuby={currentLanguage === 'ja'} containerStyle={{ flex: 1 }} />
        </Animated.View>
      )}

      {/* === 3. 豆知識セクション === */}
      {funFacts.map((fact, index) => (
        <Animated.View
          key={index}
          style={[
            styles.funFactCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.funFactHeader}>
            <RubyText text={`${t('result.funFact')} ${index + 1}`} style={styles.funFactLabel} enableRuby={currentLanguage === 'ja'} />
            <TouchableOpacity
              style={styles.funFactSpeakButton}
              onPress={() => handleSpeakFunFact(fact)}
            >
              <Text style={styles.speakIcon}>🔊</Text>
            </TouchableOpacity>
          </View>
          <RubyText
            text={fact}
            style={styles.funFactText}
            enableRuby={currentLanguage === 'ja'}
          />
        </Animated.View>
      ))}

      {/* === 4. アクションボタン === */}
      <View style={styles.actionButtons}>
        <AnimatedButton
          label={t('result.nextQuestion')}
          onPress={handleNext}
          color={Colors.green}
          size="large"
          icon="➡️"
          style={styles.nextButton}
        />
        <AnimatedButton
          label={t('result.quit')}
          onPress={handleQuit}
          color={Colors.disabled}
          textColor={Colors.textSecondary}
          size="small"
          style={styles.quitButton}
        />
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
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  // --- マスター達成バナー ---
  masterBanner: {
    backgroundColor: Colors.yellow + '30',
    borderRadius: BorderRadius.lg,
    borderWidth: 3,
    borderColor: Colors.yellow,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.medium,
  },
  masterEmoji: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  masterText: {
    fontSize: FontSizes.subtitle,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  // --- 結果ヘッダー ---
  headerContainer: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.medium,
  },
  headerCorrect: {
    backgroundColor: Colors.green + '25',
    borderWidth: 3,
    borderColor: Colors.green,
  },
  headerIncorrect: {
    backgroundColor: Colors.accent + '25',
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  headerText: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTextCorrect: {
    color: Colors.green,
  },
  headerTextIncorrect: {
    color: Colors.accent,
  },
  // --- 国旗＋国名カード ---
  countryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
    ...Shadows.light,
  },
  countryNameContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
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
  speakButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: BorderRadius.full,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakIcon: {
    fontSize: 22,
  },
  // --- 不正解時のヒント ---
  hintCard: {
    backgroundColor: Colors.yellow + '30',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintTitle: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  hintText: {
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  // --- 豆知識カード ---
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
  funFactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  funFactLabel: {
    fontSize: FontSizes.small,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  funFactSpeakButton: {
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: BorderRadius.full,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  funFactText: {
    fontSize: FontSizes.funFact,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  // --- アクションボタン ---
  actionButtons: {
    width: '100%',
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
  quitButton: {
    marginTop: Spacing.sm,
  },
});
