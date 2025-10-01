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
      queryClient.invalidateQueries({ queryKey: ['ref-program-detail'] });
    },
  });
};

export const useUpdateRefKegiatan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: { id: number; nama: string }) => {
      const { data } = await api.put(
        `/ref/kegiatan/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-kegiatan'] });
      queryClient.invalidateQueries({ queryKey: ['ref-program-detail'] });
    },
  });
};

export const useDeleteRefKegiatan = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/ref/kegiatan/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-kegiatan'] });
      queryClient.invalidateQueries({ queryKey: ['ref-program-detail'] });
    },
  });
};
