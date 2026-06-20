import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { StatPill } from '../../../components/ui/StatPill';
import { ActionResultCard } from '../components/ActionResultCard';
import { HoldToTalkButton } from '../components/HoldToTalkButton';
import { TranscriptBubble } from '../components/TranscriptBubble';
import { VoiceOrb } from '../components/VoiceOrb';
import { readRecordingAsBase64 } from '../audio';
import { useCompanionTurn } from '../hooks/useCompanionTurn';
import { useHomeDashboard } from '../../home/hooks/useHomeDashboard';
import { colors, spacing } from '../../../theme';

export const CompanionScreen = () => {
  const [text, setText] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [sendingVoice, setSendingVoice] = useState(false);
  const captureRequested = useRef(false);
  const webRecognitionRef = useRef<any>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const { data: dashboard } = useHomeDashboard();
  const { messages, actions, recommendations, busy, lastTranscript, sendText, sendVoiceAudio, threadId } =
    useCompanionTurn();

  useEffect(() => {
    void setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }, []);

  const handleSend = () => {
    void sendText(text);
    setText('');
  };

  const stopWebRecognition = () => {
    try {
      webRecognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
    webRecognitionRef.current = null;
  };

  const fallbackSuggestions = [
    'I drank 500ml water',
    'I slept 7 hours last night',
    'How am I doing this week?',
    'Create a habit to meditate every morning',
  ];

  const hydrationPct = dashboard
    ? Math.round((dashboard.hydration.todayTotalMl / dashboard.hydration.goalMl) * 100)
    : 0;

  const derivedSuggestions = dashboard
    ? [
        dashboard.hydration.todayTotalMl < dashboard.hydration.goalMl
          ? `You are ${Math.max(0, dashboard.hydration.goalMl - dashboard.hydration.todayTotalMl)}ml from your water goal. Take a 250ml sip.`
          : `Hydration is strong today at ${hydrationPct}% of goal. Keep the momentum going.`,
        dashboard.sleep.weekAverageHours > 0 && dashboard.sleep.weekAverageHours < dashboard.sleep.goalHours
          ? `Your sleep average is ${dashboard.sleep.weekAverageHours.toFixed(1)}h. Wind down a bit earlier tonight.`
          : `Sleep is tracking around ${dashboard.sleep.goalHours}h. Protect that routine tonight.`,
        dashboard.habits.totalActive > 0 && dashboard.habits.completedCount < dashboard.habits.totalActive
          ? `Complete one habit now to build consistency.`
          : `Create a tiny habit if you want more structure this week.`,
      ]
    : [];

  const coachSuggestions = recommendations.length > 0 ? recommendations : derivedSuggestions.length > 0 ? derivedSuggestions : fallbackSuggestions;
  const coachGreeting = dashboard?.profile.full_name?.split(' ')[0] || 'friend';
  const sleepAverageText = dashboard ? `${dashboard.sleep.weekAverageHours.toFixed(1)}h avg` : '—';
  const hydrationText = dashboard ? `${dashboard.hydration.todayTotalMl}/${dashboard.hydration.goalMl}ml` : '—';
  const activeFocus =
    dashboard?.habits.items.find((habit) => !habit.completedToday)?.title ??
    dashboard?.habits.items[0]?.title ??
    'one easy healthy habit';
  const coachHeadline = capturing
    ? 'Aurora is listening'
    : busy || sendingVoice
      ? 'Aurora is thinking'
      : 'Your personal health coach is ready';
  const coachSubcopy = capturing
    ? 'Speak naturally. Aurora can answer questions, update progress, and suggest your next best step.'
    : busy || sendingVoice
      ? 'Reviewing your progress and preparing a spoken response.'
      : `Ask about hydration, sleep, habits, or say something like "I drank 500ml water."`;

  const startListening = async () => {
    if (Platform.OS === 'web') {
      const webWindow =
        typeof window !== 'undefined'
          ? (window as Window & {
              SpeechRecognition?: new () => any;
              webkitSpeechRecognition?: new () => any;
            })
          : null;
      const SpeechRecognitionCtor =
        webWindow?.SpeechRecognition ?? webWindow?.webkitSpeechRecognition ?? null;

      if (!SpeechRecognitionCtor) {
        Alert.alert('Voice not supported', 'Use Chrome or Edge for live voice listening in the web preview.');
        return;
      }

      stopWebRecognition();

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          void sendText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        Alert.alert('Voice capture failed', event?.error ?? 'Please try again.');
        setCapturing(false);
        webRecognitionRef.current = null;
      };

      recognition.onend = () => {
        setCapturing(false);
        webRecognitionRef.current = null;
      };

      webRecognitionRef.current = recognition;
      setCapturing(true);
      recognition.start();
      return;
    }

    if (busy || sendingVoice || recorderState.isRecording) {
      return;
    }

    captureRequested.current = true;

    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      captureRequested.current = false;
      Alert.alert('Microphone permission needed', 'Aurora needs access to your microphone to hear you.');
      return;
    }

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();

      if (!captureRequested.current) {
        await recorder.stop().catch(() => {});
        return;
      }

      setCapturing(true);
    } catch (error) {
      captureRequested.current = false;
      Alert.alert('Voice capture failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const stopListening = async () => {
    if (Platform.OS === 'web') {
      stopWebRecognition();
      setCapturing(false);
      return;
    }

    captureRequested.current = false;

    if (!capturing) {
      return;
    }

    setCapturing(false);
    setSendingVoice(true);

    try {
      await recorder.stop();
      if (!recorder.uri) {
        throw new Error('No audio was captured.');
      }

      const audioBase64 = await readRecordingAsBase64(recorder.uri);
      await sendVoiceAudio(audioBase64);
    } catch (error) {
      Alert.alert('Voice capture failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSendingVoice(false);
    }
  };

  const voiceBusy = busy || sendingVoice;

  return (
    <AppScreen>
      <AppCard accent elevated style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <AppText color="accentWarm" variant="label">
              COACH SESSION
            </AppText>
            <AppText variant="title">{coachGreeting}, {coachHeadline.toLowerCase()}</AppText>
            <AppText color="textSecondary">{coachSubcopy}</AppText>
          </View>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                (capturing || busy || sendingVoice) && styles.statusDotActive,
              ]}
            />
            <AppText variant="caption">
              {capturing ? 'Listening' : busy || sendingVoice ? 'Responding' : 'Ready'}
            </AppText>
          </View>
        </View>

        <VoiceOrb active={capturing} speaking={voiceBusy} />

        <View style={styles.statsRow}>
          <StatPill label="Hydration" tone="accent" value={hydrationText} />
          <StatPill label="Sleep" value={sleepAverageText} />
        </View>

        <View style={styles.sessionRow}>
          <View style={styles.sessionPill}>
            <AppText color="textMuted" variant="label">
              Focus habit
            </AppText>
            <AppText variant="caption">{activeFocus}</AppText>
          </View>
          <View style={styles.sessionPill}>
            <AppText color="textMuted" variant="label">
              Conversation
            </AppText>
            <AppText variant="caption">{threadId ? 'Continuing' : 'New session'}</AppText>
          </View>
        </View>
      </AppCard>

      <AppCard style={styles.coachCard}>
        <AppText color="accentWarm" variant="label">
          COACH NOTE
        </AppText>
        <AppText variant="subheading">
          {dashboard?.insight?.body ?? 'Aurora is ready to help you make one small useful move today.'}
        </AppText>
      </AppCard>

      {lastTranscript ? (
        <AppCard style={styles.transcriptCard}>
          <AppText color="textMuted" variant="label">
            LAST VOICE TRANSCRIPT
          </AppText>
          <AppText>{lastTranscript}</AppText>
        </AppCard>
      ) : null}

      <FlatList
        contentContainerStyle={styles.list}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <TranscriptBubble role={item.role} text={item.text} />}
        scrollEnabled={false}
      />

      {actions.map((a, i) => (
        <ActionResultCard key={`${a.tool}-${i}`} action={a} />
      ))}

      <View style={styles.suggestions}>
        {coachSuggestions.map((s) => (
          <AppButton
            key={s}
            disabled={voiceBusy}
            onPress={() => void sendText(s)}
            title={s}
            variant="ghost"
          />
        ))}
      </View>

      <AppInput
        editable={!voiceBusy}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        placeholder="Type a message…"
        returnKeyType="send"
        value={text}
      />
      <AppButton busy={busy} disabled={voiceBusy} onPress={handleSend} title="Send" />

      <HoldToTalkButton
        disabled={voiceBusy}
        label={busy || sendingVoice ? 'Aurora is responding' : 'Hold to talk'}
        onPressIn={() => {
          void startListening();
        }}
        onPressOut={() => {
          void stopListening();
        }}
        recording={capturing}
      />

      <AppText color="textMuted" variant="caption">
        {capturing
          ? 'Release to send your voice message.'
          : sendingVoice
            ? 'Processing your voice note…'
            : 'Speak naturally. Aurora can answer questions and update your health logs for you.'}
      </AppText>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  coachCard: { gap: spacing.xs },
  heroCard: { gap: spacing.lg },
  heroCopy: { flex: 1, gap: spacing.xs },
  heroHeader: { gap: spacing.md },
  list: { gap: spacing.md },
  sessionPill: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statusBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusDot: {
    backgroundColor: colors.textMuted,
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  statusDotActive: {
    backgroundColor: colors.accent,
  },
  suggestions: { gap: spacing.xs },
  transcriptCard: { gap: spacing.xs },
});
