/**
 * World Knowledge Engine — アプリエントリーポイント
 *
 * React Navigationを使用したスタックナビゲーションを設定。
 * i18nの初期化とナビゲーション構造を管理する。
 *
 * 画面構成:
 * - Home: ホーム画面
 * - Quiz: クイズ出題画面
 * - Result: 回答結果カード画面
 * - ExplorationMap: 探検マップ画面
 * - Encyclopedia: 図鑑画面
 * - ParentalAuth: 保護者認証画面
 * - ParentalDashboard: 保護者ダッシュボード画面
 * - SpecialChallenge: スペシャルチャレンジ画面
 * - SpecialChallengeResult: スペシャルチャレンジ結果画面
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// i18nの初期化（インポートするだけで初期化される）
import './src/i18n';

import {
  HomeScreen,
  QuizScreen,
  ResultScreen,
  ExplorationMapScreen,
  EncyclopediaScreen,
  ParentalAuthScreen,
  ParentalDashboardScreen,
  SpecialChallengeScreen,
  SpecialChallengeResultScreen,
} from './src/screens';
import { RootStackParamList } from './src/types';
import { Colors } from './src/constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 共通のナビゲーションヘッダースタイル
 * 子供向けの温かみのある配色
 */
const screenOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: Colors.textLight,
  headerTitleStyle: {
    fontWeight: 'bold' as const,
    fontSize: 18,
  },
  headerBackTitleVisible: false,
  // スムーズな画面遷移アニメーション
  animation: 'slide_from_right' as const,
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={screenOptions}
      >
        {/* ホーム画面: ヘッダーなし（独自デザイン） */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* クイズ画面 */}
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{
            headerShown: false,
            // クイズ中は戻るジェスチャーを無効化（誤操作防止）
            gestureEnabled: false,
          }}
        />

        {/* 結果カード画面 */}
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade',
          }}
        />

        {/* 探検マップ画面 */}
        <Stack.Screen
          name="ExplorationMap"
          component={ExplorationMapScreen}
          options={{ headerShown: false }}
        />

        {/* 図鑑画面 */}
        <Stack.Screen
          name="Encyclopedia"
          component={EncyclopediaScreen}
          options={{ headerShown: false }}
        />

        {/* 保護者認証画面 */}
        <Stack.Screen
          name="ParentalAuth"
          component={ParentalAuthScreen}
          options={{ headerShown: false }}
        />

        {/* 保護者ダッシュボード画面 */}
        <Stack.Screen
          name="ParentalDashboard"
          component={ParentalDashboardScreen}
          options={{ headerShown: false }}
        />

        {/* スペシャルチャレンジ画面 */}
        <Stack.Screen
          name="SpecialChallenge"
          component={SpecialChallengeScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* スペシャルチャレンジ結果画面 */}
        <Stack.Screen
          name="SpecialChallengeResult"
          component={SpecialChallengeResultScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
