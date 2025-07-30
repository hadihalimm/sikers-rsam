import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RefKegiatan } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRefKegiatan = (refProgramId: number) => {
  return useQuery<RefKegiatan[]>({
    queryKey: ['ref-kegiatan', refProgramId],
    queryFn: async () => {
      const { data } = await api.get(
        `/ref/kegiatan?ref-program-id=${refProgramId}`,
      );
      return data;
    },
    enabled: refProgramId > 0,
  });
};

export const useCreateRefKegiatan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRefKegiatan: {
      nama: string;
      refProgramId: number;
    }) => {
      const { data } = await api.post(`/ref/kegiatan`, newRefKegiatan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-kegiatan'] });
    },
  });
};
