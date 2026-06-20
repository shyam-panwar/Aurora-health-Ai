import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { updateProfile } from '../../../lib/api/client';
import { colors, radius, spacing } from '../../../theme';

const LEVELS = ['sedentary', 'light', 'moderate', 'active'] as const;

export const LifestyleScreen = () => {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('moderate');
  const [busy, setBusy] = useState(false);

  const next = async () => {
    setBusy(true);
    try {
      await updateProfile({ activity_level: level });
      router.push('/(onboarding)/goals');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen>
      <AppText variant="title">Your lifestyle</AppText>
      <AppText color="textSecondary">How active is your typical day?</AppText>
      <View style={styles.options}>
        {LEVELS.map((l) => (
          <Pressable
            key={l}
            onPress={() => setLevel(l)}
            style={[styles.chip, level === l && styles.active]}>
            <AppText color={level === l ? 'background' : 'text'} variant="subheading">
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </AppText>
          </Pressable>
        ))}
      </View>
      <AppButton busy={busy} onPress={next} title="Continue" />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  chip: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  options: { gap: spacing.md },
});
