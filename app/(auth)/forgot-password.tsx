import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/ui/button';
import { TextField } from '../../src/components/ui/text-field';
import { getPasswordResetRedirectTo } from '../../src/features/auth/auth';
import { AuthShell } from '../../src/features/auth/auth-shell';
import { isSupabaseConfigured } from '../../src/lib/env';
import { supabase } from '../../src/lib/supabase';

export default function ForgotPasswordScreen() {
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      setBusy(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getPasswordResetRedirectTo(),
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Reset email sent',
        'Open the link from your inbox on this device to set a new password.',
      );
    } catch (error) {
      Alert.alert(
        'Could not send reset email',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      subtitle="Enter your email and we will send a secure reset link that deep-links back into the app."
      title="Reset your password">
      <TextField
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <Button
        busy={busy}
        disabled={!isSupabaseConfigured}
        onPress={handleForgotPassword}
        title="Send reset link"
      />
      <Text style={styles.helper}>
        {!isSupabaseConfigured
          ? 'Add Supabase credentials first so reset emails can be generated.'
          : 'Remember to add auroraauth://reset-password to Supabase redirect URLs.'}
      </Text>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Back to sign in?</Text>
        <Link href="/(auth)/login" style={styles.link}>
          Login
        </Link>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  footerText: {
    color: '#8EA0BF',
    fontSize: 14,
  },
  helper: {
    color: '#7E8BA3',
    fontSize: 13,
    lineHeight: 18,
  },
  link: {
    color: '#7FC7E8',
    fontSize: 14,
    fontWeight: '700',
  },
});
