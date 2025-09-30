import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { IndikatorSasaran } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllIndikatorSasaran = (
  sasaranId: number,
  tujuanId: number,
  cascadingId: number,
) => {
  return useQuery<IndikatorSasaran[]>({
    queryKey: ['indikator-sasaran', sasaranId],
    queryFn: async () => {
      const { data } = await api.get(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${sasaranId}/indikator-sasaran`,
      );
      return data;
    },
    enabled: !!sasaranId && !!tujuanId && !!cascadingId,
  });
};

export const useGetIndikatorSasaran = (
  indikatorSasaranId: number,
  sasaranId: number,
  tujuanId: number,
  cascadingId: number,
) => {
  return useQuery<IndikatorSasaran>({
    queryKey: ['indikator-sasaran', indikatorSasaranId],
    queryFn: async () => {
      const { data } = await api.get(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${sasaranId}/indikator-sasaran/${indikatorSasaranId}`,
      );
      return data;
    },
  });
};

export const useCreateIndikatorSasaran = (
  sasaranId: number,
  tujuanId: number,
  cascadingId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newIndikatorSasaran: { nama: string }) => {
      const { data } = await api.post(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${sasaranId}/indikator-sasaran`,
        newIndikatorSasaran,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['indikator-sasaran', sasaranId],
      });
    },
  });
};

export const useUpdateIndikatorSasaran = (
  sasaranId: number,
  tujuanId: number,
  cascadingId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedIndikatorSasaran: {
      id: number;
      nama: string;
    }) => {
      const { data } = await api.put(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${sasaranId}/indikator-sasaran/${updatedIndikatorSasaran.id}`,
        updatedIndikatorSasaran,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['indikator-sasaran', sasaranId],
      });
      queryClient.invalidateQueries({
        queryKey: ['indikator-sasaran', variables.id],
      });
    },
  });
};

export const useDeleteIndikatorSasaran = (
  sasaranId: number,
  tujuanId: number,
  cascadingId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${sasaranId}/indikator-sasaran/${id}`,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({ queryKey: ['indikator-sasaran', variables] });
      queryClient.invalidateQueries({
        queryKey: ['indikator-sasaran', sasaranId],
      });
    },
  });
};
