import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { addHydration } from '../../../lib/api/client';
import { useDashboardMutation, useHomeDashboard } from '../../home/hooks/useHomeDashboard';
import { QuickAddRow } from '../components/QuickAddRow';
import { WaterBottle } from '../components/WaterBottle';
import { colors, spacing } from '../../../theme';

export const HydrationScreen = () => {
  const { data } = useHomeDashboard();
  const [customMl, setCustomMl] = useState('');
  const mutation = useDashboardMutation(addHydration);

  const total = data?.hydration.todayTotalMl ?? 0;
  const goal = data?.hydration.goalMl ?? 2500;
  const fill = goal > 0 ? total / goal : 0;

  const handleAdd = (ml: number) => {
    mutation.mutate(ml, {
      onError: (e) => Alert.alert('Error', e instanceof Error ? e.message : 'Failed to log'),
    });
  };

  const handleCustom = () => {
    const ml = parseInt(customMl, 10);
    if (!ml || ml <= 0) {
      Alert.alert('Invalid amount', 'Enter a positive number of milliliters.');
      return;
    }
    handleAdd(ml);
    setCustomMl('');
  };

  return (
    <AppScreen>
      <AppText variant="title">Hydration</AppText>
      <AppText color="textSecondary">
        Stay gently hydrated throughout the day.
      </AppText>

      <View style={styles.visual}>
        <WaterBottle fillPercent={fill} />
        <AppText variant="heading">{total}ml</AppText>
        <AppText color="textMuted">of {goal}ml goal</AppText>
      </View>

      <SectionHeader title="Quick add" />
      <QuickAddRow disabled={mutation.isPending} onAdd={handleAdd} />

      <AppInput
        keyboardType="numeric"
        label="Custom amount (ml)"
        onChangeText={setCustomMl}
        placeholder="e.g. 350"
        value={customMl}
      />
      <AppButton busy={mutation.isPending} onPress={handleCustom} title="Log custom amount" variant="secondary" />

      <SectionHeader title="Today's log" />
      {(data?.hydration.logs.length ?? 0) === 0 ? (
        <EmptyState description="Tap a quick-add button to log your first drink." title="No water logged yet" emoji="💧" />
      ) : (
        data?.hydration.logs.map((log) => (
          <View key={log.id} style={styles.logRow}>
            <AppText variant="subheading">+{log.amount_ml}ml</AppText>
            <AppText color="textMuted" variant="caption">
              {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </AppText>
          </View>
        ))
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  logRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  visual: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
});
