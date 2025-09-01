import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaAksiPencapaianTarget } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRaPencapaianTarget = (
  raId: number,
  raPegawaiId: number,
  raPencapaianLangkahId: number,
) => {
  return useQuery<RencanaAksiPencapaianTarget[]>({
    queryKey: ['ra-pencapaian-target-list', raPencapaianLangkahId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${raPencapaianLangkahId}/ra-pencapaian-target`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId && !!raPencapaianLangkahId,
  });
};

export const useGetRaPencapaianTarget = (
  raId: number,
  raPegawaiId: number,
  raPencapaianLangkahId: number,
  raPencapaianTargetId: number,
) => {
  return useQuery<RencanaAksiPencapaianTarget>({
    queryKey: ['ra-pencapaian-target', raPencapaianTargetId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${raPencapaianLangkahId}/ra-pencapaian-target/${raPencapaianTargetId}`,
      );
      return data;
    },
    enabled:
      !!raId &&
      !!raPegawaiId &&
      !!raPencapaianLangkahId &&
      !!raPencapaianTargetId,
  });
};

export const useCreateRaPencapaianTarget = (
  raId: number,
  raPegawaiId: number,
  raPencapaianLangkahId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: { target: string }) => {
      const { data } = await api.post(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${raPencapaianLangkahId}/ra-pencapaian-target`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-target-list', raPencapaianLangkahId],
      });
    },
  });
};

export const useUpdateRaPencapaianTarget = (
  raId: number,
  raPegawaiId: number,
  raPencapaianLangkahId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: { id: string; target: string }) => {
      const { data } = await api.put(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${raPencapaianLangkahId}/ra-pencapaian-target/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-target-list', raPencapaianLangkahId],
      });
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-target', variables.id],
      });
    },
  });
};

export const useDeleteRaPencapaianTarget = (
  raId: number,
  raPegawaiId: number,
  raPencapaianLangkahId: number,
) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-pencapaian-langkah/${raPencapaianLangkahId}/ra-pencapaian-target/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-target-list', raPencapaianLangkahId],
      });
      queryClient.removeQueries({
        queryKey: ['ra-pencapaian-target', variables],
      });
    },
  });
};
