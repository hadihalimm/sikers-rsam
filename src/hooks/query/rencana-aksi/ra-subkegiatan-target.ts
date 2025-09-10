import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  RencanaAksiSubKegiatanTarget,
  RencanaAksiSubkegiatanTargetDetail,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRaSubkegiatanTarget = (
  raId: number,
  raPegawaiId: number,
) => {
  return useQuery<RencanaAksiSubKegiatanTarget[]>({
    queryKey: ['ra-subkegiatan-target-list', raPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-subkegiatan-target`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId,
  });
};

export const useGetRaSubkegiatanTarget = (
  raId: number,
  raPegawaiId: number,
  raSubkegiatanTargetId: number,
) => {
  return useQuery<RencanaAksiSubKegiatanTarget>({
    queryKey: ['ra-subkegiatan-target', raSubkegiatanTargetId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-subkegiatan-target/${raSubkegiatanTargetId}`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId && !!raSubkegiatanTargetId,
  });
};

export const useCreateRaSubkegiatanTarget = (
  raId: number,
  raPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      nama: string;
      target: number;
      satuanId: number;
      pkPegawaiProgramId: number;
    }) => {
      const { data } = await api.post(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-subkegiatan-target`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ra-subkegiatan-target-list', raPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['ra-subkegiatan-target-detail-list', raPegawaiId],
      });
    },
  });
};

export const useUpdateRaSubkegiatanTarget = (
  raId: number,
  raPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: {
      id: number;
      nama: string;
      target: number;
      satuanId: number;
    }) => {
      const { data } = await api.put(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-subkegiatan-target/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-subkegiatan-target-list', raPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['ra-subkegiatan-target', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['ra-subkegiatan-target-detail-list', raPegawaiId],
      });
    },
  });
};

export const useDeleteRaSubkegiatanTarget = (
  raId: number,
  raPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-subkegiatan-target/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-subkegiatan-target-list', raPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['ra-subkegiatan-target', variables],
      });
      queryClient.invalidateQueries({
        queryKey: ['ra-subkegiatan-target-detail-list', raPegawaiId],
      });
    },
  });
};

export const useGetAllRaSubkegiatanTargetDetail = (
  raId: number,
  raPegawaiId: number,
) => {
  return useQuery<RencanaAksiSubkegiatanTargetDetail[]>({
    queryKey: ['ra-subkegiatan-target-detail-list', raPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-subkegiatan-target/detail`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId,
  });
};
