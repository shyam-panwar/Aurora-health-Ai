import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../theme';

type Props = {
  completed: number;
  total: number;
  onPress?: () => void;
};

export const HabitSummaryCard = memo(({ completed, total, onPress }: Props) => (
  <AppCard onPress={onPress} style={styles.card}>
    <AppText color="textMuted" variant="label">
      Habits
    </AppText>
    <AppText variant="subheading">
      {completed}/{total} today
    </AppText>
  </AppCard>
));

HabitSummaryCard.displayName = 'HabitSummaryCard';

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.xs },
});
