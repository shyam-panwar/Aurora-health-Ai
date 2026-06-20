import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppInput } from '../../../components/ui/AppInput';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { updateProfile } from '../../../lib/api/client';
import { spacing } from '../../../theme';

export const ProfileInfoScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [busy, setBusy] = useState(false);

  const next = async () => {
    setBusy(true);
    try {
      await updateProfile({
        full_name: name.trim() || null,
        date_of_birth: age ? `${new Date().getFullYear() - parseInt(age, 10)}-01-01` : null,
      });
      router.push('/(onboarding)/lifestyle');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen>
      <AppText variant="title">About you</AppText>
      <AppText color="textSecondary">A few details help Aurora personalize your experience.</AppText>
      <AppInput label="Full name" onChangeText={setName} placeholder="Alex Morgan" value={name} />
      <AppInput keyboardType="numeric" label="Age" onChangeText={setAge} placeholder="28" value={age} />
      <View style={styles.footer}>
        <AppButton busy={busy} onPress={next} title="Continue" />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  footer: { marginTop: spacing.xl },
});
