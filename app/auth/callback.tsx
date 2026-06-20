import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/ui/AppText';
import { colors } from '../../src/theme';

export default function AuthCallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accentSoft} size="large" />
      <AppText variant="title">Finishing sign-in…</AppText>
      <AppText color="textSecondary" style={styles.copy}>
        Aurora is securing your session and sending you to the right screen.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  copy: {
    maxWidth: 280,
    textAlign: 'center',
  },
});
