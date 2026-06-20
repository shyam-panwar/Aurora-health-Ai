import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { StatPill } from '../../../components/ui/StatPill';
import { colors, spacing } from '../../../theme';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { HabitSummaryCard } from '../components/HabitSummaryCard';
import { HydrationCard } from '../components/HydrationCard';
import { NutritionCard } from '../components/NutritionCard';
import { SleepCard } from '../components/SleepCard';
import { useHomeDashboard } from '../hooks/useHomeDashboard';

export const HomeScreen = () => {
  const { data, isLoading, refetch, isRefetching } = useHomeDashboard();

  if (isLoading || !data) {
    return (
      <AppScreen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </AppScreen>
    );
  }

  const sleepHours = data.sleep.lastNight
    ? data.sleep.lastNight.duration_minutes / 60
    : data.sleep.weekAverageHours;
  const firstName = data.profile.full_name?.split(' ')[0] || 'there';
  const hydrationPercent =
    data.hydration.goalMl > 0
      ? Math.round((data.hydration.todayTotalMl / data.hydration.goalMl) * 100)
      : 0;
  const greeting =
    new Date().getHours() < 12
      ? 'Good morning'
      : new Date().getHours() < 17
        ? 'Good afternoon'
        : 'Good evening';

  return (
    <AppScreen>
      <AppCard accent elevated style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.header}>
            <AppText color="accentWarm" variant="label">
              {greeting.toUpperCase()}
            </AppText>
            <AppText variant="title">{firstName} 👋</AppText>
            <AppText color="textSecondary">
              Aurora is keeping things light today. Focus on one small win at a time.
            </AppText>
          </View>
          <View style={styles.focusBadge}>
            <AppText color="accent" variant="caption">
              Today's rhythm
            </AppText>
            <AppText variant="subheading">{hydrationPercent}% steady</AppText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatPill label="Hydration" tone="accent" value={`${hydrationPercent}%`} />
          <StatPill label="Sleep" value={`${(data.sleep.weekAverageHours || 0).toFixed(1)}h avg`} />
        </View>

        <View style={styles.heroFooter}>
          <View style={styles.compassRow}>
            <View style={styles.compassDot} />
            <AppText color="textSecondary" style={styles.compassCopy} variant="caption">
              Your dashboard is designed to keep the next healthy choice obvious.
            </AppText>
          </View>
          <AppButton
            onPress={() => router.push('/(tabs)/companion')}
            style={styles.heroButton}
            title="Talk to Aurora"
          />
        </View>
      </AppCard>

      <DailyInsightCard insight={data.insight} />

      <SectionHeader title="Today at a glance" actionLabel="Refresh" onAction={() => refetch()} />

      <View style={styles.grid}>
        <HydrationCard
          goalMl={data.hydration.goalMl}
          onPress={() => router.push('/(tabs)/hydration')}
          totalMl={data.hydration.todayTotalMl}
        />
        <SleepCard
          goalHours={data.sleep.goalHours}
          hours={sleepHours}
          onPress={() => router.push('/(tabs)/sleep')}
        />
      </View>

      <View style={styles.grid}>
        <HabitSummaryCard
          completed={data.habits.completedCount}
          onPress={() => router.push('/(tabs)/habits')}
          total={data.habits.totalActive}
        />
        <NutritionCard
          calories={data.nutrition.todayCalories}
          onPress={() => router.push('/(tabs)/nutrition')}
          protein={data.nutrition.todayProtein}
        />
      </View>

      <AppCard style={styles.supportCard}>
        <AppText color="accentWarm" variant="label">
          SUPPORTIVE BY DESIGN
        </AppText>
        <AppText variant="heading">No pressure, just clarity.</AppText>
        <AppText color="textSecondary">
          Aurora keeps your stats visible without turning them into noise. Check in, make one improvement, and move on with your day.
        </AppText>
      </AppCard>

      {isRefetching ? (
        <AppText color="textMuted" style={styles.refreshing} variant="caption">
          Updating your latest patterns...
        </AppText>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  compassCopy: {
    flex: 1,
  },
  compassDot: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  compassRow: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  focusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.xs,
    minWidth: 122,
    padding: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  header: {
    flex: 1,
    gap: spacing.xs,
  },
  heroButton: {
    width: '100%',
  },
  heroCard: {
    gap: spacing.lg,
  },
  heroFooter: {
    alignItems: 'stretch',
    gap: spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  refreshing: {
    textAlign: 'center',
  },
  supportCard: {
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
