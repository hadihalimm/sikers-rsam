import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import {
  PerjanjianKinerjaPegawaiSasaran,
  PerjanjianKinerjaPegawaiSasaranDetail,
} from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllPkPegawaiSasaran = (
  pkId: number,
  pkPegawaiId: number,
) => {
  return useQuery<PerjanjianKinerjaPegawaiSasaranDetail[]>({
    queryKey: ['pk-pegawai-sasaran', pkId, pkPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-sasaran`,
      );
      return data;
    },
  });
};

export const useGetPkPegawaiSasaran = (
  pkId: number,
  pkPegawaiId: number,
  pkPegawaiSasaranId: number,
) => {
  return useQuery<PerjanjianKinerjaPegawaiSasaran>({
    queryKey: ['pk-pegawai-sasaran', pkId, pkPegawaiId, pkPegawaiSasaranId],
    queryFn: async () => {
      const { data } = await api.get(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-sasaran/${pkPegawaiSasaranId}`,
      );
      return data;
    },
  });
};

export const useCreatePkPegawaiSasaran = (
  pkId: number,
  pkPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      target: string;
      modelCapaian: number;
      indikatorSasaranId: number;
    }) => {
      const { data } = await api.post<PerjanjianKinerjaPegawaiSasaran>(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-sasaran`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-sasaran', pkId, pkPegawaiId],
      });
    },
  });
};

export const useUpdatePkPegawaiSasaran = (
  pkId: number,
  pkPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: {
      id: number;
      target: string;
      modelCapaian: number;
    }) => {
      const { data } = await api.put(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-sasaran/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-sasaran', pkId, pkPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-sasaran', pkId, pkPegawaiId, variables.id],
      });
    },
  });
};

export const useDeletePkPegawaiSasaran = (
  pkId: number,
  pkPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `perjanjian-kinerja/${pkId}/pk-pegawai/${pkPegawaiId}/pk-pegawai-sasaran/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pk-pegawai-sasaran', pkId, pkPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['pk-pegawai-sasaran', pkId, pkPegawaiId, variables],
      });
    },
  });
};
