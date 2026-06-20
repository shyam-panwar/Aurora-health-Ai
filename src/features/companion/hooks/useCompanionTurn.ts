import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { agentTurn } from '../../../lib/api/client';
import { useInvalidateDashboard } from '../../home/hooks/useHomeDashboard';
import { playAssistantAudio } from '../audio';
import type { ActionResult } from '../../../lib/types';

type Message = { role: 'user' | 'assistant'; text: string };

export const useCompanionTurn = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [actions, setActions] = useState<ActionResult[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState('');
  const invalidate = useInvalidateDashboard();

  const applyTurnResult = useCallback(
    async (result: Awaited<ReturnType<typeof agentTurn>>, userText: string) => {
      setThreadId(result.threadId);
      setLastTranscript(result.transcript || userText);
      setMessages((m) => [...m, { role: 'user', text: userText }, { role: 'assistant', text: result.reply }]);
      setActions(result.actions);
      setRecommendations(result.recommendations ?? []);

      if (result.actions.some((a) => a.success)) {
        invalidate();
      }

      await playAssistantAudio({
        audioBase64: result.audioBase64,
        audioMimeType: result.audioMimeType,
        fallbackText: result.reply,
      });
    },
    [invalidate],
  );

  const sendText = useCallback(
    async (text: string) => {
      if (!text.trim() || busy) return;
      setBusy(true);

      try {
        const result = await agentTurn({ text, threadId: threadId ?? undefined });
        await applyTurnResult(result, text);
      } catch (e) {
        Alert.alert('Companion error', e instanceof Error ? e.message : 'Try again');
      } finally {
        setBusy(false);
      }
    },
    [applyTurnResult, busy, threadId],
  );

  const sendVoiceAudio = useCallback(
    async (audioBase64: string) => {
      if (!audioBase64.trim() || busy) return;
      setBusy(true);

      try {
        const result = await agentTurn({ audioBase64, threadId: threadId ?? undefined });
        await applyTurnResult(result, result.transcript || 'Voice message');
      } catch (e) {
        Alert.alert('Companion error', e instanceof Error ? e.message : 'Try again');
      } finally {
        setBusy(false);
      }
    },
    [applyTurnResult, busy, threadId],
  );

  return {
    actions,
    busy,
    lastTranscript,
    messages,
    recommendations,
    sendText,
    sendVoiceAudio,
    threadId,
  };
};
