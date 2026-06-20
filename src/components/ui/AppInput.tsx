import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '../../theme';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const AppInput = ({ label, error, style, ...rest }: AppInputProps) => (
  <View style={styles.wrapper}>
    {label ? (
      <AppText color="textSecondary" variant="caption">
        {label}
      </AppText>
    ) : null}
    <TextInput
      placeholderTextColor={colors.textMuted}
      style={[styles.input, error ? styles.inputError : null, style]}
      {...rest}
    />
    {error ? (
      <AppText color="danger" variant="caption">
        {error}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    backgroundColor: 'rgba(21, 34, 56, 0.88)',
    borderColor: colors.borderSubtle,
    borderRadius: radius.xl,
    borderWidth: 1,
    color: colors.text,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputError: {
    borderColor: colors.danger,
  },
  wrapper: {
    gap: spacing.sm,
  },
});
