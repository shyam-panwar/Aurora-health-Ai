import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { updatePreferences, updateProfile } from '../../../lib/api/client';
import { colors, radius, spacing } from '../../../theme';

export const TrackingSetupScreen = () => {
  const [method, setMethod] = useState<'manual' | 'device'>('manual');
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    setBusy(true);
    try {
      await updatePreferences({ tracking_method: method });
      await updateProfile({ onboarding_completed: true });
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen>
      <AppText variant="title">Tracking setup</AppText>
      <AppText color="textSecondary">Manual tracking is recommended to start. Device sync comes later.</AppText>

      <Pressable
        onPress={() => setMethod('manual')}
        style={[styles.option, method === 'manual' && styles.active]}>
        <AppText variant="subheading">✍️ Manual logging</AppText>
        <AppText color="textSecondary" variant="caption">
          Quick-add buttons and voice logging
        </AppText>
      </Pressable>

      <Pressable
        onPress={() => setMethod('device')}
        style={[styles.option, method === 'device' && styles.active]}>
        <AppText variant="subheading">⌚ Device sync (coming soon)</AppText>
        <AppText color="textSecondary" variant="caption">
          Apple Health, Health Connect, and more
        </AppText>
      </Pressable>

      <AppButton busy={busy} onPress={finish} title="Enter Aurora" />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  active: { borderColor: colors.accent },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 2,
    gap: spacing.xs,
    padding: spacing.lg,
  },
});
