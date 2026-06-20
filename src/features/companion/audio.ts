import * as FileSystem from 'expo-file-system/legacy';
import { createAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

let activePlayer: ReturnType<typeof createAudioPlayer> | null = null;

export const readRecordingAsBase64 = async (uri: string) => {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
};

const getAudioExtension = (mimeType?: string) => {
  switch (mimeType) {
    case 'audio/mpeg':
      return 'mp3';
    case 'audio/wav':
      return 'wav';
    case 'audio/mp4':
    case 'audio/m4a':
      return 'm4a';
    default:
      return 'mp3';
  }
};

export const stopSpeaking = () => {
  Speech.stop();

  if (activePlayer) {
    try {
      activePlayer.pause();
      activePlayer.remove();
    } catch {
      // ignore cleanup failures
    }
    activePlayer = null;
  }
};

export const speakFallback = async (text: string) => {
  stopSpeaking();

  await Speech.speak(text, {
    language: 'en-US',
    pitch: 1.02,
    rate: 0.95,
  });
};

export const playAssistantAudio = async (input: {
  audioBase64?: string;
  audioMimeType?: string;
  fallbackText: string;
}) => {
  const { audioBase64, audioMimeType, fallbackText } = input;

  if (!audioBase64) {
    await speakFallback(fallbackText);
    return;
  }

  try {
    stopSpeaking();

    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) {
      await speakFallback(fallbackText);
      return;
    }

    const extension = getAudioExtension(audioMimeType);
    const uri = `${cacheDir}aurora-voice-${Date.now()}.${extension}`;

    await FileSystem.writeAsStringAsync(uri, audioBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const player = createAudioPlayer({ uri });
    activePlayer = player;
    player.play();
  } catch {
    await speakFallback(fallbackText);
  }
};
