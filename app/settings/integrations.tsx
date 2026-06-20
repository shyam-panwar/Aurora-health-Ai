import { AppScreen } from '../../src/components/ui/AppScreen';
import { AppText } from '../../src/components/ui/AppText';
import { IntegrationsScreen } from '../../src/features/integrations/screens/IntegrationsScreen';

export default function IntegrationsRoute() {
  return (
    <AppScreen>
      <AppText variant="title">Integrations</AppText>
      <IntegrationsScreen />
    </AppScreen>
  );
}
