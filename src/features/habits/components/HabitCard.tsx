import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { colors, spacing } from '../../../theme';

type HabitItem = {
  id: string;
  title: string;
  icon: string;
  completedToday: boolean;
  streak: number;
  is_paused: boolean;
};

type Props = {
  habit: HabitItem;
  onToggle: (id: string, complete: boolean) => void;
  onLongPress?: (id: string) => void;
};

export const HabitCard = memo(({ habit, onToggle, onLongPress }: Props) => (
  <AppCard style={StyleSheet.flatten([styles.card, habit.completedToday ? styles.done : undefined])}>
    <Pressable
      onLongPress={() => onLongPress?.(habit.id)}
      onPress={() => onToggle(habit.id, !habit.completedToday)}
      style={styles.row}>
      <AppText style={styles.icon}>{habit.icon}</AppText>
      <View style={styles.copy}>
        <AppText variant="subheading">{habit.title}</AppText>
        <AppText color="textMuted" variant="caption">
          {habit.streak > 0 ? `${habit.streak} day streak` : 'Start your streak'}
        </AppText>
      </View>
      <View style={[styles.check, habit.completedToday && styles.checkDone]}>
        {habit.completedToday ? <AppText>✓</AppText> : null}
      </View>
    </Pressable>
  </AppCard>
));

HabitCard.displayName = 'HabitCard';

const styles = StyleSheet.create({
  card: { padding: 0 },
  check: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  checkDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  copy: { flex: 1, gap: 2 },
  done: { borderColor: colors.accent },
  icon: { fontSize: 24 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
});
