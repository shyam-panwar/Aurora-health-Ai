import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/ui/button';
import { TextField } from '../../src/components/ui/text-field';
import { AuthShell } from '../../src/features/auth/auth-shell';
import { SocialAuthButtons } from '../../src/features/auth/social-auth-buttons';
import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  const [busyAction, setBusyAction] = useState<'email' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginWithEmail = async () => {
    try {
      setBusyAction('email');

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <AuthShell
      subtitle="Sign in with email, Google, or Apple. Supabase handles the session while Aurora deep-links you back into the app."
      title="Welcome back">
      <TextField
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <TextField
        autoComplete="password"
        label="Password"
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
      />
      <Link href="/(auth)/forgot-password" style={styles.link}>
        Forgot password?
      </Link>
      <Button busy={busyAction === 'email'} onPress={loginWithEmail} title="Login" />
      <SocialAuthButtons mode="login" />
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Need an account?</Text>
        <Link href="/(auth)/signup" style={styles.link}>
          Create one
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
  link: {
    color: '#7FC7E8',
    fontSize: 14,
    fontWeight: '700',
  },
});
