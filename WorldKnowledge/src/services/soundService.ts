/**
 * World Knowledge Engine — サウンドサービス
 *
 * 正解・不正解・マスター達成時の効果音を再生する。
 * - Native (iOS/Android): expo-av + 動的生成WAV + expo-haptics
 * - Web: Web Audio API でサイン波を直接合成（外部ファイル不要）
 *
 * いずれもオフライン環境で動作する。
 *
 * 設計思想（5歳児向け）:
 * - 正解: 明るく短い上昇チャイム → 「やった！」という達成感
 * - 不正解: 柔らかく短い低音 → 怖くない、落ち込ませない
 * - マスター: 華やかなファンファーレ → 特別感のある大きな達成
 */

import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

/** Web環境かどうか */
const isWeb = Platform.OS === 'web';

// ============================================================
// Web Audio API 用の実装
// ============================================================

/** Web Audio API のコンテキスト（遅延初期化、ユーザー操作後に作成） */
let webAudioCtx: AudioContext | null = null;

/**
 * Web AudioContext を取得する（遅延初期化）
 * ブラウザのautoplay制限のため、ユーザー操作後に初めて作成される
 */
function getWebAudioCtx(): AudioContext | null {
  if (!isWeb || typeof window === 'undefined') return null;
  if (!webAudioCtx) {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return null;
      webAudioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }
  return webAudioCtx;
}

/**
 * Web Audio APIで複数のトーンを順番に再生する
 * @param notes 各音符 [周波数Hz, 長さ秒, 音量0-1]
 */
function playWebTones(notes: Array<[number, number, number]>): void {
  const ctx = getWebAudioCtx();
  if (!ctx) return;

  // ブラウザがサスペンド状態なら再開
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  let startTime = ctx.currentTime;
  for (const [frequency, duration, volume] of notes) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // エンベロープ: 急速立ち上がり + 指数減衰（自然な音）
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    startTime += duration;
  }
}

// ============================================================
// Native (expo-av) 用の WAV 生成 — Web では使わない
// ============================================================

/**
 * WAVファイルのヘッダーを生成する
 */
function createWavHeader(dataLength: number, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  view.setUint8(0, 0x52); view.setUint8(1, 0x49);
  view.setUint8(2, 0x46); view.setUint8(3, 0x46);
  view.setUint32(4, 36 + dataLength, true);
  view.setUint8(8, 0x57); view.setUint8(9, 0x41);
  view.setUint8(10, 0x56); view.setUint8(11, 0x45);
  view.setUint8(12, 0x66); view.setUint8(13, 0x6D);
  view.setUint8(14, 0x74); view.setUint8(15, 0x20);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint8(36, 0x64); view.setUint8(37, 0x61);
  view.setUint8(38, 0x74); view.setUint8(39, 0x61);
  view.setUint32(40, dataLength, true);
  return buffer;
}

/**
 * サイン波のPCMデータを生成する
 */
function generateTone(
  frequency: number,
  duration: number,
  volume: number,
  sampleRate: number,
  fadeOut: boolean = true
): Int16Array {
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Int16Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = Math.sin(2 * Math.PI * frequency * t);
    if (fadeOut) {
      const envelope = Math.exp(-3 * t / duration);
      sample *= envelope;
    }
    samples[i] = Math.floor(sample * volume * 32767);
  }
  return samples;
}

/**
 * 複数の音をつなげてWAV形式のBase64文字列にする
 */
function createWavBase64(tones: Int16Array[], sampleRate: number = 22050): string {
  const totalLength = tones.reduce((sum, t) => sum + t.length, 0);
  const combined = new Int16Array(totalLength);
  let offset = 0;
  for (const tone of tones) {
    combined.set(tone, offset);
    offset += tone.length;
  }
  const dataLength = combined.length * 2;
  const header = createWavHeader(dataLength, sampleRate);
  const headerBytes = new Uint8Array(header);
  const dataBytes = new Uint8Array(combined.buffer);
  const wav = new Uint8Array(headerBytes.length + dataBytes.length);
  wav.set(headerBytes);
  wav.set(dataBytes, headerBytes.length);
  let binary = '';
  for (let i = 0; i < wav.length; i++) {
    binary += String.fromCharCode(wav[i]);
  }
  return btoa(binary);
}

// === Native用の効果音WAV事前生成（Web環境では生成しない） ===

const SAMPLE_RATE = 22050;

const correctSoundBase64 = isWeb ? '' : createWavBase64([
  generateTone(523, 0.12, 0.6, SAMPLE_RATE),
  generateTone(784, 0.2, 0.5, SAMPLE_RATE),
], SAMPLE_RATE);

const incorrectSoundBase64 = isWeb ? '' : createWavBase64([
  generateTone(262, 0.2, 0.3, SAMPLE_RATE),
], SAMPLE_RATE);

const masterSoundBase64 = isWeb ? '' : createWavBase64([
  generateTone(523, 0.12, 0.6, SAMPLE_RATE),
  generateTone(659, 0.12, 0.6, SAMPLE_RATE),
  generateTone(1047, 0.3, 0.5, SAMPLE_RATE),
], SAMPLE_RATE);

// ============================================================
// 共通の再生関数
// ============================================================

/**
 * Native: オーディオモードを初期化する
 */
async function initAudio(): Promise<void> {
  if (isWeb) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  } catch (e) {
    // 初期化失敗しても続行
  }
}

/**
 * Native: Base64のWAVデータからサウンドを再生する
 */
async function playBase64Sound(base64: string): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: `data:audio/wav;base64,${base64}` },
      { shouldPlay: true }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    console.warn('Sound playback failed:', e);
  }
}

/**
 * 触覚フィードバック（Webでは何もしない）
 */
function hapticSuccess(): void {
  if (isWeb) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

function hapticLight(): void {
  if (isWeb) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// ============================================================
// 公開API
// ============================================================

/**
 * 正解の効果音を再生する
 * 明るい上昇チャイム + 軽い触覚フィードバック
 */
export async function playCorrectSound(): Promise<void> {
  hapticSuccess();
  if (isWeb) {
    playWebTones([
      [523, 0.12, 0.4],  // C5（ド）
      [784, 0.2, 0.35],  // G5（ソ）
    ]);
  } else {
    await initAudio();
    await playBase64Sound(correctSoundBase64);
  }
}

/**
 * 不正解の効果音を再生する
 * 柔らかい低音（怖くない、落ち込ませない）
 */
export async function playIncorrectSound(): Promise<void> {
  hapticLight();
  if (isWeb) {
    playWebTones([
      [262, 0.2, 0.25],  // C4（ド）柔らかく
    ]);
  } else {
    await initAudio();
    await playBase64Sound(incorrectSoundBase64);
  }
}

/**
 * マスター達成の効果音を再生する
 * 華やかなファンファーレ + 強い触覚フィードバック
 */
export async function playMasterSound(): Promise<void> {
  hapticSuccess();
  setTimeout(() => hapticSuccess(), 300);
  if (isWeb) {
    playWebTones([
      [523, 0.12, 0.4],   // C5（ド）
      [659, 0.12, 0.4],   // E5（ミ）
      [1047, 0.3, 0.35],  // C6（高いド）
    ]);
  } else {
    await initAudio();
    await playBase64Sound(masterSoundBase64);
  }
}
