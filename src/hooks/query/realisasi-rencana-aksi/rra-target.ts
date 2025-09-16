import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  RealisasiRencanaAksiTarget,
  RealisasiRencanaAksiTargetDetail,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRraTarget = (rraId: number, rraPegawaiId: number) => {
  return useQuery<RealisasiRencanaAksiTargetDetail[]>({
    queryKey: ['rra-target-list', rraPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-target`,
      );
      return data;
    },
    enabled: !!rraId && !!rraPegawaiId,
  });
};

export const useGetRraTarget = (
  rraId: number,
  rraPegawaiId: number,
  rraTargetId: number,
) => {
  return useQuery<RealisasiRencanaAksiTarget>({
    queryKey: ['rra-target', rraPegawaiId, rraTargetId],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-target/${rraTargetId}`,
      );
      return data;
    },
    enabled: !!rraId && !!rraPegawaiId && !!rraTargetId,
  });
};

export const useCreateRraTarget = (rraId: number, rraPegawaiId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      bulan: number;
      realisasi: number | null;
      capaian: number | null;
      tindakLanjut: string | null;
      hambatan: string | null;
      rencanaAksiTargetId: number;
    }) => {
      const { data } = await api.post(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-target`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rra-target-list', rraPegawaiId],
      });
    },
  });
};

export const useUpdateRraTarget = (rraId: number, rraPegawaiId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: {
      id: number;
      realisasi: number | null;
      capaian: number | null;
      tindakLanjut: string | null;
      hambatan: string | null;
    }) => {
      const { data } = await api.put(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-target/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rra-target-list', rraPegawaiId],
      });
    },
  });
};

export const useDeleteRraTarget = (rraId: number, rraPegawaiId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-target/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-target-list', rraPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['ra-target', rraPegawaiId, variables],
      });
    },
  });
};
