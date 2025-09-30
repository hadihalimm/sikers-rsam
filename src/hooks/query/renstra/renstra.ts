import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { Renstra, RenstraDetail, RenstraWithCascading } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRenstra = () => {
  return useQuery<RenstraWithCascading[]>({
    queryKey: ['renstra'],
    queryFn: async () => {
      const { data } = await api.get(`/renstra`);
      return data;
    },
  });
};

export const useGetRenstra = (id: number) => {
  return useQuery<RenstraDetail[]>({
    queryKey: ['renstra', id],
    queryFn: async () => {
      const { data } = await api.get(`/renstra/${id}`);
      return data;
    },
  });
};

export const useCreateRenstra = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRenstra: Pick<Renstra, 'judul' | 'cascadingId'>) => {
      const { data } = await api.post(`/renstra`, newRenstra);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra'] });
    },
  });
};

export const useUpdateRenstra = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRenstra: Pick<Renstra, 'id' | 'judul'>) => {
      const { data } = await api.put(
        `/renstra/${updatedRenstra.id}`,
        updatedRenstra,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['renstra'] });
      queryClient.invalidateQueries({ queryKey: ['renstra', variables.id] });
    },
  });
};

export const useDeleteRenstra = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/renstra/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({ queryKey: ['renstra', variables] });
      queryClient.invalidateQueries({ queryKey: ['renstra'] });
    },
  });
};
