import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { Cascading } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllCascading = () => {
  return useQuery<Cascading[]>({
    queryKey: ['cascading'],
    queryFn: async () => {
      const { data } = await api.get('/cascading');
      return data;
    },
  });
};

export const useGetCascading = (id: number) => {
  return useQuery<Cascading>({
    queryKey: ['cascading', id],
    queryFn: async () => {
      const { data } = await api.get(`/cascading/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCascading = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newCascading: {
      judul: string;
      tahunMulai: number;
      tahunBerakhir: number;
    }) => {
      const { data } = await api.post('/cascading', newCascading);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cascading'] });
    },
  });
};

export const useUpdateCascading = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updateCascading: {
      id: number;
      judul: string;
      tahunMulai: number;
      tahunBerakhir: number;
    }) => {
      const { data } = await api.put(
        `/cascading/${updateCascading.id}`,
        updateCascading,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cascading'] });
      queryClient.invalidateQueries({ queryKey: ['cascading', variables.id] });
    },
  });
};

export const useDeleteCascading = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cascading/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cascading'] });
    },
  });
};
