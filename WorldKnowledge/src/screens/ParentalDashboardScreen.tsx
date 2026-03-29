/**
 * ParentalDashboardScreen — 保護者ダッシュボード画面
 *
 * 保護者が子供の学習進捗を確認し、プレイ時間を管理する。
 *
 * 構成:
 * - 学習レポート（2×2グリッド）
 *   - マスターした国数
 *   - ニガテな国リスト
 *   - 総回答数
 *   - 正答率
 * - プレイ時間制限設定（スライドバー）
 *   - 1分〜120分（無制限）
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnimatedButton } from '../components/AnimatedButton';
import { FlagImage } from '../components/FlagImage';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import {
  loadUserProgress,
  loadParentalSettings,
  saveParentalSettings,
  resetAllData,
} from '../services/storageService';
import { UserProgress, ParentalSettings, RootStackParamList, CountryData } from '../types';
import { getAllCountries } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'ParentalDashboard'>;

export const ParentalDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [settings, setSettings] = useState<ParentalSettings | null>(null);
  /** リセット確認モード */
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetAnswer, setResetAnswer] = useState('');
  const [resetError, setResetError] = useState('');
  /** リセット用の掛け算（2〜9） */
  const [resetA, resetB] = useMemo(() => {
    return [Math.floor(Math.random() * 8) + 2, Math.floor(Math.random() * 8) + 2];
  }, [showResetConfirm]);
  const [timeLimit, setTimeLimit] = useState(0);

  const countries = getAllCountries();

  useEffect(() => {
    (async () => {
      const p = await loadUserProgress();
      const s = await loadParentalSettings();
      setProgress(p);
      setSettings(s);
      setTimeLimit(s.dailyTimeLimitMinutes);
    })();
  }, []);

  /** マスター済みの国リスト */
  const masteredCountries: CountryData[] = progress
    ? countries.filter(c => progress.countryStates[c.id]?.isMastered)
    : [];

  /** ニガテな国リスト（不正解率が高い上位10国） */
  const weakCountries: CountryData[] = progress
    ? countries
        .filter(c => {
          const state = progress.countryStates[c.id];
          return state && state.incorrectCount > 0;
        })
        .sort((a, b) => {
          const stateA = progress.countryStates[a.id];
          const stateB = progress.countryStates[b.id];
          const ratioA = stateA.incorrectCount / (stateA.correctCount + stateA.incorrectCount);
          const ratioB = stateB.incorrectCount / (stateB.correctCount + stateB.incorrectCount);
          return ratioB - ratioA;
        })
        .slice(0, 10)
    : [];

  /** プレイ時間制限変更ハンドラ */
  const handleTimeLimitChange = async (value: number) => {
    const roundedValue = Math.round(value);
    setTimeLimit(roundedValue);
    const newSettings: ParentalSettings = {
      ...settings!,
      dailyTimeLimitMinutes: roundedValue >= 120 ? 0 : roundedValue,
    };
    setSettings(newSettings);
    await saveParentalSettings(newSettings);
  };

  /** リセット実行ハンドラ */
  const handleResetSubmit = async () => {
    const answer = parseInt(resetAnswer, 10);
    if (answer === resetA * resetB) {
      await resetAllData();
      setShowResetConfirm(false);
      setResetAnswer('');
      setResetError('');
      Alert.alert(t('parent.resetComplete'));
      // ホームに戻る
      navigation.navigate('Home');
    } else {
      setResetError(t('parent.authError'));
      setResetAnswer('');
    }
  };

  /** 今日のプレイ時間（分） */
  const todayPlayMinutes = progress
    ? Math.round(progress.todayPlayTimeMs / 60000)
    : 0;

  /** 正答率（パーセント） */
  const accuracyPercent = progress
    ? Math.round(progress.overallAccuracy * 100)
    : 0;

  if (!progress || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* タイトル */}
      <Text style={styles.title}>{t('parent.dashboardTitle')}</Text>

      {/* 学習レポート 2×2グリッド */}
      <View style={styles.statsGrid}>
        {/* マスターした国 */}
        <View style={[styles.statCard, { borderLeftColor: Colors.green }]}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={styles.statValue}>{masteredCountries.length}</Text>
          <Text style={styles.statLabel}>{t('parent.masteredCountries')}</Text>
        </View>
        {/* ニガテな国 */}
        <View style={[styles.statCard, { borderLeftColor: Colors.accent }]}>
          <Text style={styles.statEmoji}>📝</Text>
          <Text style={styles.statValue}>{weakCountries.length}</Text>
          <Text style={styles.statLabel}>{t('parent.weakCountries')}</Text>
        </View>
        {/* 総回答数 */}
        <View style={[styles.statCard, { borderLeftColor: Colors.primary }]}>
          <Text style={styles.statEmoji}>🎯</Text>
          <Text style={styles.statValue}>{progress.totalQuestionsAnswered}</Text>
          <Text style={styles.statLabel}>{t('parent.totalAnswered')}</Text>
        </View>
        {/* 正答率 */}
        <View style={[styles.statCard, { borderLeftColor: Colors.purple }]}>
          <Text style={styles.statEmoji}>📊</Text>
          <Text style={styles.statValue}>{accuracyPercent}%</Text>
          <Text style={styles.statLabel}>{t('parent.accuracy')}</Text>
        </View>
      </View>

      {/* マスターした国旗一覧 */}
      {masteredCountries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🏆 {t('parent.masteredCountries')}
          </Text>
          <View style={styles.flagRow}>
            {masteredCountries.slice(0, 20).map(c => (
              <FlagImage
                key={c.id}
                emoji={c.flag.emoji}
                width={40}
                height={27}
                showShadow={false}
                style={styles.miniFlag}
              />
            ))}
            {masteredCountries.length > 20 && (
              <Text style={styles.moreText}>
                +{masteredCountries.length - 20}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* ニガテな国旗一覧 */}
      {weakCountries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📝 {t('parent.weakCountries')}
          </Text>
          <View style={styles.flagRow}>
            {weakCountries.map(c => (
              <View key={c.id} style={styles.weakItem}>
                <FlagImage
                  emoji={c.flag.emoji}
                  width={40}
                  height={27}
                  showShadow={false}
                />
                <Text style={styles.weakName}>{c.nameEn}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* プレイ時間制限設定 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ {t('parent.playTimeLimit')}</Text>

        <Text style={styles.timeLimitValue}>
          {timeLimit >= 120 || timeLimit === 0
            ? t('parent.playTimeUnlimited')
            : t('parent.minutes', { count: timeLimit })}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={120}
          step={1}
          value={timeLimit === 0 ? 120 : timeLimit}
          onValueChange={handleTimeLimitChange}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.primaryDark}
        />

        <Text style={styles.todayPlay}>
          {t('parent.playTimeCurrent', { minutes: todayPlayMinutes })}
        </Text>
      </View>

      {/* === リセットセクション === */}
      {!showResetConfirm ? (
        <AnimatedButton
          label={t('parent.resetData')}
          onPress={() => {
            // まず「本当にリセットしますか？」のアラート
            Alert.alert(
              t('parent.resetConfirmTitle'),
              t('parent.resetConfirmMessage'),
              [
                { text: t('parent.back'), style: 'cancel' },
                { text: 'OK', style: 'destructive', onPress: () => setShowResetConfirm(true) },
              ]
            );
          }}
          color={Colors.red}
          textColor={Colors.textLight}
          size="small"
          style={styles.resetButton}
        />
      ) : (
        <View style={styles.resetConfirmCard}>
          <Text style={styles.resetQuestion}>
            {t('parent.resetAuthQuestion', { a: resetA, b: resetB })}
          </Text>
          <TextInput
            style={styles.resetInput}
            value={resetAnswer}
            onChangeText={(text) => { setResetAnswer(text); setResetError(''); }}
            keyboardType="number-pad"
            placeholder={t('parent.authPlaceholder')}
            placeholderTextColor={Colors.disabled}
            maxLength={3}
            autoFocus
          />
          {resetError ? <Text style={styles.resetError}>{resetError}</Text> : null}
          <AnimatedButton
            label={t('parent.authSubmit')}
            onPress={handleResetSubmit}
            color={Colors.red}
            disabled={!resetAnswer}
            style={styles.resetSubmitButton}
          />
          <AnimatedButton
            label={t('parent.back')}
            onPress={() => { setShowResetConfirm(false); setResetAnswer(''); setResetError(''); }}
            color={Colors.backgroundSecondary}
            textColor={Colors.textSecondary}
            size="small"
          />
        </View>
      )}

      {/* 戻るボタン */}
      <AnimatedButton
        label={t('parent.back')}
        onPress={() => navigation.navigate('Home')}
        color={Colors.backgroundSecondary}
        textColor={Colors.textSecondary}
        style={styles.backButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
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
  title: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    alignItems: 'center',
    ...Shadows.light,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.light,
  },
  sectionTitle: {
    fontSize: FontSizes.body,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  flagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  miniFlag: {
    margin: 3,
  },
  moreText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  weakItem: {
    alignItems: 'center',
    margin: Spacing.xs,
    width: 60,
  },
  weakName: {
    fontSize: FontSizes.tiny,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  timeLimitValue: {
    fontSize: FontSizes.subtitle,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  todayPlay: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  backButton: {
    marginTop: Spacing.lg,
  },
  resetButton: {
    marginTop: Spacing.xl,
  },
  resetConfirmCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.red,
    alignItems: 'center',
    ...Shadows.light,
  },
  resetQuestion: {
    fontSize: FontSizes.subtitle,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  resetInput: {
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
  resetError: {
    fontSize: FontSizes.body,
    color: Colors.red,
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  resetSubmitButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
});
