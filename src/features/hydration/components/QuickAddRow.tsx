import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';

const AMOUNTS = [250, 500, 750];

type Props = { onAdd: (ml: number) => void; disabled?: boolean };

export const QuickAddRow = memo(({ onAdd, disabled }: Props) => {
  const handlePress = useCallback(
    (ml: number) => () => onAdd(ml),
    [onAdd],
  );

  return (
    <View style={styles.row}>
      {AMOUNTS.map((ml) => (
        <Pressable
          key={ml}
          disabled={disabled}
          onPress={handlePress(ml)}
          style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
          <AppText variant="subheading">+{ml}ml</AppText>
        </Pressable>
      ))}
    </View>
  );
});

QuickAddRow.displayName = 'QuickAddRow';

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.lg,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  row: { flexDirection: 'row', gap: spacing.md },
});
