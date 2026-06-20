import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors, spacing } from '../../theme';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <View style={styles.row}>
    <AppText style={styles.title} variant="subheading">
      {title}
    </AppText>
    {actionLabel && onAction ? (
      <Pressable hitSlop={8} onPress={onAction} style={styles.action}>
        <AppText color="accent" variant="caption">
          {actionLabel}
        </AppText>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  action: {
    backgroundColor: 'rgba(130, 213, 177, 0.08)',
    borderColor: 'rgba(130, 213, 177, 0.14)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    letterSpacing: -0.2,
  },
});
