/**
 * ParentalAuthScreen — 保護者認証画面
 *
 * 保護者ダッシュボードへのアクセスを制限するための認証画面。
 * 一桁の掛け算を出題し、正答すればダッシュボードに遷移する。
 * 5歳児には解けないが大人なら簡単に答えられるレベル。
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnimatedButton } from '../components/AnimatedButton';
import { RubyText } from '../components/RubyText';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { currentLanguage } from '../i18n';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ParentalAuth'>;

export const ParentalAuthScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ランダムな一桁の掛け算を生成（2〜9の範囲、1は簡単すぎるため除外）
  const [a, b] = useMemo(() => {
    const numA = Math.floor(Math.random() * 8) + 2; // 2〜9
    const numB = Math.floor(Math.random() * 8) + 2; // 2〜9
    return [numA, numB];
  }, []);

  const correctAnswer = a * b;

  /** 送信ハンドラ */
  const handleSubmit = () => {
    const userAnswer = parseInt(inputValue, 10);
    if (userAnswer === correctAnswer) {
      // 正解 → ダッシュボードへ遷移
      navigation.replace('ParentalDashboard');
    } else {
      // 不正解 → エラーメッセージ表示
      setErrorMessage(t('parent.authError'));
      setInputValue('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* ロックアイコン */}
        <Text style={styles.lockEmoji}>🔒</Text>

        {/* タイトル */}
        <RubyText text={t('parent.authTitle')} style={styles.title} enableRuby={currentLanguage === 'ja'} />

        {/* 掛け算の問題 */}
        <RubyText
          text={t('parent.authQuestion', { a, b })}
          style={styles.question}
          enableRuby={currentLanguage === 'ja'}
        />

        {/* 回答入力欄 */}
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={(text) => {
            setInputValue(text);
            setErrorMessage('');
          }}
          keyboardType="number-pad"
          placeholder={t('parent.authPlaceholder')}
          placeholderTextColor={Colors.disabled}
          maxLength={3}
          autoFocus
        />

        {/* エラーメッセージ */}
        {errorMessage ? (
          <RubyText text={errorMessage} style={styles.error} enableRuby={currentLanguage === 'ja'} />
        ) : null}

        {/* 送信ボタン */}
        <AnimatedButton
          label={t('parent.authSubmit')}
          onPress={handleSubmit}
          color={Colors.primary}
          disabled={!inputValue}
          style={styles.submitButton}
        />

        {/* 戻るボタン */}
        <AnimatedButton
          label={t('parent.back')}
          onPress={() => navigation.goBack()}
          color={Colors.backgroundSecondary}
          textColor={Colors.textSecondary}
          size="small"
          style={styles.backButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    ...Shadows.medium,
  },
  lockEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: Spacing.lg,
  },
  question: {
    fontSize: FontSizes.hero,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  input: {
    width: '60%',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.title,
    textAlign: 'center',
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    marginBottom: Spacing.md,
  },
  error: {
    fontSize: FontSizes.body,
    color: Colors.red,
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
  backButton: {
    marginTop: Spacing.sm,
  },
});
