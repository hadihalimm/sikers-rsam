import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { RefProgram, RefProgramDetail } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllRefProgram = () => {
  return useQuery<RefProgram[]>({
    queryKey: ['ref-program'],
    queryFn: async () => {
      const { data } = await api.get(`/ref/program`);
      return data;
    },
  });
};

export const useCreateRefProgram = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newRefProgram: { nama: string }) => {
      const { data } = await api.post(`/ref/program`, newRefProgram);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-program'] });
      queryClient.invalidateQueries({ queryKey: ['ref-program-detail'] });
    },
  });
};

export const useUpdateRefProgram = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedRecord: { id: number; nama: string }) => {
      const { data } = await api.put(`/ref/program`, updatedRecord);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-program'] });
      queryClient.invalidateQueries({ queryKey: ['ref-program-detail'] });
    },
  });
};

export const useDeleteRefProgram = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/ref/program/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ref-program'] });
      queryClient.invalidateQueries({ queryKey: ['ref-program-detail'] });
    },
  });
};

export const useGetProgramDetail = () => {
  return useQuery<RefProgramDetail[]>({
    queryKey: ['ref-program-detail'],
    queryFn: async () => {
      const { data } = await api.get(`/ref/program/detail`);
      return data;
    },
  });
};
