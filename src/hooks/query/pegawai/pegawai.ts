import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { Pegawai } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllPegawai = (userId?: number) => {
  return useQuery<Pegawai[]>({
    queryKey: ['pegawai-list', userId],
    queryFn: async () => {
      const { data } = await api.get(
        userId ? `/pegawai?userId=${userId}` : `/pegawai`,
      );
      return data;
    },
  });
};

export const useGetPegawai = (id: number) => {
  return useQuery<Pegawai>({
    queryKey: ['pegawai', id],
    queryFn: async () => {
      const { data } = await api.get(`/pegawai/${id}`);
      return data;
    },
  });
};

export const useCreatePegawai = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newPegawai: {
      nama: string;
      jabatan: string;
      userId: string;
    }) => {
      const { data } = await api.post(`/pegawai`, newPegawai);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pegawai-list', variables.userId],
      });
    },
  });
};

export const useUpdatePegawai = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedItem: {
      id: number;
      nama: string;
      jabatan: string;
      userId: string;
    }) => {
      const { data } = await api.put(`/pegawai/${updatedItem.id}`);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pegawai-list', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pegawai', variables.id],
      });
    },
  });
};

export const useDeletePegawai = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/pegawai/${id}`);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pegawai-list', data.deletedRecord.userId],
      });
      queryClient.removeQueries({
        queryKey: ['pegawai', variables],
      });
    },
  });
};
