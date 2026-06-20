import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

type ButtonProps = {
  busy?: boolean;
  disabled?: boolean;
  onPress: () => void | Promise<void>;
  title: string;
  variant?: 'primary' | 'secondary';
};

export const Button = ({
  busy = false,
  disabled = false,
  onPress,
  title,
  variant = 'primary',
}: ButtonProps) => {
  const isDisabled = disabled || busy;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => {
        void onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.primary,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
      ]}>
      <View pointerEvents="none" style={styles.shine} />
      {busy ? (
        <ActivityIndicator color={variant === 'secondary' ? '#DDE8F7' : '#06101C'} />
      ) : (
        <Text style={variant === 'secondary' ? styles.secondaryLabel : styles.primaryLabel}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 54,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  } satisfies ViewStyle,
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  primary: {
    backgroundColor: '#82D5B1',
  },
  primaryLabel: {
    color: '#06101C',
    fontSize: 16,
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: 'rgba(20, 33, 52, 0.92)',
    borderColor: '#22324A',
    borderWidth: 1,
  },
  secondaryLabel: {
    color: '#E6EEF9',
    fontSize: 16,
    fontWeight: '700',
  },
  shine: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    height: 16,
    left: 16,
    position: 'absolute',
    top: 8,
    width: 110,
  },
});
