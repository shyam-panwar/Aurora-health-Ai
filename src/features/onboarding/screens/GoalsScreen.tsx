import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { updateProfile } from '../../../lib/api/client';
import { spacing } from '../../../theme';

export const GoalsScreen = () => {
  const [hydration, setHydration] = useState('2500');
  const [sleep, setSleep] = useState('8');
  const [busy, setBusy] = useState(false);

  const next = async () => {
    setBusy(true);
    try {
      await updateProfile({
        hydration_goal_ml: parseInt(hydration, 10) || 2500,
        sleep_goal_hours: parseFloat(sleep) || 8,
      });
      router.push('/(onboarding)/notifications');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen>
      <AppText variant="title">Your goals</AppText>
      <AppText color="textSecondary">Set gentle targets — you can adjust these anytime.</AppText>
      <AppInput keyboardType="numeric" label="Daily water (ml)" onChangeText={setHydration} value={hydration} />
      <AppInput keyboardType="decimal-pad" label="Sleep goal (hours)" onChangeText={setSleep} value={sleep} />
      <View style={styles.footer}>
        <AppButton busy={busy} onPress={next} title="Continue" />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  footer: { marginTop: spacing.xl },
});
