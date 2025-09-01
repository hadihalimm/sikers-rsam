import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaAksi } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRencanaAksi = (userId: string) => {
  return useQuery<RencanaAksi[]>({
    queryKey: ['rencana-aksi-list', userId],
    queryFn: async () => {
      const { data } = await api.get(`/rencana-aksi?userId=${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useGetRencanaAksi = (id: number) => {
  return useQuery<RencanaAksi>({
    queryKey: ['rencana-aksi', id],
    queryFn: async () => {
      const { data } = await api.get(`/rencana-aksi/${id}`);
      return data;
    },
  });
};

export const useCreateRencanaAksi = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: { nama: string; tahun: number }) => {
      const { data } = await api.post(`/rencana-aksi`, newRecord);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['rencana-aksi-list', data.userId],
      });
    },
  });
};

export const useUpdateRencanaAksi = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: { id: number; nama: string }) => {
      const { data } = await api.put(
        `/rencana-aksi/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rencana-aksi-list', data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['rencana-aksi', variables.id],
      });
    },
  });
};

export const useDeleteRencanaAksi = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/rencana-aksi/${id}`);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rencana-aksi-list', data.deletedRecord.userId],
      });
      queryClient.removeQueries({
        queryKey: ['rencana-aksi', variables],
      });
    },
  });
};
