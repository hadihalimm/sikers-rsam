import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { useMutation } from '@tanstack/react-query';

export const useCreateProgramSasaran = (renstraId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newItem: {
      sasaranId: number;
      refProgramId: number;
      refKegiatanId: number;
      refSubKegiatanIds: number[];
    }) => {
      const { data } = await api.post(
        `/renstra/${renstraId}/program-sasaran`,
        newItem,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra', renstraId] });
    },
  });
};

export const useDeleteProgramSasaran = (renstraId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/renstra/${renstraId}/program-sasaran/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra', renstraId] });
    },
  });
};
