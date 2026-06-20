import Svg, { Line, Polyline } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors, spacing } from '../../../theme';
import type { SleepLog } from '../../../lib/types';

type Props = { logs: SleepLog[]; height?: number };

export const SleepTrendChart = ({ logs, height = 120 }: Props) => {
  if (logs.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <AppText color="textMuted" variant="caption">
          Log sleep to see your trend
        </AppText>
      </View>
    );
  }

  const width = 280;
  const padding = 16;
  const maxHours = Math.max(...logs.map((l) => l.duration_minutes / 60), 8);
  const points = logs.map((log, i) => {
    const x = padding + (i / Math.max(logs.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (log.duration_minutes / 60 / maxHours) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <View style={styles.wrapper}>
      <Svg height={height} width={width}>
        {[0, 0.5, 1].map((t) => (
          <Line
            key={t}
            stroke={colors.border}
            strokeDasharray="4 4"
            x1={padding}
            x2={width - padding}
            y1={padding + t * (height - padding * 2)}
            y2={padding + t * (height - padding * 2)}
          />
        ))}
        <Polyline
          fill="none"
          points={points.join(' ')}
          stroke={colors.accentSoft}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
  },
  wrapper: { alignItems: 'center', paddingVertical: spacing.sm },
});
