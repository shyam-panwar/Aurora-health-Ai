import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { colors, spacing } from '../../../theme';

type Props = {
  hours: number;
  goalHours: number;
  onPress?: () => void;
};

export const SleepCard = memo(({ hours, goalHours, onPress }: Props) => (
  <AppCard onPress={onPress} style={styles.card}>
    <AppText color="textMuted" variant="label">
      Sleep
    </AppText>
    <AppText variant="subheading">
      {hours > 0 ? `${hours.toFixed(1)}h` : 'Not logged'}
    </AppText>
    <AppText color="textSecondary" variant="caption">
      Goal {goalHours}h · Week avg
    </AppText>
  </AppCard>
));

SleepCard.displayName = 'SleepCard';

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.xs },
});
