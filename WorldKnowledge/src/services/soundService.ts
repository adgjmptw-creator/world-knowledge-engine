/**
 * World Knowledge Engine — サウンドサービス
 *
 * 正解・不正解・マスター達成時の効果音を再生する。
 * 音はプログラムで生成したWAVデータを使用し、外部ファイル不要。
 * オフライン環境でも動作する。
 *
 * 設計思想（5歳児向け）:
 * - 正解: 明るく短い上昇チャイム → 「やった！」という達成感
 * - 不正解: 柔らかく短い低音 → 怖くない、落ち込ませない
 * - マスター: 華やかなファンファーレ → 特別感のある大きな達成
 *
 * expo-av の Audio.Sound を使用。
 * expo-haptics で触覚フィードバックも併用。
 */

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

/**
 * WAVファイルのヘッダーを生成する
 */
function createWavHeader(dataLength: number, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // "RIFF"
  view.setUint8(0, 0x52); view.setUint8(1, 0x49);
  view.setUint8(2, 0x46); view.setUint8(3, 0x46);
  // ファイルサイズ - 8
  view.setUint32(4, 36 + dataLength, true);
  // "WAVE"
  view.setUint8(8, 0x57); view.setUint8(9, 0x41);
  view.setUint8(10, 0x56); view.setUint8(11, 0x45);
  // "fmt "
  view.setUint8(12, 0x66); view.setUint8(13, 0x6D);
  view.setUint8(14, 0x74); view.setUint8(15, 0x20);
  // fmtチャンクサイズ
  view.setUint32(16, 16, true);
  // PCMフォーマット
  view.setUint16(20, 1, true);
  // モノラル
  view.setUint16(22, 1, true);
  // サンプルレート
  view.setUint32(24, sampleRate, true);
  // バイトレート
  view.setUint32(28, sampleRate * 2, true);
  // ブロックアライン
  view.setUint16(32, 2, true);
  // ビット深度
  view.setUint16(34, 16, true);
  // "data"
  view.setUint8(36, 0x64); view.setUint8(37, 0x61);
  view.setUint8(38, 0x74); view.setUint8(39, 0x61);
  // データサイズ
  view.setUint32(40, dataLength, true);

  return buffer;
}

/**
 * サイン波のPCMデータを生成する
 * @param frequency 周波数（Hz）
 * @param duration 長さ（秒）
 * @param volume 音量（0-1）
 * @param sampleRate サンプルレート
 * @param fadeOut フェードアウトするかどうか
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
    // サイン波
    let sample = Math.sin(2 * Math.PI * frequency * t);
    // フェードアウト（自然な音の減衰）
    if (fadeOut) {
      const envelope = Math.exp(-3 * t / duration);
      sample *= envelope;
    }
    // 音量調整して16bitに変換
    samples[i] = Math.floor(sample * volume * 32767);
  }

  return samples;
}

/**
 * 複数の音をつなげてWAV形式のBase64文字列にする
 */
function createWavBase64(tones: Int16Array[], sampleRate: number = 22050): string {
  // 全トーンを結合
  const totalLength = tones.reduce((sum, t) => sum + t.length, 0);
  const combined = new Int16Array(totalLength);
  let offset = 0;
  for (const tone of tones) {
    combined.set(tone, offset);
    offset += tone.length;
  }

  // WAVヘッダー + PCMデータ
  const dataLength = combined.length * 2;
  const header = createWavHeader(dataLength, sampleRate);
  const headerBytes = new Uint8Array(header);
  const dataBytes = new Uint8Array(combined.buffer);

  // 結合してBase64に変換
  const wav = new Uint8Array(headerBytes.length + dataBytes.length);
  wav.set(headerBytes);
  wav.set(dataBytes, headerBytes.length);

  // Base64エンコード
  let binary = '';
  for (let i = 0; i < wav.length; i++) {
    binary += String.fromCharCode(wav[i]);
  }
  return btoa(binary);
}

// === 効果音の生成 ===

const SAMPLE_RATE = 22050;

/**
 * 正解の音: 明るい上昇2音チャイム（C5→G5）
 * 短く（0.3秒）、明るく、子供が喜ぶ音
 */
const correctSoundBase64 = createWavBase64([
  generateTone(523, 0.12, 0.6, SAMPLE_RATE),  // C5（ド）
  generateTone(784, 0.2, 0.5, SAMPLE_RATE),   // G5（ソ）
], SAMPLE_RATE);

/**
 * 不正解の音: 柔らかい低音（C4）
 * 短く（0.2秒）、柔らかく、怖くない
 */
const incorrectSoundBase64 = createWavBase64([
  generateTone(262, 0.2, 0.3, SAMPLE_RATE),   // C4（ド）低く柔らかい
], SAMPLE_RATE);

/**
 * マスター達成の音: 華やかな上昇3音ファンファーレ（C5→E5→G5↑）
 * 少し長め（0.5秒）、特別感のある音
 */
const masterSoundBase64 = createWavBase64([
  generateTone(523, 0.12, 0.6, SAMPLE_RATE),  // C5（ド）
  generateTone(659, 0.12, 0.6, SAMPLE_RATE),  // E5（ミ）
  generateTone(1047, 0.3, 0.5, SAMPLE_RATE),  // C6（高いド）
], SAMPLE_RATE);

// === 再生関数 ===

/** サウンドオブジェクトのキャッシュ */
let correctSound: Audio.Sound | null = null;
let incorrectSound: Audio.Sound | null = null;
let masterSound: Audio.Sound | null = null;

/**
 * オーディオモードを初期化する（他の音を中断しない設定）
 */
async function initAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  } catch (e) {
    // 初期化失敗しても続行（音が出ないだけ）
  }
}

/**
 * Base64のWAVデータからサウンドを再生する
 */
async function playBase64Sound(base64: string): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: `data:audio/wav;base64,${base64}` },
      { shouldPlay: true }
    );
    // 再生完了後にアンロード
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    // 再生失敗しても無視（子供がエラーで困らないように）
    console.warn('Sound playback failed:', e);
  }
}

/**
 * 正解の効果音を再生する
 * 明るい上昇チャイム + 軽い触覚フィードバック
 */
export async function playCorrectSound(): Promise<void> {
  await initAudio();
  // 触覚フィードバック（軽い成功感）
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  await playBase64Sound(correctSoundBase64);
}

/**
 * 不正解の効果音を再生する
 * 柔らかい低音（怖くない、落ち込ませない）
 */
export async function playIncorrectSound(): Promise<void> {
  await initAudio();
  // 触覚フィードバック（軽い振動のみ）
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  await playBase64Sound(incorrectSoundBase64);
}

/**
 * マスター達成の効果音を再生する
 * 華やかなファンファーレ + 強い触覚フィードバック
 */
export async function playMasterSound(): Promise<void> {
  await initAudio();
  // 触覚フィードバック（大きな成功感）
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  // 少し遅らせてもう一度振動（特別感）
  setTimeout(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, 300);
  await playBase64Sound(masterSoundBase64);
}
