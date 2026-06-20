import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors, spacing } from '../../theme';

type EmptyStateProps = {
  title: string;
  description: string;
  emoji?: string;
};

export const EmptyState = ({ title, description, emoji = '✨' }: EmptyStateProps) => (
  <View style={styles.container}>
    <View style={styles.badge}>
      <AppText style={styles.emoji} variant="hero">
        {emoji}
      </AppText>
    </View>
    <AppText variant="heading">{title}</AppText>
    <AppText color="textSecondary" style={styles.description}>
      {description}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxxl,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(125, 211, 168, 0.08)',
    borderColor: colors.borderSubtle,
    borderRadius: 999,
    borderWidth: 1,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  description: {
    textAlign: 'center',
  },
  emoji: {
    fontSize: 40,
  },
});
