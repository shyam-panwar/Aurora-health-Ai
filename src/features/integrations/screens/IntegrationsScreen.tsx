import { AppCard } from '../../../components/ui/AppCard';
import { AppText } from '../../../components/ui/AppText';
import { colors } from '../../../theme';

const INTEGRATIONS = [
  { name: 'Apple Health', status: 'Coming soon', icon: '❤️' },
  { name: 'Health Connect', status: 'Coming soon', icon: '🤖' },
  { name: 'Fitbit', status: 'Coming soon', icon: '⌚' },
  { name: 'Garmin', status: 'Coming soon', icon: '🏃' },
];

export const IntegrationsScreen = () => (
  <>
    {INTEGRATIONS.map((item) => (
      <AppCard key={item.name} style={{ opacity: 0.85 }}>
        <AppText variant="subheading">
          {item.icon} {item.name}
        </AppText>
        <AppText color="textMuted">{item.status}</AppText>
      </AppCard>
    ))}
    <AppText color="textSecondary" variant="caption">
      Manual tracking remains the primary path. Integrations are bonus-ready placeholders.
    </AppText>
  </>
);
