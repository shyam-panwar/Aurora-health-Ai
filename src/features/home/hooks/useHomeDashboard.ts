import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { invokeBootstrap } from '../../../lib/api/client';
import { queryKeys } from '../../../lib/api/queries';

export const useHomeDashboard = () =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: invokeBootstrap,
  });

export const useInvalidateDashboard = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.dashboard });
};

export const useDashboardMutation = <T,>(
  mutationFn: (input: T) => Promise<void>,
) => {
  const invalidate = useInvalidateDashboard();
  return useMutation({
    mutationFn,
    onSuccess: () => invalidate(),
  });
};
