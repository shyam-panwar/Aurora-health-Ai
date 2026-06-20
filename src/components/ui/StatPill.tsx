import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors, radius, spacing } from '../../theme';

type StatPillProps = {
  label: string;
  value: string;
  tone?: 'default' | 'accent' | 'warning';
};

export const StatPill = ({ label, value, tone = 'default' }: StatPillProps) => (
  <View style={[styles.pill, tone === 'accent' && styles.accent, tone === 'warning' && styles.warning]}>
    <AppText color="textMuted" style={styles.label} variant="label">
      {label}
    </AppText>
    <AppText style={styles.value} variant="subheading">
      {value}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  accent: {
    backgroundColor: 'rgba(130, 213, 177, 0.10)',
    borderColor: 'rgba(130, 213, 177, 0.28)',
  },
  label: {
    textTransform: 'uppercase',
  },
  pill: {
    backgroundColor: 'rgba(20, 33, 52, 0.82)',
    borderColor: colors.borderSubtle,
    borderRadius: radius.xl,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  value: {
    letterSpacing: -0.2,
  },
  warning: {
    backgroundColor: 'rgba(244, 197, 123, 0.12)',
    borderColor: 'rgba(244, 197, 123, 0.26)',
  },
});
