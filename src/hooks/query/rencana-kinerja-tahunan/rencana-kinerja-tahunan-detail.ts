import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaKinerjaTahunanDetailWithSasaran } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRencanaKinerjaTahunanDetail = (rktId: number) => {
  return useQuery<RencanaKinerjaTahunanDetailWithSasaran[]>({
    queryKey: ['rencana-kinerja-tahunan-detail', rktId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-kinerja-tahunan/${rktId}/rkt-detail`,
      );
      return data;
    },
  });
};

export const useCreateRencanaKinerjaTahunanDetail = (rktId?: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newItem: {
      target: string;
      indikatorSasaranId: number;
    }) => {
      if (!rktId) throw new Error('Missing rencanaKinerjaTahunanId');
      const { data } = await api.post(
        `/rencana-kinerja-tahunan/${rktId}/rkt-detail`,
        newItem,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rencana-kinerja-tahunan-detail', rktId],
      });
    },
  });
};

export const useUpdateRencanaKinerjaTahunanDetail = (rktId?: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedItem: { id: number; target: string }) => {
      if (!rktId) throw new Error('Missing rencanaKinerjaTahunanId');
      const { data } = await api.put(
        `/rencana-kinerja-tahunan/${rktId}/rkt-detail/${updatedItem.id}`,
        updatedItem,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rencana-kinerja-tahunan-detail', rktId],
      });
      queryClient.invalidateQueries({
        queryKey: ['rencana-kinerja-tahunan-detail', variables.id],
      });
    },
  });
};

export const useDeleteRencanaKinerjaTahunanDetail = (rktId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/rencana-kinerja-tahunan/${rktId}/rkt-detail/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rencana-kinerja-tahunan-detail', rktId],
      });
      queryClient.removeQueries({
        queryKey: ['rencana-kinerja-tahunan-detail', variables],
      });
    },
  });
};
