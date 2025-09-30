/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  IndikatorKinerjaUtamaDetail,
  IndikatorKinerjaUtamaDetailWithSasaran,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllIkuDetail = (ikuId: number) => {
  return useQuery<IndikatorKinerjaUtamaDetailWithSasaran[]>({
    queryKey: ['iku', ikuId],
    queryFn: async () => {
      const { data } = await api.get(
        `/indikator-kinerja-utama/${ikuId}/iku-detail`,
      );
      return data;
    },
  });
};

export const useGetIkuDetail = (ikuId: number, ikuDetailId: number) => {
  return useQuery<IndikatorKinerjaUtamaDetail>({
    queryKey: ['iku-detail', ikuDetailId],
    queryFn: async () => {
      const { data } = await api.get(
        `/indikator-kinerja-utama/${ikuId}/iku-detail/${ikuDetailId}`,
      );
      return data;
    },
  });
};

export const useUpdateIkuDetail = (ikuId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedIkuDetail: {
      id: number;
      baseline: Record<string, any>;
      penjelasan: Record<string, any>;
      penanggungJawab: Record<string, any>;
    }) => {
      const { data } = await api.put(
        `/indikator-kinerja-utama/${ikuId}/iku-detail/${updatedIkuDetail.id}`,
        updatedIkuDetail,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['iku', ikuId] });
      queryClient.invalidateQueries({ queryKey: ['iku-detail', variables.id] });
    },
  });
};
