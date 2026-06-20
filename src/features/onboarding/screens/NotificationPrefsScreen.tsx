import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { updatePreferences } from '../../../lib/api/client';
import { colors, radius, spacing } from '../../../theme';

export const NotificationPrefsScreen = () => {
  const [hydration, setHydration] = useState(true);
  const [sleep, setSleep] = useState(true);
  const [habits, setHabits] = useState(true);
  const [busy, setBusy] = useState(false);

  const next = async () => {
    setBusy(true);
    try {
      await updatePreferences({
        hydration_reminders: hydration,
        sleep_reminders: sleep,
        habit_reminders: habits,
      });
      router.push('/(onboarding)/tracking-setup');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen>
      <AppText variant="title">Reminders</AppText>
      <AppText color="textSecondary">Local reminders help build consistency. You can change these later.</AppText>

      <PrefRow label="Hydration reminders" onChange={setHydration} value={hydration} />
      <PrefRow label="Sleep wind-down" onChange={setSleep} value={sleep} />
      <PrefRow label="Habit nudges" onChange={setHabits} value={habits} />

      <AppButton busy={busy} onPress={next} title="Continue" />
    </AppScreen>
  );
};

const PrefRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <Pressable style={styles.row}>
    <AppText variant="subheading">{label}</AppText>
    <Switch
      onValueChange={onChange}
      thumbColor={colors.white}
      trackColor={{ false: colors.border, true: colors.accent }}
      value={value}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
});
