import api from '@/lib/axios';
import { getQueryClient } from '@/lib/get-query-client';
import { DokumenLakip } from '@/types/database';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllDokumenLakip = () => {
  return useQuery<DokumenLakip[]>({
    queryKey: ['dokumen-lakip-list'],
    queryFn: async () => {
      const { data } = await api.get(`/dokumen/lakip`);
      return data;
    },
  });
};

export const useCreateDokumenLakip = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (newDokumen: { nama: string; file: File }) => {
      const arrayBuffer = await newDokumen.file.arrayBuffer();
      const base64File = Buffer.from(arrayBuffer).toString('base64');

      const { data } = await api.post(`/dokumen/lakip`, {
        nama: newDokumen.nama,
        base64File,
        fileName: newDokumen.file.name,
        mimeType: newDokumen.file.type,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dokumen-lakip-list'],
      });
    },
  });
};

export const useUpdateDokumenLakip = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (updatedDokumen: {
      id: number;
      nama: string;
      file?: File;
    }) => {
      let base64File: string | undefined;
      let fileName: string | undefined;
      let mimeType: string | undefined;
      if (updatedDokumen.file) {
        const arrayBuffer = await updatedDokumen.file.arrayBuffer();
        base64File = Buffer.from(arrayBuffer).toString('base64');
        fileName = updatedDokumen.file.name;
        mimeType = updatedDokumen.file.type;
      }

      const { data } = await api.put(`/dokumen/lakip/${updatedDokumen.id}`, {
        nama: updatedDokumen.nama,
        base64File,
        fileName,
        mimeType,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dokumen-lakip-list'],
      });
    },
  });
};

export const useDeleteDokumenLakip = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/dokumen/lakip/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dokumen-lakip-list'],
      });
    },
  });
};
