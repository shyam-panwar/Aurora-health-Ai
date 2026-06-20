import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { colors, spacing } from '../../../theme';

export const WelcomeScreen = () => (
  <AppScreen scroll={false} style={styles.screen}>
    <View style={styles.hero}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <AppText color="accentWarm" variant="label">
          PERSONAL HEALTH, KEPT GENTLE
        </AppText>
      </View>
      <AppText style={styles.logo} variant="hero">
        Aurora
      </AppText>
      <AppText color="textSecondary" style={styles.tagline}>
        A supportive health companion that helps you notice patterns, stay consistent, and feel a little more in control each day.
      </AppText>
      <View style={styles.chips}>
        <View style={styles.chip}>
          <AppText variant="caption">Thoughtful insights</AppText>
        </View>
        <View style={styles.chip}>
          <AppText variant="caption">Voice-friendly logging</AppText>
        </View>
      </View>
    </View>
    <AppCard accent elevated style={styles.previewCard}>
      <AppText color="accentWarm" variant="label">
        TODAY'S TONE
      </AppText>
      <AppText variant="heading">Calm, clear, and made for momentum.</AppText>
      <AppText color="textSecondary">
        Aurora keeps your next step obvious, whether that means logging water, checking sleep, or talking something through.
      </AppText>
    </AppCard>
    <View style={styles.actions}>
      <AppButton onPress={() => router.push('/(auth)/signup')} title="Get started" />
      <AppButton
        onPress={() => router.push('/(auth)/login')}
        title="I have an account"
        variant="secondary"
      />
    </View>
  </AppScreen>
);

const styles = StyleSheet.create({
  actions: { gap: spacing.md, width: '100%' },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  eyebrowDot: {
    backgroundColor: colors.accentWarm,
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  eyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  hero: { gap: spacing.lg, justifyContent: 'center' },
  logo: { color: colors.text, maxWidth: 420 },
  previewCard: {
    gap: spacing.sm,
    marginTop: 'auto',
  },
  screen: { gap: spacing.xxl, justifyContent: 'space-between', paddingBottom: spacing.huge },
  tagline: { fontSize: 17, lineHeight: 26, maxWidth: 480 },
});
