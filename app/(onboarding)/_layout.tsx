import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="lifestyle" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="tracking-setup" />
    </Stack>
  );
}
