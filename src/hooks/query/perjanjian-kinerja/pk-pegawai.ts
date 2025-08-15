import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { PerjanjianKinerjaPegawai } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllPkPegawai = (pkId: number) => {
  return useQuery<PerjanjianKinerjaPegawai[]>({
    queryKey: ['pk-pegawai', pkId],
    queryFn: async () => {
      const { data } = await api.get(`/perjanjian-kinerja/${pkId}/pk-pegawai`);
      return data;
    },
  });
};

export const useGetPkPegawai = (pkId: number, id: number) => {
  return useQuery<PerjanjianKinerjaPegawai>({
    queryKey: ['pk-pegawai', pkId, id],
    queryFn: async () => {
      const { data } = await api.get(
        `/perjanjian-kinerja/${pkId}/pk-pegawai/${id}`,
      );
      return data;
    },
  });
};

export const useCreatePkPegawai = (pkId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: { tahun: number; pegawaiId: number }) => {
      const { data } = await api.post(
        `/perjanjian-kinerja/${pkId}/pk-pegawai`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai', pkId],
      });
    },
  });
};

export const useDeletePkPegawai = (pkId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/perjanjian-kinerja/${pkId}/pk-pegawai/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai', pkId],
      });
      queryClient.removeQueries({
        queryKey: ['pk-pegawai', pkId, variables],
      });
    },
  });
};
