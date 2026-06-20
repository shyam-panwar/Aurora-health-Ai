import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';

type Props = {
  role: 'user' | 'assistant';
  text: string;
};

export const TranscriptBubble = ({ role, text }: Props) => (
  <View style={[styles.bubble, role === 'user' ? styles.user : styles.assistant]}>
    <AppText color={role === 'user' ? 'background' : 'textMuted'} variant="label">
      {role === 'user' ? 'You' : 'Aurora'}
    </AppText>
    <AppText color={role === 'user' ? 'background' : 'text'}>{text}</AppText>
  </View>
);

const styles = StyleSheet.create({
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
  },
  bubble: {
    borderRadius: radius.xl,
    gap: spacing.sm,
    maxWidth: '85%',
    padding: spacing.lg,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
  },
});
