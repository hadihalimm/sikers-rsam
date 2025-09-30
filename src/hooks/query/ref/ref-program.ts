import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RefProgram } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRefProgram = () => {
  return useQuery<RefProgram[]>({
    queryKey: ['ref-program'],
    queryFn: async () => {
      const { data } = await api.get(`/ref/program`);
      return data;
    },
  });
};

export const useCreateRefProgram = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRefProgram: { nama: string }) => {
      const { data } = await api.post(`/ref/program`, newRefProgram);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-program'] });
    },
  });
};
