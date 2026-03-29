/**
 * ExplorationMapScreen — 探検マップ画面
 *
 * 学習進捗を地域別に視覚化し、コレクション要素を提供する。
 * 世界12地域をカラフルなタイルで表示し、各地域の発見済み国数を表示する。
 * 発見済みの国をタップすると国旗と国名を確認でき、TTS再生もできる。
 *
 * デザイン:
 * - 地域タイルは2列グリッドで表示
 * - 各タイルにはemoji、地域名、進捗バー、発見数を表示
 * - タップで展開し、地域内の発見済み国旗を一覧表示
 * - スペシャルチャレンジクリア国には特別な王冠マークを表示
 */

import React, { useState, useEffect } from 'react';
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
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { REGIONS, RegionInfo } from '../constants/regions';
import { loadUserProgress } from '../services/storageService';
import { speakCountryName } from '../services/ttsService';
import { currentLanguage } from '../i18n';
import { UserProgress, RootStackParamList, WorldRegion, CountryData } from '../types';
import { getAllCountries } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'ExplorationMap'>;

export const ExplorationMapScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [expandedRegion, setExpandedRegion] = useState<WorldRegion | null>(null);

  const countries = getAllCountries();

  // 画面フォーカス時に進捗を再読み込み
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const p = await loadUserProgress();
      setProgress(p);
    });
    return unsubscribe;
  }, [navigation]);

  /** 地域ごとの国リストを取得 */
  const getCountriesByRegion = (regionId: WorldRegion): CountryData[] => {
    return countries.filter(c => c.region === regionId);
  };

  /** 地域ごとの発見済み国数を取得 */
  const getDiscoveredCount = (regionId: WorldRegion): number => {
    if (!progress) return 0;
    return getCountriesByRegion(regionId).filter(
      c => progress.countryStates[c.id]
    ).length;
  };

  /** 地域タイルをタップ */
  const handleRegionPress = (regionId: WorldRegion) => {
    setExpandedRegion(expandedRegion === regionId ? null : regionId);
  };

  /** 国旗をタップ — 国名を読み上げ */
  const handleCountryPress = (country: CountryData) => {
    const localName = country.localizedNames[currentLanguage as keyof typeof country.localizedNames]
      || country.nameEn;
    speakCountryName(localName, country.nameEn, currentLanguage);
  };

  const totalDiscovered = progress
    ? Object.keys(progress.countryStates).length
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <RubyText text={`${t('map.title')} 🗺️`} style={styles.title} enableRuby={currentLanguage === 'ja'} />
        <RubyText
          text={t('map.countriesDiscovered', {
            count: totalDiscovered,
            total: countries.length,
          })}
          style={styles.totalProgress}
          enableRuby={currentLanguage === 'ja'}
        />
      </View>

      {/* 地域タイルグリッド */}
      <View style={styles.grid}>
        {REGIONS.map((region) => {
          const regionCountries = getCountriesByRegion(region.id);
          const discovered = getDiscoveredCount(region.id);
          const total = regionCountries.length;
          const isExpanded = expandedRegion === region.id;

          return (
            <View key={region.id} style={styles.tileContainer}>
              <TouchableOpacity
                style={[
                  styles.tile,
                  { borderColor: region.color },
                  isExpanded && { backgroundColor: region.color + '15' },
                ]}
                onPress={() => handleRegionPress(region.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.tileEmoji}>{region.emoji}</Text>
                <RubyText
                  text={region.name[currentLanguage as keyof typeof region.name] || region.name.en}
                  style={styles.tileName}
                  enableRuby={currentLanguage === 'ja'}
                />
                {/* 進捗バー */}
                <View style={styles.tileProgressBg}>
                  <View
                    style={[
                      styles.tileProgressFill,
                      {
                        backgroundColor: region.color,
                        width: total > 0 ? `${(discovered / total) * 100}%` : '0%',
                      },
                    ]}
                  />
                </View>
                <RubyText
                  text={t('map.regionProgress', { count: discovered, total })}
                  style={styles.tileCount}
                  enableRuby={currentLanguage === 'ja'}
                />
              </TouchableOpacity>

              {/* 展開時: 発見済み国旗一覧 */}
              {isExpanded && (
                <View style={styles.expandedContainer}>
                  {regionCountries.map((country) => {
                    const isDiscovered = !!progress?.countryStates[country.id];
                    const isSpecialCleared = progress?.countryStates[country.id]?.specialChallengeCleared;

                    return (
                      <TouchableOpacity
                        key={country.id}
                        style={[
                          styles.countryItem,
                          !isDiscovered && styles.countryItemLocked,
                        ]}
                        onPress={() => isDiscovered && handleCountryPress(country)}
                        disabled={!isDiscovered}
                      >
                        {isDiscovered ? (
                          <>
                            <FlagImage
                              emoji={country.flag.emoji}
                              width={40}
                              height={27}
                              showShadow={false}
                            />
                            {/* スペシャルチャレンジクリアの王冠マーク */}
                            {isSpecialCleared && (
                              <Text style={styles.crownMark}>👑</Text>
                            )}
                          </>
                        ) : (
                          <Text style={styles.lockedEmoji}>❓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  totalProgress: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tileContainer: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  tile: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    ...Shadows.light,
  },
  tileEmoji: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  tileName: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  tileProgressBg: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  tileProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tileCount: {
    fontSize: FontSizes.tiny,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  expandedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
    ...Shadows.light,
  },
  countryItem: {
    margin: 3,
    position: 'relative',
  },
  countryItemLocked: {
    opacity: 0.4,
  },
  lockedEmoji: {
    fontSize: 20,
    width: 40,
    height: 27,
    textAlign: 'center',
    lineHeight: 27,
  },
  crownMark: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 14,
  },
});
