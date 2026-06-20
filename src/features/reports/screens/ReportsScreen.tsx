import { useQuery } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { StatPill } from '../../../components/ui/StatPill';
import { fetchWeeklyReport } from '../../../lib/api/client';
import { queryKeys } from '../../../lib/api/queries';
import { spacing } from '../../../theme';

export const ReportsScreen = () => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.weeklyReport('week'),
    queryFn: fetchWeeklyReport,
  });

  return (
    <AppScreen>
      <AppText variant="title">Weekly report</AppText>
      <AppText color="textSecondary">Your consistency at a glance.</AppText>

      {isLoading || !data ? (
        <AppText color="textMuted">Loading report…</AppText>
      ) : (
        <>
          <AppCard style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <ProgressRing progress={data.consistencyScore / 100} size={88} />
              <View style={styles.scoreCopy}>
                <AppText variant="heading">{data.consistencyScore}%</AppText>
                <AppText color="textSecondary">Consistency score</AppText>
              </View>
            </View>
          </AppCard>

          <View style={styles.stats}>
            <StatPill label="Water" value={`${(data.totalWaterMl / 1000).toFixed(1)}L`} />
            <StatPill label="Sleep avg" value={`${data.avgSleepHours.toFixed(1)}h`} />
          </View>
          <View style={styles.stats}>
            <StatPill label="Habit checks" tone="accent" value={String(data.habitCompletions)} />
            <StatPill label="Calories" value={String(data.totalCalories)} />
          </View>

          {data.achievements.length > 0 ? (
            <>
              <AppText variant="subheading">Achievements</AppText>
              {data.achievements.map((a) => (
                <AppCard key={a.id}>
                  <AppText variant="subheading">{a.title}</AppText>
                </AppCard>
              ))}
            </>
          ) : null}
        </>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scoreCard: { alignItems: 'center' },
  scoreCopy: { gap: spacing.xs },
  scoreRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.lg },
  stats: { flexDirection: 'row', gap: spacing.md },
});
