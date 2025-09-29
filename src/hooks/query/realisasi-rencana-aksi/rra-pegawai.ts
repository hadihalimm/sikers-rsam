import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  RealisasiRencanaAksiPegawai,
  RealisasiRencanaAksiPegawaiDetail,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRraPegawai = (rraId: number) => {
  return useQuery<RealisasiRencanaAksiPegawai[]>({
    queryKey: ['rra-pegawai-list', rraId],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai`,
      );
      return data;
    },
    enabled: !!rraId,
  });
};

export const useGetRraPegawai = (rraId: number, id: number) => {
  return useQuery<RealisasiRencanaAksiPegawai>({
    queryKey: ['rra-pegawai', rraId, id],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${id}`,
      );
      return data;
    },
    enabled: !!rraId && !!id,
  });
};

export const useCreateRraPegawai = (rraId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      tahun: number;
      pegawaiId: number;
      realisasiRencanaAksiId: number;
    }) => {
      const { data } = await api.post(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rra-pegawai-list', rraId] });
    },
  });
};

export const useDeleteRraPegawai = (rraId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${id}`,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rra-pegawai-list', data.deletedRecord.rencanaAksiId],
      });
      queryClient.removeQueries({
        queryKey: ['rra-pegawai', data.deletedRecord.rencanaAksiId, variables],
      });
    },
  });
};

export const useGetRraPegawaiDetail = (rraId: number, rraPegawaiId: number) => {
  return useQuery<RealisasiRencanaAksiPegawaiDetail[]>({
    queryKey: ['rra-pegawai-detail-list', rraPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/detail`,
      );
      return data;
    },
    enabled: !!rraId && !!rraPegawaiId,
  });
};

export const useVerifyRraPegawai = (rraId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (validateRecord: { id: number; status: boolean }) => {
      const { data } = await api.put(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${validateRecord.id}/verifikasi`,
        validateRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rra-pegawai-list', rraId],
      });
    },
  });
};
