import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  PerjanjianKinerjaPegawaiProgram,
  PerjanjianKinerjaPegawaiProgramDetail,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllPkPegawaiProgram = (
  pkId: number,
  pkPegawaiId: number,
) => {
  return useQuery<PerjanjianKinerjaPegawaiProgramDetail[]>({
    queryKey: ['pk-pegawai-program', pkId, pkPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program`,
      );
      return data;
    },
  });
};

export const useGetPkPegawaiProgram = (
  pkId: number,
  pkPegawaiId: number,
  pkPegawaiProgramId: number,
) => {
  return useQuery<PerjanjianKinerjaPegawaiProgram>({
    queryKey: ['pk-pegawai-program', pkId, pkPegawaiId, pkPegawaiProgramId],
    queryFn: async () => {
      const { data } = await api.get(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${pkPegawaiProgramId}`,
      );
      return data;
    },
  });
};

export const useCreatePkPegawaiProgram = (
  pkId: number,
  pkPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      anggaran: number | null;
      subKegiatanId: number | null;
      sasaranId: number;
      pkPegawaiSasaranId: number;
    }) => {
      const { data } = await api.post(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId],
      });
    },
  });
};

export const useUpdatePkPegawaiProgram = (
  pkId: number,
  pkPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: {
      id: number;
      anggaran: number | null;
      subKegiatanId: number;
    }) => {
      const { data } = await api.put(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId, variables.id],
      });
    },
  });
};

export const useDeletePkPegawaiProgram = (
  pkId: number,
  pkPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-program/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['pk-pegawai-program', pkId, pkPegawaiId, variables],
      });
    },
  });
};
