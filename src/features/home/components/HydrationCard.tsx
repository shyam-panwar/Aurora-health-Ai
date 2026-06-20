import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { colors, spacing } from '../../../theme';

type Props = {
  totalMl: number;
  goalMl: number;
  onPress?: () => void;
};

export const HydrationCard = memo(({ totalMl, goalMl, onPress }: Props) => {
  const progress = goalMl > 0 ? totalMl / goalMl : 0;

  return (
    <AppCard onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <AppText color="textMuted" variant="label">
            Hydration
          </AppText>
          <AppText variant="subheading">
            {totalMl}
            <AppText color="textMuted"> / {goalMl}ml</AppText>
          </AppText>
        </View>
        <ProgressRing progress={progress} size={56} />
      </View>
    </AppCard>
  );
});

HydrationCard.displayName = 'HydrationCard';

// const styles = StyleSheet.create({
//   card: { flex: 1 },
//   copy: { flex: 1, gap: spacing.xs },
//   row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
// });
const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 70,
  },

  copy: {
    flex: 1,
    gap: spacing.xs,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});