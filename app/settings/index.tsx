import { AppScreen } from '../../src/components/ui/AppScreen';
import { AppText } from '../../src/components/ui/AppText';

export default function SettingsScreen() {
  return (
    <AppScreen>
      <AppText variant="title">Settings</AppText>
      <AppText color="textSecondary">
        Notification preferences and account settings are managed from your profile and onboarding choices.
      </AppText>
    </AppScreen>
  );
}
