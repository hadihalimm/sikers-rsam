import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  RealisasiRencanaAksiPencapaianTarget,
  RealisasiRencanaAksiPencapaianTargetDetail,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRraPencapaianTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  return useQuery<RealisasiRencanaAksiPencapaianTargetDetail[]>({
    queryKey: ['rra-pencapaian-target-list', rraPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-pencapaian-target`,
      );
      return data;
    },
    enabled: !!rraId && !!rraPegawaiId,
  });
};

export const useGetRraPencapaianTarget = (
  rraId: number,
  rraPegawaiId: number,
  rraPencapaianTargetId: number,
) => {
  return useQuery<RealisasiRencanaAksiPencapaianTarget>({
    queryKey: ['rra-pencapaian-target', rraPegawaiId, rraPencapaianTargetId],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-pencapaian-target/${rraPencapaianTargetId}`,
      );
      return data;
    },
    enabled: !!rraId && !!rraPegawaiId && !!rraPencapaianTargetId,
  });
};

export const useCreateRraPencapaianTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      realisasi: number | null;
      capaian: number | null;
      rencanaAksiPencapaianTargetId: number;
    }) => {
      const { data } = await api.post(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-pencapaian-target`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rra-pencapaian-target-list', rraPegawaiId],
      });
    },
  });
};

export const useUpdateRraPencapaianTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: {
      id: number;
      realisasi: number | null;
      capaian: number | null;
    }) => {
      const { data } = await api.put(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-pencapaian-target/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rra-pencapaian-target-list', rraPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['rra-pencapaian-target-list', rraPegawaiId, variables.id],
      });
    },
  });
};

export const useDeleteRraPencapaianTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/rra-pencapaian-target/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rra-pencapaian-target-list', rraPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['rra-pencapaian-target', rraPegawaiId, variables],
      });
    },
  });
};
