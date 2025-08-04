import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaKinerjaTahunan } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRencanaKinerjaTahunan = () => {
  return useQuery<RencanaKinerjaTahunan[]>({
    queryKey: ['rencana-kinerja-tahunan'],
    queryFn: async () => {
      const { data } = await api.get(`/rencana-kinerja-tahunan`);
      return data;
    },
  });
};

export const useGetRencanaKinerjaTahunan = (id: number) => {
  return useQuery<RencanaKinerjaTahunan>({
    queryKey: ['rencana-kinerja-tahunan', id],
    queryFn: async () => {
      const { data } = await api.get(`/rencana-kinerja-tahunan/${id}`);
      return data;
    },
  });
};

export const useCreateRencanaKinerjaTahunan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newItem: {
      nama: string;
      tahun: number;
      cascadingId: number;
    }) => {
      const { data } = await api.post(`/rencana-kinerja-tahunan`, newItem);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rencana-kinerja-tahunan'] });
    },
  });
};

export const useUpdateRencanaKinerjaTahunan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedItem: { id: number; nama: string }) => {
      const { data } = await api.put(
        `/rencana-kinerja-tahunan/${updatedItem.id}`,
        updatedItem,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rencana-kinerja-tahunan'] });
      queryClient.invalidateQueries({
        queryKey: ['rencana-kinerja-tahunan', variables.id],
      });
    },
  });
};

export const useDeleteRencanaKinerjaTahunan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/rencana-kinerja-tahunan/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rencana-kinerja-tahunan'] });
      queryClient.removeQueries({
        queryKey: ['rencana-kinerja-tahunan', variables],
      });
    },
  });
};
