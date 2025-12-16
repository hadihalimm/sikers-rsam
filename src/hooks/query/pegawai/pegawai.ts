import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { Pegawai } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllPegawai = (userId?: number) => {
  return useQuery<Pegawai[]>({
    queryKey: ['pegawai-list'],
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
      nip: string;
      jabatan: string;
      profesi: string;
      penempatan: string;
    }) => {
      const { data } = await api.post(`/pegawai`, newPegawai);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pegawai-list'],
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
      nip: string;
      jabatan: string;
      profesi: string;
      penempatan: string;
    }) => {
      const { data } = await api.put(`/pegawai/${updatedItem.id}`, updatedItem);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pegawai-list'],
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pegawai-list'],
      });
      queryClient.removeQueries({
        queryKey: ['pegawai', variables],
      });
    },
  });
};
