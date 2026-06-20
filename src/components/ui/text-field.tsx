import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

type TextFieldProps = TextInputProps & {
  hint?: string;
  label: string;
};

export const TextField = ({ hint, label, ...props }: TextFieldProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: 'rgba(20, 33, 52, 0.92)',
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    color: colors.text,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  wrapper: {
    width: '100%',
  },
});
