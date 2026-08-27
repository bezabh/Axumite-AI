// =========================================================================
// AXUMITE AI - Welcome Audio Greeting Service (Tigrinya Synthesizer)
// Triggers high-fidelity Tigrinya synthesized audio on first login session
// =========================================================================

export interface WelcomeAudioState {
  isPlaying: boolean;
  isLoading: boolean;
  textTi: string;
  textEn: string;
  error?: string;
  source: 'gemini-tts' | 'speech-synthesis' | 'chime-harmonic';
}

/**
 * Encodes base64 raw PCM bytes (from Gemini TTS 24kHz 16-bit mono) into a valid WAV blob URL
 */
export function base64PcmToWavDataUrl(base64Pcm: string, sampleRate = 24000, channels = 1): string {
  try {
    const binaryString = atob(base64Pcm);
    const len = binaryString.length;
    const pcmBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      pcmBytes[i] = binaryString.charCodeAt(i);
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    // "RIFF" chunk descriptor
    view.setUint32(0, 0x52494646, false);
    // ChunkSize (36 + SubChunk2Size)
    view.setUint32(4, 36 + pcmBytes.length, true);
    // "WAVE" format
    view.setUint32(8, 0x57415645, false);
    // "fmt " sub-chunk
    view.setUint32(12, 0x666d7420, false);
    // Subchunk1Size (16 for PCM)
    view.setUint32(16, 16, true);
    // AudioFormat (1 = PCM linear)
    view.setUint16(20, 1, true);
    // NumChannels
    view.setUint16(22, channels, true);
    // SampleRate
    view.setUint32(24, sampleRate, true);
    // ByteRate = SampleRate * NumChannels * BitsPerSample / 8
    view.setUint32(28, sampleRate * channels * 2, true);
    // BlockAlign = NumChannels * BitsPerSample / 8
    view.setUint16(32, channels * 2, true);
    // BitsPerSample
    view.setUint16(34, 16, true);
    // "data" sub-chunk
    view.setUint32(36, 0x64617461, false);
    // Subchunk2Size
    view.setUint32(40, pcmBytes.length, true);

    const blob = new Blob([wavHeader, pcmBytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('WAV header construction notice:', err);
    return `data:audio/wav;base64,${base64Pcm}`;
  }
}

/**
 * Plays a noble Axumite golden chime chord using Web Audio API
 */
export function playAxumiteChimeChord(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.28, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);
      masterGain.connect(ctx.destination);

      // Pentatonic harmonic chime frequencies (Aksumite Stela chord: A4, C#5, E5, A5)
      const freqs = [432, 540, 648, 864];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.22 / (idx + 1), ctx.currentTime + 0.08 + idx * 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5 + idx * 0.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + 3.0);
      });

      setTimeout(() => {
        resolve();
      }, 700);
    } catch (err) {
      console.warn('Web Audio chime blocked:', err);
      resolve();
    }
  });
}

export const DEFAULT_COMMUNITY_WELCOME_GREETING_TI = 'ከም ማሕበረሰብ ምስ ግዜ ንምስጓም፡ ዝተረቐቐ ቴክኖሎጂ ክህልወና ኣገዳሲ እዩ። ነዚ ተጀሚሩ ዘሎ ዕዮ ብዝበለጸ ንምቕጻልን ናብ ዝለዓለ ደረጃ ንምብጻሕን ሓገዝኩም የድልየና።';
export const DEFAULT_COMMUNITY_WELCOME_GREETING_EN = 'As a community moving forward with time, having advanced technology is essential. To continue this initiated mission at its best and elevate it to the highest level, we need your support.';
export const DEFAULT_COMMUNITY_WELCOME_GREETING_PHONETIC = 'Kem mahbereseb ms gzie nmswam: ztereqeqe technology khlwena agedasi eyu. Nezi tejimiru zelo eyo bzbeletse nmqtsaln nab zleale dereja nmbtsahn hagezkum yedlyena.';

/**
 * Determine the customized Tigrinya welcome greeting text based on user identity
 */
export function getWelcomeGreetingText(email?: string, name?: string): { textTi: string; textEn: string; phoneticTi: string } {
  return {
    textTi: DEFAULT_COMMUNITY_WELCOME_GREETING_TI,
    textEn: DEFAULT_COMMUNITY_WELCOME_GREETING_EN,
    phoneticTi: DEFAULT_COMMUNITY_WELCOME_GREETING_PHONETIC,
  };
}

// Active audio references
let currentAudioElement: HTMLAudioElement | null = null;

/**
 * Stops any actively playing welcome audio
 */
export function stopWelcomeAudio(): void {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Triggers synthesized Tigrinya audio greeting
 */
export async function playTigrinyaWelcomeAudio(
  email?: string,
  name?: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: string) => void
): Promise<WelcomeAudioState> {
  stopWelcomeAudio();
  const { textTi, textEn } = getWelcomeGreetingText(email, name);

  // Play royal chime first
  await playAxumiteChimeChord();

  if (onStart) onStart();

  // 1. Try Backend Gemini TTS synthesis
  try {
    const res = await fetch('/api/obelisk/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': email || '',
        'x-user-role': email?.toLowerCase() === 'beckylove2004@gmail.com' ? 'Creator' : 'Guest',
      },
      body: JSON.stringify({
        text: textTi,
        voice: 'Kore',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const audioUrl = base64PcmToWavDataUrl(data.audioBase64, data.sampleRate || 24000);
        const audio = new Audio(audioUrl);
        currentAudioElement = audio;

        audio.onended = () => {
          currentAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          fallbackSpeechSynthesis(textTi, onEnd, onError);
        };

        await audio.play();
        return {
          isPlaying: true,
          isLoading: false,
          textTi,
          textEn,
          source: 'gemini-tts',
        };
      }
    }
  } catch (err) {
    console.warn('Backend TTS unreachable, fallback to browser speech synthesis:', err);
  }

  // 2. Fallback to Web Speech Synthesis
  return fallbackSpeechSynthesis(textTi, onEnd, onError, textEn);
}

function fallbackSpeechSynthesis(
  textTi: string,
  onEnd?: () => void,
  onError?: (err: string) => void,
  textEn?: string
): WelcomeAudioState {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return {
      isPlaying: false,
      isLoading: false,
      textTi,
      textEn: textEn || '',
      source: 'chime-harmonic',
    };
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textTi);
    utterance.lang = 'ti-ER';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    // Try finding the best matching natural voice
    const voices = window.speechSynthesis.getVoices();
    const tigrinyaOrHornVoice = voices.find(
      (v) =>
        v.lang.startsWith('ti') ||
        v.lang.startsWith('am') ||
        v.name.toLowerCase().includes('tigrinya') ||
        v.name.toLowerCase().includes('amharic') ||
        v.name.toLowerCase().includes('ethiopia') ||
        v.name.toLowerCase().includes('eritrea')
    );

    if (tigrinyaOrHornVoice) {
      utterance.voice = tigrinyaOrHornVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      console.warn('Speech synthesis notice:', e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);

    return {
      isPlaying: true,
      isLoading: false,
      textTi,
      textEn: textEn || '',
      source: 'speech-synthesis',
    };
  } catch (e: any) {
    if (onError) onError(e?.message || 'Speech failed');
    if (onEnd) onEnd();
    return {
      isPlaying: false,
      isLoading: false,
      textTi,
      textEn: textEn || '',
      source: 'chime-harmonic',
    };
  }
}

/**
 * Check if the welcome audio greeting has already played during the current browser session
 */
export function hasWelcomeAudioPlayedInSession(userId?: string): boolean {
  try {
    const sessionKey = userId 
      ? `axumite_welcome_audio_played_session_${userId.toLowerCase()}`
      : 'axumite_welcome_audio_played_session';
    return sessionStorage.getItem(sessionKey) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark that the welcome audio greeting has played for this browser session
 */
export function markWelcomeAudioPlayedInSession(userId?: string): void {
  try {
    const sessionKey = userId 
      ? `axumite_welcome_audio_played_session_${userId.toLowerCase()}`
      : 'axumite_welcome_audio_played_session';
    sessionStorage.setItem(sessionKey, 'true');
  } catch {
    // ignore
  }
}

/**
 * Reset session playback marker (useful for testing or on explicit logout)
 */
export function resetWelcomeAudioSession(userId?: string): void {
  try {
    if (userId) {
      sessionStorage.removeItem(`axumite_welcome_audio_played_session_${userId.toLowerCase()}`);
    }
    sessionStorage.removeItem('axumite_welcome_audio_played_session');
  } catch {
    // ignore
  }
}
