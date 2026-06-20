import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { colors, radius, typography } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  busy?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  busy = false,
  disabled = false,
  style,
}: AppButtonProps) => {
  const scale = useSharedValue(1);
  const isDisabled = disabled || busy;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isDisabled ? 0.6 : 1,
  }));

  return (
    <AnimatedPressable
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 400 });
      }}
      style={[styles.base, styles[variant], animatedStyle, style]}>
      <View pointerEvents="none" style={styles.shine} />
      {busy ? (
        <ActivityIndicator color={variant === 'primary' ? colors.background : colors.text} />
      ) : (
        <Text style={[styles.label, variant === 'primary' && styles.labelPrimary]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.full,
    justifyContent: 'center',
    minHeight: 54,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
    width: '100%',
  },
  danger: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderColor: colors.danger,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: colors.borderSubtle,
    borderWidth: 1,
  },
  label: {
    ...typography.subheading,
    color: colors.text,
  },
  labelPrimary: {
    color: colors.background,
  },
  primary: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  shine: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.full,
    height: 18,
    left: 18,
    position: 'absolute',
    top: 8,
    width: 120,
  },
  secondary: {
    backgroundColor: 'rgba(20, 33, 52, 0.92)',
    borderColor: colors.borderSubtle,
    borderWidth: 1,
  },
});
