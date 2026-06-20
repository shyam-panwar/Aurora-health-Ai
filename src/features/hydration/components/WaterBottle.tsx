import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../../../theme';

type Props = { fillPercent: number };

export const WaterBottle = ({ fillPercent }: Props) => {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(Math.min(Math.max(fillPercent, 0), 1), { duration: 600 });
  }, [fill, fillPercent]);

  const fillStyle = useAnimatedStyle(() => ({
    height: `${fill.value * 100}%` as `${number}%`,
  }));

  return (
    <View style={styles.bottle}>
      <View style={styles.inner}>
        <Animated.View style={[styles.water, fillStyle]} />
      </View>
      <View style={styles.neck} />
    </View>
  );
};

const styles = StyleSheet.create({
  bottle: {
    alignItems: 'center',
    height: 160,
    width: 80,
  },
  inner: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 2,
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  neck: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    marginTop: -2,
    width: 28,
  },
  water: {
    backgroundColor: colors.accent,
    bottom: 0,
    left: 0,
    opacity: 0.85,
    position: 'absolute',
    right: 0,
  },
});
