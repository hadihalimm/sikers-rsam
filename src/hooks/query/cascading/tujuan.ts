import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { Tujuan, TujuanWithIndikator } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllTujuan = (cascadingId: number) => {
  return useQuery<TujuanWithIndikator[]>({
    queryKey: ['tujuan', cascadingId],
    queryFn: async () => {
      const { data } = await api.get(`/cascading/${cascadingId}/tujuan`);
      return data;
    },
    enabled: !!cascadingId,
  });
};

export const useGetTujuan = (tujuanId: number, cascadingId: number) => {
  return useQuery<Tujuan>({
    queryKey: ['tujuan', tujuanId],
    queryFn: async () => {
      const { data } = await api.get(
        `/cascading/${cascadingId}/tujuan/${tujuanId}`,
      );
      return data;
    },
  });
};

export const useCreateTujuan = (cascadingId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newTujuan: { judul: string }) => {
      const { data } = await api.post(
        `/cascading/${cascadingId}/tujuan`,
        newTujuan,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tujuan', cascadingId] });
    },
  });
};

export const useUpdateTujuan = (cascadingId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedTujuan: { id: number; judul: string }) => {
      const { data } = await api.put(
        `/cascading/${cascadingId}/tujuan/${updatedTujuan.id}`,
        updatedTujuan,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tujuan', cascadingId] });
      queryClient.invalidateQueries({ queryKey: ['tujuan', variables.id] });
    },
  });
};

export const useDeleteTujuan = (cascadingId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cascading/${cascadingId}/tujuan/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({ queryKey: ['tujuan', variables] });
      queryClient.invalidateQueries({ queryKey: ['tujuan', cascadingId] });
    },
  });
};
