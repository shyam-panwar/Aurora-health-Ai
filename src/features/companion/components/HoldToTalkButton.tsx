import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius } from '../../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  recording: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  disabled?: boolean;
  label?: string;
};

export const HoldToTalkButton = ({
  recording,
  onPressIn,
  onPressOut,
  disabled,
  label,
}: Props) => {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.95);
        onPressIn();
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        onPressOut();
      }}
      style={[styles.button, recording && styles.recording, style]}>
      <AppText color={recording ? 'background' : 'text'} variant="subheading">
        {recording ? 'Listening…' : (label ?? 'Hold to talk')}
      </AppText>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 64,
    paddingHorizontal: 32,
  },
  recording: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
