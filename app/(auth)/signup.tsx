import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/ui/button';
import { TextField } from '../../src/components/ui/text-field';
import { AuthShell } from '../../src/features/auth/auth-shell';
import { SocialAuthButtons } from '../../src/features/auth/social-auth-buttons';
import { isSupabaseConfigured } from '../../src/lib/env';
import { supabase } from '../../src/lib/supabase';

export default function SignupScreen() {
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignup = async () => {
    try {
      setBusy(true);

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Check your inbox',
        'We sent a confirmation email. Once confirmed, you can log in right away.',
      );
    } catch (error) {
      Alert.alert('Signup failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      subtitle="Create an account with email, Google, or Apple. Supabase manages confirmation, session creation, and refresh tokens."
      title="Create your account">
      <TextField
        autoComplete="name"
        label="Full name"
        onChangeText={setFullName}
        placeholder="Aurora User"
        value={fullName}
      />
      <TextField
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <TextField
        autoComplete="new-password"
        hint="Use at least 8 characters."
        label="Password"
        onChangeText={setPassword}
        placeholder="Create a password"
        secureTextEntry
        value={password}
      />
      <Button
        busy={busy}
        disabled={!isSupabaseConfigured}
        onPress={handleSignup}
        title="Sign up"
      />
      <SocialAuthButtons mode="signup" />
      <Text style={styles.helper}>
        {!isSupabaseConfigured
          ? 'Add your Supabase public credentials to .env before testing signup.'
          : 'Email signups appear in Supabase Auth automatically, and social signups return through auroraauth://auth/callback.'}
      </Text>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account?</Text>
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
