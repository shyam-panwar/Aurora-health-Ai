export const queryKeys = {
  dashboard: ['dashboard'] as const,
  profile: ['profile'] as const,
  preferences: ['preferences'] as const,
  hydration: ['hydration'] as const,
  sleep: ['sleep'] as const,
  habits: ['habits'] as const,
  meals: ['meals'] as const,
  weeklyReport: (range: string) => ['weeklyReport', range] as const,
};
