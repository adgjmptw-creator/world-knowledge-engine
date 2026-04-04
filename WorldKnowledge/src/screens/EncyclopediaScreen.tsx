/**
 * EncyclopediaScreen — 図鑑（ずかん）画面
 *
 * 収録全国の一覧を表示する。タップで国名をTTSで読み上げる。
 * 発見済みの国は国旗と国名を表示し、未発見の国は「？」で表示。
 *
 * 機能:
 * - 全国の一覧（presenceScoreの高い順）
 * - 検索機能（国名で絞り込み）
 * - タップで国名をTTSで読み上げ
 * - 発見済み/未発見の視覚的区別
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlagImage } from '../components/FlagImage';
import { RubyText } from '../components/RubyText';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { loadUserProgress } from '../services/storageService';
import { speakCountryName } from '../services/ttsService';
import { currentLanguage } from '../i18n';
import { UserProgress, RootStackParamList, CountryData } from '../types';
import { getAllCountries } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'Encyclopedia'>;

export const EncyclopediaScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [searchText, setSearchText] = useState('');

  const countries = getAllCountries();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const p = await loadUserProgress();
      setProgress(p);
    });
    return unsubscribe;
  }, [navigation]);

  /** 検索フィルタ適用後のリスト */
  const filteredCountries = useMemo(() => {
    if (!searchText.trim()) return countries;
    const query = searchText.toLowerCase();
    return countries.filter(c => {
      const localName = c.localizedNames[currentLanguage as keyof typeof c.localizedNames] || '';
      return (
        c.nameEn.toLowerCase().includes(query) ||
        localName.toLowerCase().includes(query) ||
        c.furigana.includes(query)
      );
    });
  }, [countries, searchText]);

  /** 国をタップ — 国名を読み上げ */
  const handleCountryPress = (country: CountryData) => {
    const localName = country.localizedNames[currentLanguage as keyof typeof country.localizedNames]
      || country.nameEn;
    speakCountryName(localName, country.nameEn, currentLanguage);
  };

  /** 各行のレンダリング */
  const renderItem = ({ item }: { item: CountryData }) => {
    const isDiscovered = !!progress?.countryStates[item.id];
    const localName = item.localizedNames[currentLanguage as keyof typeof item.localizedNames]
      || item.nameEn;

    return (
      <TouchableOpacity
        style={[styles.row, !isDiscovered && styles.rowLocked]}
        onPress={() => isDiscovered && handleCountryPress(item)}
        disabled={!isDiscovered}
        activeOpacity={0.6}
      >
        {/* 国旗 */}
        <View style={styles.flagContainer}>
          {isDiscovered ? (
            <FlagImage emoji={item.flag.emoji} width={60} height={40} showShadow={false} />
          ) : (
            <View style={styles.lockedFlag}>
              <Text style={styles.lockedEmoji}>❓</Text>
            </View>
          )}
        </View>

        {/* 国名 */}
        <View style={styles.nameContainer}>
          {isDiscovered ? (
            <>
              <Text style={styles.localName}>{localName}</Text>
              <Text style={styles.englishName}>{item.nameEn}</Text>
            </>
          ) : (
            <RubyText text={t('encyclopedia.notYetDiscovered')} style={styles.lockedText} enableRuby={currentLanguage === 'ja'} />
          )}
        </View>

        {/* 音声ボタン（発見済みのみ） */}
        {isDiscovered && (
          <Text style={styles.speakIcon}>🔊</Text>
        )}
      </TouchableOpacity>
    );
  };

  const discoveredCount = progress
    ? Object.keys(progress.countryStates).length
    : 0;

  return (
    <View style={styles.container}>
      {/* ホームに戻るボタン */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>🏠</Text>
      </TouchableOpacity>

      {/* ヘッダー */}
      <View style={styles.header}>
        <RubyText text={`${t('encyclopedia.title')} 📖`} style={styles.title} enableRuby={currentLanguage === 'ja'} />
        <Text style={styles.count}>
          {discoveredCount} / {countries.length}
        </Text>
      </View>

      {/* 検索バー */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t('encyclopedia.searchPlaceholder')}
          placeholderTextColor={Colors.disabled}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 国リスト */}
      <FlatList
        data={filteredCountries}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  homeButton: {
    position: 'absolute',
    top: Spacing.xxl + 10,
    left: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.full,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.light,
    zIndex: 10,
  },
  homeButtonText: {
    fontSize: 24,
  },
  header: {
    paddingTop: Spacing.xxl + 20,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  count: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...Shadows.light,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.light,
  },
  rowLocked: {
    opacity: 0.5,
  },
  flagContainer: {
    marginRight: Spacing.md,
  },
  lockedFlag: {
    width: 60,
    height: 40,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedEmoji: {
    fontSize: 20,
  },
  nameContainer: {
    flex: 1,
  },
  localName: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  englishName: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lockedText: {
    fontSize: FontSizes.small,
    color: Colors.disabled,
    fontStyle: 'italic',
  },
  speakIcon: {
    fontSize: 20,
    marginLeft: Spacing.sm,
  },
});
