import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { colors, radius, shadows, spacing } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AppCardProps = PropsWithChildren<
  PressableProps & {
    onPress?: () => void;
    style?: ViewStyle;
    elevated?: boolean;
    accent?: boolean;
  }
>;

export const AppCard = ({
  children,
  onPress,
  style,
  elevated = false,
  accent = false,
  ...rest
}: AppCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <View
      style={[
        styles.card,
        elevated && shadows.card,
        accent && styles.accent,
        style,
      ]}>
      <View style={styles.shell} />
      <View style={styles.glow} />
      <View style={[styles.cornerGlow, accent && styles.cornerGlowAccent]} />
      {children}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 20, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 400 });
      }}
      style={animatedStyle}
      {...rest}>
      {content}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  accent: {
    backgroundColor: 'rgba(18, 35, 56, 0.98)',
    borderColor: 'rgba(130, 213, 177, 0.42)',
  },
  card: {
    backgroundColor: 'rgba(13, 24, 40, 0.95)',
    borderColor: colors.borderSubtle,
    borderRadius: radius.xxl,
    borderWidth: 1,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  cornerGlow: {
    backgroundColor: 'rgba(127, 199, 232, 0.08)',
    borderRadius: 999,
    height: 110,
    position: 'absolute',
    right: -24,
    top: -20,
    width: 110,
  },
  cornerGlowAccent: {
    backgroundColor: 'rgba(244, 197, 123, 0.08)',
  },
  glow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.xxl,
    height: 2,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
    top: 0,
  },
  shell: {
    bottom: 0,
    borderColor: 'rgba(255,255,255,0.02)',
    borderRadius: radius.xxl,
    borderWidth: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
