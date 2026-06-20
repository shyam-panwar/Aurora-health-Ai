import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackdrop } from './AuroraBackdrop';
import { colors, spacing } from '../../theme';

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}>;

export const AppScreen = ({
  children,
  scroll = true,
  padded = true,
  style,
  contentStyle,
}: AppScreenProps) => {
  const insets = useSafeAreaInsets();
  const paddingStyle = padded
    ? { paddingHorizontal: spacing.xxl, paddingBottom: insets.bottom + spacing.xxl }
    : { paddingBottom: insets.bottom };

  if (scroll) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.lg }, style]}>
        <AuroraBackdrop />
        <ScrollView
          contentContainerStyle={[styles.scrollContent, paddingStyle, contentStyle]}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}>
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }, paddingStyle, style]}>
      <AuroraBackdrop />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    alignSelf: 'center',
    flexGrow: 1,
    gap: spacing.lg,
    maxWidth: 760,
    width: '100%',
  },
  scroll: {
    flex: 1,
  },
});
