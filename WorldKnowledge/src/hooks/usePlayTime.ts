/**
 * usePlayTime — プレイ時間管理フック
 *
 * クイズ画面がアクティブな間のプレイ時間を計測し、
 * 保護者が設定した制限時間に達した場合にコールバックを呼ぶ。
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { addPlayTime, isPlayTimeLimitReached } from '../services/storageService';

interface UsePlayTimeOptions {
  /** プレイ時間制限に達した場合のコールバック */
  onTimeLimitReached?: () => void;
  /** 計測を有効にするかどうか */
  enabled?: boolean;
}

/**
 * プレイ時間を自動計測するカスタムフック
 * コンポーネントがマウントされている間、10秒ごとにプレイ時間を加算
 */
export function usePlayTime({ onTimeLimitReached, enabled = true }: UsePlayTimeOptions = {}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isLimited, setIsLimited] = useState(false);

  /** プレイ時間制限チェック */
  const checkLimit = useCallback(async () => {
    const limited = await isPlayTimeLimitReached();
    if (limited) {
      setIsLimited(true);
      onTimeLimitReached?.();
    }
  }, [onTimeLimitReached]);

  useEffect(() => {
    if (!enabled) return;

    // 初回チェック
    checkLimit();

    // 10秒ごとにプレイ時間を加算＆制限チェック
    intervalRef.current = setInterval(async () => {
      await addPlayTime(10000); // 10秒分を加算
      await checkLimit();
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, checkLimit]);

  return { isLimited };
}
