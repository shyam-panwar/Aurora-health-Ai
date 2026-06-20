import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui/button';
import { isSupabaseConfigured } from '../../lib/env';
import { signInWithApple, signInWithGoogle } from './auth';

type SocialAuthButtonsProps = {
  mode: 'login' | 'signup';
};

export const SocialAuthButtons = ({ mode }: SocialAuthButtonsProps) => {
  const [busyAction, setBusyAction] = useState<'apple' | 'google' | null>(null);

  const handleGoogle = async () => {
    try {
      setBusyAction('google');
      await signInWithGoogle();
    } catch (error) {
      Alert.alert(
        'Google sign-in failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleApple = async () => {
    try {
      setBusyAction('apple');
      await signInWithApple();
    } catch (error) {
      Alert.alert(
        'Apple sign-in failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerLabel}>
          {mode === 'signup' ? 'or create an account with' : 'or continue with'}
        </Text>
        <View style={styles.line} />
      </View>
      <Button
        busy={busyAction === 'google'}
        disabled={!isSupabaseConfigured}
        onPress={handleGoogle}
        title={mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
        variant="secondary"
      />
      {Platform.OS === 'ios' ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          buttonType={
            mode === 'signup'
              ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
              : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
          }
          cornerRadius={16}
          onPress={() => {
            void handleApple();
          }}
          style={styles.appleButton}
        />
      ) : null}
      <Text style={styles.helper}>
        {!isSupabaseConfigured
          ? 'Add your Supabase public credentials to .env before testing social auth.'
          : 'Enable Google and Apple in Supabase Auth and allow auroraauth://auth/callback as a redirect URL.'}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  appleButton: {
    height: 54,
    width: '100%',
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  dividerLabel: {
    color: '#6B7C99',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  helper: {
    color: '#7E8BA3',
    fontSize: 13,
    lineHeight: 18,
  },
  line: {
    backgroundColor: '#1F2C42',
    flex: 1,
    height: 1,
  },
});
