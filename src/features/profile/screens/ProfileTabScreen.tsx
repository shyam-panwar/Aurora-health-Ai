import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { StatPill } from '../../../components/ui/StatPill';
import { signOut } from '../../auth/auth';
import { useHomeDashboard } from '../../home/hooks/useHomeDashboard';
import { spacing } from '../../../theme';

export const ProfileTabScreen = () => {
  const { data } = useHomeDashboard();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch (e) {
      Alert.alert('Sign out failed', e instanceof Error ? e.message : 'Try again');
    }
  };

  return (
    <AppScreen>
      <AppText variant="title">Profile</AppText>
      <AppCard>
        <AppText variant="subheading">{data?.profile.full_name || 'Aurora user'}</AppText>
        <AppText color="textSecondary">{data?.profile.email}</AppText>
      </AppCard>

      <View style={styles.stats}>
        <StatPill label="Water goal" value={`${data?.profile.hydration_goal_ml ?? 2500}ml`} />
        <StatPill label="Sleep goal" value={`${data?.profile.sleep_goal_hours ?? 8}h`} />
      </View>

      <AppButton onPress={() => router.push('/reports/week')} title="Weekly report" variant="secondary" />
      <AppButton onPress={() => router.push('/settings')} title="Settings" variant="secondary" />
      <AppButton onPress={() => router.push('/settings/integrations')} title="Integrations" variant="ghost" />
      <AppButton onPress={handleSignOut} title="Sign out" variant="danger" />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.md },
});
