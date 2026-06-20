import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../theme';

type Props = {
  calories: number;
  protein: number;
  onPress?: () => void;
};

export const NutritionCard = memo(({ calories, protein, onPress }: Props) => (
  <AppCard onPress={onPress} style={styles.card}>
    <AppText color="textMuted" variant="label">
      Nutrition
    </AppText>
    <AppText variant="subheading">{calories} kcal</AppText>
    <AppText color="textSecondary" variant="caption">
      {Math.round(protein)}g protein
    </AppText>
  </AppCard>
));

NutritionCard.displayName = 'NutritionCard';

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.xs },
});
