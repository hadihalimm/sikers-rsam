import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { IndikatorTujuanTarget } from '@/types/database';
import { useMutation } from '@tanstack/react-query';

export const useUpdateIndikatorTujuanTarget = (renstraId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (
      updatedItem: Pick<IndikatorTujuanTarget, 'id' | 'target'>,
    ) => {
      const { data } = await api.put(
        `/renstra/${renstraId}/indikator-tujuan-target/${updatedItem.id}`,
        updatedItem,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra', renstraId] });
    },
  });
};
