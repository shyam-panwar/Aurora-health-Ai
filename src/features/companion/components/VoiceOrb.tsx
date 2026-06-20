import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../../../theme';

type Props = { active: boolean; speaking?: boolean };

export const VoiceOrb = ({ active, speaking }: Props) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    if (active || speaking) {
      scale.value = withRepeat(
        withSequence(withTiming(1.08, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        true,
      );
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(0.6, { duration: 300 });
    }
  }, [active, speaking, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.orb, style, (active || speaking) && styles.active]} />
      <View style={styles.core} />
    </View>
  );
};

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  core: {
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 24,
    opacity: 0.9,
    position: 'absolute',
    width: 24,
  },
  orb: {
    backgroundColor: colors.accentSoft,
    borderRadius: 80,
    height: 160,
    width: 160,
  },
  wrapper: {
    alignItems: 'center',
    height: 180,
    justifyContent: 'center',
  },
});
