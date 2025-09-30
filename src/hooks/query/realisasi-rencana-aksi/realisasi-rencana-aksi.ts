import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RealisasiRencanaAksi } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRealisasiRencanaAksi = (userId?: string) => {
  return useQuery<RealisasiRencanaAksi[]>({
    queryKey: ['realisasi-rencana-aksi-list', userId],
    queryFn: async () => {
      const { data } = await api.get(`/realisasi-rencana-aksi`);
      return data;
    },
  });
};

export const useGetRealisasiRencanaAksi = (id: number) => {
  return useQuery<RealisasiRencanaAksi>({
    queryKey: ['realisasi-rencana-aksi', id],
    queryFn: async () => {
      const { data } = await api.get(`/realisasi-rencana-aksi/${id}`);
      return data;
    },
  });
};

export const useCreateRealisasiRencanaAksi = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: { nama: string; tahun: number }) => {
      const { data } = await api.post(`/realisasi-rencana-aksi`, newRecord);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['realisasi-rencana-aksi-list', data.userId],
      });
    },
  });
};

export const useUpdateRealisasiRencanaAksi = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: { id: number; nama: string }) => {
      const { data } = await api.put(
        `/realisasi-rencana-aksi/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['realisasi-rencana-aksi-list', data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['realisasi-rencana-aksi', variables.id],
      });
    },
  });
};

export const useDeleteRealisasiRencanaAksi = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/realisasi-rencana-aksi/${id}`);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['realisasi-rencana-aksi-list', data.deletedRecord.userId],
      });
      queryClient.removeQueries({
        queryKey: ['realisasi-rencana-aksi', variables],
      });
    },
  });
};
