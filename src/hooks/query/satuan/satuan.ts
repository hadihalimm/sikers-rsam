import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { Satuan } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllSatuan = () => {
  return useQuery<Satuan[]>({
    queryKey: ['satuan-list'],
    queryFn: async () => {
      const { data } = await api.get('/satuan');
      return data;
    },
  });
};

export const useCreateSatuan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newSatuan: { nama: string }) => {
      const { data } = await api.post('/satuan', newSatuan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['satuan-list'] });
    },
  });
};
