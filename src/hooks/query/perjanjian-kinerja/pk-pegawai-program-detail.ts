import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  PerjanjianKinerjaPegawaiProgramDetail,
  PerjanjianKinerjaPegawaiProgramDetailFlat,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllPkPegawaiProgramDetail = (
  pkId: number,
  pkPegawaiId: number,
  pkPegawaiProgramId: number,
) => {
  return useQuery<PerjanjianKinerjaPegawaiProgramDetailFlat[]>({
    queryKey: ['pk-pegawai-program-detail', pkPegawaiProgramId],
    queryFn: async () => {
      const { data } = await api.get(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${pkPegawaiProgramId}/program-detail`,
      );
      return data;
    },
  });
};

export const useGetPkPegawaiProgramDetail = (
  pkId: number,
  pkPegawaiId: number,
  pkPegawaiProgramId: number,
  pkPegawaiProgramDetailId: number,
) => {
  return useQuery<PerjanjianKinerjaPegawaiProgramDetail>({
    queryKey: [
      'pk-pegawai-program-detail',
      pkPegawaiProgramId,
      pkPegawaiProgramDetailId,
    ],
    queryFn: async () => {
      const { data } = await api.get(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${pkPegawaiProgramId}/program-detail/${pkPegawaiProgramDetailId}`,
      );
      return data;
    },
    enabled: !!pkPegawaiId && !!pkPegawaiId && !!pkPegawaiProgramDetailId,
  });
};

export const useCreatePkPegawaiProgramDetail = (
  pkId: number,
  pkPegawaiId: number,
  pkPegawaiProgramId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      subKegiatanId: number;
      anggaran: number;
    }) => {
      const { data } = await api.post(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${pkPegawaiProgramId}/program-detail`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program-detail', pkPegawaiProgramId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId],
      });
    },
  });
};

export const useUpdatePkPegawaiProgramDetail = (
  pkId: number,
  pkPegawaiId: number,
  pkPegawaiProgramId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: { id: number; anggaran: number }) => {
      const { data } = await api.put(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${pkPegawaiProgramId}/program-detail/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program-detail', pkPegawaiProgramId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId],
      });
    },
  });
};

export const useDeletePkPegawaiProgramDetail = (
  pkId: number,
  pkPegawaiId: number,
  pkPegawaiProgramId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${pkPegawaiProgramId}/program-detail/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program-detail', pkPegawaiProgramId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId],
      });
    },
  });
};
