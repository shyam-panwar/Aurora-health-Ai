import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../theme';
import type { MealLog } from '../../../lib/types';

type Props = { meal: MealLog };

export const MealCard = memo(({ meal }: Props) => (
  <AppCard style={styles.card}>
    <View style={styles.row}>
      <AppText variant="subheading">{meal.name}</AppText>
      <AppText color="textMuted" variant="caption">
        {meal.meal_type}
      </AppText>
    </View>
    <AppText color="textSecondary">
      {meal.calories ? `${meal.calories} kcal` : 'No calories logged'}
      {meal.protein_g ? ` · ${meal.protein_g}g protein` : ''}
    </AppText>
  </AppCard>
));

MealCard.displayName = 'MealCard';

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
