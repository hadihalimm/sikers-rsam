import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { IndikatorTujuan } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetIndikatorTujuan = (
  indikatorTujuanId: number,
  tujuanId: number,
  cascadingId: number,
) => {
  return useQuery<IndikatorTujuan>({
    queryKey: ['indikator-tujuan', indikatorTujuanId],
    queryFn: async () => {
      const { data } = await api.get(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/indikator-tujuan/${indikatorTujuanId}`,
      );
      return data;
    },
  });
};

export const useCreateIndikatorTujuan = (
  tujuanId: number,
  cascadingId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newIndikatorTujuan: { nama: string }) => {
      const { data } = await api.post(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/indikator-tujuan`,
        newIndikatorTujuan,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tujuan'] });
    },
  });
};

export const useUpdateIndikatorTujuan = (
  tujuanId: number,
  cascadingId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedIndikatorTujuan: {
      id: number;
      nama: string;
    }) => {
      const { data } = await api.put(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/indikator-tujuan/${updatedIndikatorTujuan.id}`,
        updatedIndikatorTujuan,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tujuan'] });
      queryClient.invalidateQueries({
        queryKey: ['indikator-tujuan', variables.id],
      });
    },
  });
};

export const useDeleteIndikatorTujuan = (
  tujuanId: number,
  cascadingId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/indikator-tujuan/${id}`,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({ queryKey: ['tujuan', variables] });
      queryClient.invalidateQueries({ queryKey: ['tujuan'] });
    },
  });
};
