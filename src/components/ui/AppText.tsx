import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { colors, typography } from '../../theme';

type Variant = keyof typeof typography;

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: keyof typeof colors | string;
  style?: TextStyle;
};

export const AppText = ({
  variant = 'body',
  color = 'text',
  style,
  children,
  ...rest
}: AppTextProps) => {
  const textColor = color in colors ? colors[color as keyof typeof colors] : color;

  return (
    <Text style={[typography[variant], { color: textColor }, style]} {...rest}>
      {children}
    </Text>
  );
};

const _styles = StyleSheet.create({});
