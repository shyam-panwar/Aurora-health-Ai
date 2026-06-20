import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { EmptyState } from '../../../components/ui/EmptyState';
import { StatPill } from '../../../components/ui/StatPill';
import { addMeal, fetchMeals } from '../../../lib/api/client';
import { queryKeys } from '../../../lib/api/queries';
import { useInvalidateDashboard } from '../../home/hooks/useHomeDashboard';
import { MealCard } from '../components/MealCard';
import { colors, radius, spacing } from '../../../theme';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const NutritionScreen = () => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealType, setMealType] = useState<(typeof MEAL_TYPES)[number]>('lunch');
  const [busy, setBusy] = useState(false);
  const invalidate = useInvalidateDashboard();

  const { data: meals = [], refetch } = useQuery({
    queryKey: queryKeys.meals,
    queryFn: () => fetchMeals(1),
  });

  const totalCal = meals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (m.protein_g ?? 0), 0);

  const handleLog = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'What did you eat?');
      return;
    }
    setBusy(true);
    try {
      await addMeal({
        name: name.trim(),
        mealType,
        calories: calories ? parseInt(calories, 10) : undefined,
        proteinG: protein ? parseFloat(protein) : undefined,
      });
      setName('');
      setCalories('');
      setProtein('');
      await refetch();
      invalidate();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen>
      <AppText variant="title">Nutrition</AppText>
      <AppText color="textSecondary">Awareness over obsession — log meals mindfully.</AppText>

      <View style={styles.stats}>
        <StatPill label="Today" tone="accent" value={`${totalCal} kcal`} />
        <StatPill label="Protein" value={`${Math.round(totalProtein)}g`} />
      </View>

      <View style={styles.types}>
        {MEAL_TYPES.map((t) => (
          <Pressable
            key={t}
            onPress={() => setMealType(t)}
            style={[styles.typeChip, mealType === t && styles.typeActive]}>
            <AppText color={mealType === t ? 'background' : 'textSecondary'} variant="caption">
              {t}
            </AppText>
          </Pressable>
        ))}
      </View>

      <AppInput label="Meal name" onChangeText={setName} placeholder="Grilled salmon bowl" value={name} />
      <AppInput keyboardType="numeric" label="Calories (optional)" onChangeText={setCalories} value={calories} />
      <AppInput keyboardType="decimal-pad" label="Protein g (optional)" onChangeText={setProtein} value={protein} />
      <AppButton busy={busy} onPress={handleLog} title="Log meal" />

      {meals.length === 0 ? (
        <EmptyState description="Log your first meal to start building awareness." emoji="🥗" title="No meals today" />
      ) : (
        meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.md },
  typeActive: { backgroundColor: colors.accent },
  typeChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
