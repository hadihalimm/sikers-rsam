import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaAksiPencapaianLangkah } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRaPencapaianLangkah = (
  raId: number,
  raPegawaiId: number,
) => {
  return useQuery<RencanaAksiPencapaianLangkah[]>({
    queryKey: ['ra-pencapaian-langkah-list', raPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId,
  });
};

export const useGetRaPencapaianLangkah = (
  raId: number,
  raPegawaiId: number,
  raPencapaianLangkahId: number,
) => {
  return useQuery<RencanaAksiPencapaianLangkah>({
    queryKey: ['ra-pencapaian-langkah', raPegawaiId, raPencapaianLangkahId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${raPencapaianLangkahId}`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId && !!raPencapaianLangkahId,
  });
};

export const useCreateRaPencapaianLangkah = (
  raId: number,
  raPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      nama: string;
      pkPegawaiSasaranId: number;
    }) => {
      const { data } = await api.post(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-langkah-list', raPegawaiId],
      });
    },
  });
};

export const useUpdateRaPencapaianLangkah = (
  raId: number,
  raPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: { id: number; nama: string }) => {
      const { data } = await api.put(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-langkah-list', raPegawaiId],
      });
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-langkah', raPegawaiId, variables.id],
      });
    },
  });
};

export const useDeleteRaPencapaianLangkah = (
  raId: number,
  raPegawaiId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-langkah-list', raPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['ra-pencapaian-langkah', raPegawaiId, variables],
      });
    },
  });
};
