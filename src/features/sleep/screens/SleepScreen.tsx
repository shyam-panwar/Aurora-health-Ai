import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { StatPill } from '../../../components/ui/StatPill';
import { fetchSleepLogs, logSleep } from '../../../lib/api/client';
import { queryKeys } from '../../../lib/api/queries';
import { useDashboardMutation, useHomeDashboard } from '../../home/hooks/useHomeDashboard';
import { SleepTrendChart } from '../components/SleepTrendChart';
import { spacing } from '../../../theme';

export const SleepScreen = () => {
  const { data: dashboard } = useHomeDashboard();
  const [hours, setHours] = useState('');
  const [quality, setQuality] = useState('4');
  const mutation = useDashboardMutation(async (input: { hours: number; quality: number }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await logSleep({
      sleepDate: yesterday.toISOString().slice(0, 10),
      durationMinutes: Math.round(input.hours * 60),
      quality: input.quality,
    });
  });

  const { data: logs = [] } = useQuery({
    queryKey: queryKeys.sleep,
    queryFn: () => fetchSleepLogs(7),
  });

  const lastNight = dashboard?.sleep.lastNight;
  const avg = dashboard?.sleep.weekAverageHours ?? 0;

  const handleLog = () => {
    const h = parseFloat(hours);
    const q = parseInt(quality, 10);
    if (!h || h <= 0 || h > 24) {
      Alert.alert('Invalid duration', 'Enter sleep hours between 0 and 24.');
      return;
    }
    mutation.mutate(
      { hours: h, quality: q },
      { onSuccess: () => { setHours(''); Alert.alert('Logged', 'Sleep recorded for last night.'); } },
    );
  };

  return (
    <AppScreen>
      <AppText variant="title">Sleep</AppText>
      <AppText color="textSecondary">Track rest without pressure — awareness is the goal.</AppText>

      <View style={styles.stats}>
        <StatPill
          label="Last night"
          tone="accent"
          value={lastNight ? `${(lastNight.duration_minutes / 60).toFixed(1)}h` : '—'}
        />
        <StatPill label="Week avg" value={avg > 0 ? `${avg.toFixed(1)}h` : '—'} />
      </View>

      <SleepTrendChart logs={logs} />

      <AppText variant="subheading">Log last night</AppText>
      <AppInput
        keyboardType="decimal-pad"
        label="Hours slept"
        onChangeText={setHours}
        placeholder="7.5"
        value={hours}
      />
      <AppInput
        keyboardType="numeric"
        label="Quality (1-5)"
        onChangeText={setQuality}
        placeholder="4"
        value={quality}
      />
      <AppButton busy={mutation.isPending} onPress={handleLog} title="Save sleep log" />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.md },
});
