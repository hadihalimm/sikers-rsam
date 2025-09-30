import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  IndikatorKinerjaUtama,
  IndikatorKinerjaUtamaWithCascading,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllIndikatorKinerjaUtama = () => {
  return useQuery<IndikatorKinerjaUtamaWithCascading[]>({
    queryKey: ['indikator-kinerja-utama'],
    queryFn: async () => {
      const { data } = await api.get(`/indikator-kinerja-utama`);
      return data;
    },
  });
};

export const useGetIndikatorKinerjaUtama = (id: number) => {
  return useQuery<IndikatorKinerjaUtama>({
    queryKey: ['indikator-kinerja-utama', id],
    queryFn: async () => {
      const { data } = await api.get(`/indikator-kinerja-utama/${id}`);
      return data;
    },
  });
};

export const useCreateIndikatorKinerjaUtama = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newIku: { nama: string; cascadingId: number }) => {
      const { data } = await api.post(`/indikator-kinerja-utama`, newIku);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indikator-kinerja-utama'] });
    },
  });
};

export const useUpdateIndikatorKinerjaUtama = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedIku: { id: number; nama: string }) => {
      const { data } = await api.put(
        `/indikator-kinerja-utama/${updatedIku.id}`,
        updatedIku,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indikator-kinerja-utama'] });
      queryClient.invalidateQueries({
        queryKey: ['indikator-kinerja-utama', variables.id],
      });
    },
  });
};

export const useDeleteIndikatorKinerjaUtama = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/indikator-kinerja-utama/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indikator-kinerja-utama'] });
      queryClient.invalidateQueries({
        queryKey: ['indikator-kinerja-utama', variables],
      });
    },
  });
};
