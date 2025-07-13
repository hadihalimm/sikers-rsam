import { Cascading } from '@/db/schema';
import api from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  return useQuery({
    queryKey: ['cascading', id],
    queryFn: async () => {
      const { data } = await api.get(`/cascading/${id}`);
      return data;
    },
  });
};

export const useCreateCascading = () => {
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cascading/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cascading'] });
    },
  });
};
