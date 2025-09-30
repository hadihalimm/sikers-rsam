import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { IndikatorSasaranTarget } from '@/types/database';
import { useMutation } from '@tanstack/react-query';

export const useUpdateIndikatorSasaranTarget = (renstraId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (
      updatedItem: Pick<IndikatorSasaranTarget, 'id' | 'target'>,
    ) => {
      const { data } = await api.put(
        `/renstra/${renstraId}/indikator-sasaran-target/${updatedItem.id}`,
        updatedItem,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra', renstraId] });
    },
  });
};
