import { StyleSheet } from 'react-native';

import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { colors, spacing } from '../../../theme';
import type { ActionResult } from '../../../lib/types';

type Props = { action: ActionResult };

const getActionLabel = (tool: string) => {
  switch (tool) {
    case 'add_hydration':
      return 'Hydration updated';
    case 'log_sleep':
      return 'Sleep updated';
    case 'create_habit':
      return 'Habit created';
    case 'complete_habit':
      return 'Habit completed';
    case 'log_meal':
      return 'Meal logged';
    default:
      return tool.replace(/_/g, ' ');
  }
};

export const ActionResultCard = ({ action }: Props) => (
  <AppCard style={StyleSheet.flatten([styles.card, action.success ? styles.success : styles.fail])}>
    <AppText color={action.success ? 'accentWarm' : 'danger'} variant="label">
      {getActionLabel(action.tool)}
    </AppText>
    <AppText variant="subheading">{action.message}</AppText>
    <AppText color="textMuted" variant="caption">
      {action.success ? 'Aurora has already updated your dashboard.' : 'Aurora could not complete that update yet.'}
    </AppText>
  </AppCard>
);

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  fail: { borderColor: colors.danger },
  success: { borderColor: colors.accent },
});
