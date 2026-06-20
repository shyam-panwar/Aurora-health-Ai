import { useEffect, useState } from 'react';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppProviders } from '../src/providers/AppProviders';
import { useSession } from '../src/providers/session-provider';
import { fetchProfile } from '../src/lib/api/client';
import { AppText } from '../src/components/ui/AppText';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const RootNavigator = () => {
  const { initialized, session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const segments = useSegments();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) {
      setOnboardingDone(null);
      return;
    }
    fetchProfile()
      .then((p) => setOnboardingDone(p.onboarding_completed))
      .catch(() => setOnboardingDone(false));
  }, [session]);

  useEffect(() => {
    if (!initialized) return;

    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const isAuthCallback = pathname === '/auth/callback';
    const isResetScreen = pathname === '/reset-password';

    if (!session && !inAuthGroup && !isAuthCallback && !isResetScreen) {
      router.replace('/(auth)/welcome');
      return;
    }

    if (session && inAuthGroup) {
      if (onboardingDone === false) {
        router.replace('/(onboarding)/profile');
      } else if (onboardingDone === true) {
        router.replace('/(tabs)/home');
      }
      return;
    }

    if (session && onboardingDone === false && !inOnboarding && !isResetScreen) {
      router.replace('/(onboarding)/profile');
      return;
    }

    if (session && onboardingDone === true && (inAuthGroup || inOnboarding)) {
      router.replace('/(tabs)/home');
    }
  }, [initialized, onboardingDone, pathname, router, segments, session]);

  if (!initialized || (session && onboardingDone === null)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accentSoft} size="large" />
        <AppText variant="title">Aurora</AppText>
        <AppText color="textSecondary">Preparing your wellness space…</AppText>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ animation: 'fade', contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="reports/[range]" options={{ headerShown: true, title: 'Report' }} />
      <Stack.Screen name="settings/index" options={{ headerShown: true, title: 'Settings' }} />
      <Stack.Screen name="settings/integrations" options={{ headerShown: true, title: 'Integrations' }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
});
