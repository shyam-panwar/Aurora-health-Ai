import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/ui/button';
import { TextField } from '../src/components/ui/text-field';
import { AuthShell } from '../src/features/auth/auth-shell';
import { supabase } from '../src/lib/supabase';
import { useSession } from '../src/providers/session-provider';

export default function ResetPasswordScreen() {
  const { session } = useSession();
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState('');

  if (!session) {
    return <Redirect href="/(auth)/forgot-password" />;
  }

  const handleUpdatePassword = async () => {
    try {
      setBusy(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      Alert.alert('Password updated', 'Your password has been updated. You can continue securely.');
    } catch (error) {
      Alert.alert(
        'Could not update password',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      subtitle="This screen opens from the password reset deep link and updates the authenticated recovery session."
      title="Choose a new password">
      <TextField
        autoComplete="new-password"
        hint="Use at least 8 characters."
        label="New password"
        onChangeText={setPassword}
        placeholder="Create a new password"
        secureTextEntry
        value={password}
      />
      <Button busy={busy} onPress={handleUpdatePassword} title="Update password" />
      <View style={styles.note}>
        <Text style={styles.noteText}>
          After updating your password, your new session remains active and protected routes stay available.
        </Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  note: {
    backgroundColor: '#111C2E',
    borderColor: '#1F2C42',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  noteText: {
    color: '#9DB0D0',
    fontSize: 13,
    lineHeight: 20,
  },
});
