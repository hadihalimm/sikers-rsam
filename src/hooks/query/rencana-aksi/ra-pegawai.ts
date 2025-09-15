import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaAksiPegawai, RencanaAksiPegawaiDetail } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRaPegawai = (raId: number) => {
  return useQuery<RencanaAksiPegawai[]>({
    queryKey: ['ra-pegawai-list', raId],
    queryFn: async () => {
      const { data } = await api.get(`/rencana-aksi/${raId}/ra-pegawai`);
      return data;
    },
    enabled: !!raId,
  });
};

export const useGetRaPegawai = (raId: number, id: number) => {
  return useQuery<RencanaAksiPegawai>({
    queryKey: ['ra-pegawai', raId, id],
    queryFn: async () => {
      const { data } = await api.get(`/rencana-aksi/${raId}/ra-pegawai/${id}`);
      return data;
    },
    enabled: !!raId && !!id,
  });
};

export const useCreateRaPegawai = (raId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      tahun: number;
      pegawaiId: number;
      perjanjianKinerjaPegawaiId: number;
    }) => {
      const { data } = await api.post(
        `/rencana-aksi/${raId}/ra-pegawai`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ra-pegawai-list', raId] });
    },
  });
};

export const useDeleteRaPegawai = (raId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/rencana-aksi/${raId}/ra-pegawai/${id}`,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-pegawai-list', data.deletedRecord.rencanaAksiId],
      });
      queryClient.removeQueries({
        queryKey: ['ra-pegawai', data.deletedRecord.rencanaAksiId, variables],
      });
    },
  });
};

export const useGetRaPegawaiDetail = (raId: number, raPegawaiId: number) => {
  return useQuery<RencanaAksiPegawaiDetail[]>({
    queryKey: ['ra-pegawai-detail-list', raPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/detail`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId,
  });
};
