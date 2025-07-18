import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { Sasaran, SasaranWithIndikator } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllSasaran = (tujuanId: number, cascadingId: number) => {
  return useQuery<SasaranWithIndikator[]>({
    queryKey: ['sasaran'],
    queryFn: async () => {
      const { data } = await api.get(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran`,
      );
      return data;
    },
  });
};

export const useGetSasaran = (
  sasaranId: number,
  tujuanId: number,
  cascadingId: number,
) => {
  return useQuery<Sasaran>({
    queryKey: ['sasaran', sasaranId],
    queryFn: async () => {
      const { data } = await api.get(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${sasaranId}`,
      );
      return data;
    },
  });
};

export const useCreateSasaran = (tujuanId: number, cascadingId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newSasaran: {
      judul: string;
      pengampu: string;
      level: number;
      parentId?: number;
    }) => {
      const { data } = await api.post(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran`,
        newSasaran,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sasaran'] });
    },
  });
};

export const useUpdateSasaran = (tujuanId: number, cascadingId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedSasaran: {
      id: number;
      judul: string;
      pengampu: string;
    }) => {
      const { data } = await api.put(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${updatedSasaran.id}`,
        updatedSasaran,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sasaran'] });
      queryClient.invalidateQueries({ queryKey: ['sasaran', variables.id] });
    },
  });
};

export const useDeleteSasaran = (tujuanId: number, cascadingId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(
        `/cascading/${cascadingId}/tujuan/${tujuanId}/sasaran/${id}`,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({ queryKey: ['sasaran', variables] });
      queryClient.invalidateQueries({ queryKey: ['sasaran'] });
    },
  });
};
