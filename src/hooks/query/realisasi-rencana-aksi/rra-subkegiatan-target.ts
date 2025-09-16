import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RealisasiRencanaAksiSubkegiatanTarget } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRraSubkegiatanTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  return useQuery<RealisasiRencanaAksiSubkegiatanTarget[]>({
    queryKey: ['rra-subkegiatan-target-list', rraPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/realisasi-rencana-aksi/${rraId}/ra-pegawai/${rraPegawaiId}/ra-subkegiatan-target`,
      );
      return data;
    },
    enabled: !!rraId && !!rraPegawaiId,
  });
};

export const useGetRraSubkegiatanTarget = (
  rraId: number,
  rraPegawaiId: number,
  rraSubkegiatanTargetId: number,
) => {
  return useQuery<RealisasiRencanaAksiSubkegiatanTarget>({
    queryKey: ['rra-subkegiatan-target', rraSubkegiatanTargetId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${rraId}/ra-pegawai/${rraPegawaiId}/ra-subkegiatan-target/${rraSubkegiatanTargetId}`,
      );
      return data;
    },
    enabled: !!rraId && !!rraPegawaiId && !!rraSubkegiatanTargetId,
  });
};

export const useCreateRraSubkegiatanTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      realisasi: number | null;
      realisasiAnggaran: number | null;
      rencanaAksiSubKegiatanTargetId: number;
    }) => {
      const { data } = await api.post(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/ra-subkegiatan-target`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rra-subkegiatan-target-list', rraPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['rra-subkegiatan-target-detail-list', rraPegawaiId],
      });
    },
  });
};

export const useUpdateRraSubkegiatanTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: {
      id: number;
      realisasi: number | null;
      realisasiAnggaran: number | null;
    }) => {
      const { data } = await api.put(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/ra-subkegiatan-target/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rra-subkegiatan-target-list', rraPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['rra-subkegiatan-target', variables.id],
      });
    },
  });
};

export const useDeleteRraSubkegiatanTarget = (
  rraId: number,
  rraPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}/ra-subkegiatan-target/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rra-subkegiatan-target-list', rraPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['rra-subkegiatan-target', variables],
      });
    },
  });
};
