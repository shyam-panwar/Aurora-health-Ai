import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { colors, spacing } from '../../../theme';
import type { InsightSnapshot } from '../../../lib/types';

type Props = { insight: InsightSnapshot | null };

export const DailyInsightCard = memo(({ insight }: Props) => {
  if (!insight) return null;

  return (
    <AppCard accent style={styles.card}>
      <View style={styles.badge}>
        <AppText color="accent" variant="label">
          Daily insight
        </AppText>
      </View>
      <AppText variant="heading">{insight.title}</AppText>
      <AppText color="textSecondary">{insight.body}</AppText>
    </AppCard>
  );
});

DailyInsightCard.displayName = 'DailyInsightCard';

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentMuted,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
  },
});
