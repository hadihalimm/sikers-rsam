import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaAksiTarget } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRaTarget = (raId: number, raPegawaiId: number) => {
  return useQuery<RencanaAksiTarget[]>({
    queryKey: ['ra-target-list', raPegawaiId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-target`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId,
  });
};

export const useGetRaTarget = (
  raId: number,
  raPegawaiId: number,
  raTargetId: number,
) => {
  return useQuery<RencanaAksiTarget>({
    queryKey: ['ra-target', raPegawaiId, raTargetId],
    queryFn: async () => {
      const { data } = await api.get(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-target/${raTargetId}`,
      );
      return data;
    },
    enabled: !!raId && !!raPegawaiId && !!raTargetId,
  });
};

export const useCreateRaTarget = (raId: number, raPegawaiId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRecord: {
      bulan: number;
      target: number | null;
      perjanjianKinerjaPegawaiSasaranId: number;
    }) => {
      const { data } = await api.post(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-target`,
        newRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ra-target-list', raPegawaiId],
      });
    },
  });
};

export const useUpdateRaTarget = (raId: number, raPegawaiId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: {
      id: number;
      target: number | null;
    }) => {
      const { data } = await api.put(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-target/${updatedRecord.id}`,
        updatedRecord,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ra-target-list', raPegawaiId],
      });
    },
  });
};

export const useDeleteRaTarget = (raId: number, raPegawaiId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(
        `/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}/ra-target/${id}`,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ra-target-list', raPegawaiId],
      });
      queryClient.removeQueries({
        queryKey: ['ra-target', raPegawaiId, variables],
      });
    },
  });
};
