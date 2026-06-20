import { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthShellProps = PropsWithChildren<{
  footer?: ReactNode;
  subtitle: string;
  title: string;
}>;

export const AuthShell = ({ children, footer, subtitle, title }: AuthShellProps) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>AURORA</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.card}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(13, 24, 40, 0.92)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 28,
    borderWidth: 1,
    gap: 18,
    padding: 22,
    width: '100%',
  },
  content: {
    flexGrow: 1,
    gap: 28,
    justifyContent: 'center',
    padding: 24,
  },
  eyebrow: {
    color: '#F4C57B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.8,
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  hero: {
    gap: 10,
  },
  keyboard: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#06101C',
    flex: 1,
  },
  subtitle: {
    color: '#9AAECC',
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    color: '#F4F8FC',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
});
