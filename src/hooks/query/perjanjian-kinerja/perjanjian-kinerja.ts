import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { PerjanjianKinerja } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllPerjanjianKinerja = (userId: number) => {
  return useQuery<PerjanjianKinerja[]>({
    queryKey: ['perjanjian-kinerja-list', userId],
    queryFn: async () => {
      const { data } = await api.get(`/perjanjian-kinerja?userId=${userId}`);
      return data;
    },
  });
};

export const useGetPerjanjianKinerja = (id: number) => {
  return useQuery<PerjanjianKinerja>({
    queryKey: ['perjanjian-kinerja', id],
    queryFn: async () => {
      const { data } = await api.get(`/perjanjian-kinerja/${id}`);
      return data;
    },
  });
};

export const useCreatePerjanjianKinerja = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newPK: {
      nama: string;
      tahun: number;
      userId: string;
    }) => {
      const { data } = await api.post(`/perjanjian-kinerja`, newPK);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['perjanjian-kinerja-list', variables.userId],
      });
    },
  });
};

export const useUpdatePerjanjianKinerja = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedPK: { id: number; nama: string }) => {
      const { data } = await api.put(`/perjanjian-kinerja/${updatedPK.id}`);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['perjanjian-kinerja-list', data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['perjanjian-kinerja', variables.id],
      });
    },
  });
};

export const useDeletePerjanjianKinerja = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/perjanjian-kinerja/${id}`);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['perjanjian-kinerja-list', data.deletedRecord.userId],
      });
      queryClient.removeQueries({
        queryKey: ['perjanjian-kinerja', variables],
      });
    },
  });
};
