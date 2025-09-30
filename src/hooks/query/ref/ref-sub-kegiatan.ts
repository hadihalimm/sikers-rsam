import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RefSubKegiatan } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRefSubKegiatan = (refKegiatanId: number) => {
  return useQuery<RefSubKegiatan[]>({
    queryKey: ['ref-sub-kegiatan', refKegiatanId],
    queryFn: async () => {
      const { data } = await api.get(
        `/ref/sub-kegiatan?ref-kegiatan-id=${refKegiatanId}`,
      );
      return data;
    },
    enabled: refKegiatanId !== 0,
  });
};

export const useCreateRefSubKegiatan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRefSubKegiatan: {
      nama: string;
      refKegiatanId: number;
    }) => {
      const { data } = await api.post(`/ref/sub-kegiatan`, newRefSubKegiatan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-sub-kegiatan'] });
    },
  });
};
