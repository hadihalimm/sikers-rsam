'use client';

import { useAppForm } from '@/components/form';
import {
  useCreatePkPegawaiProgram,
  useUpdatePkPegawaiProgram,
} from '@/hooks/query/perjanjian-kinerja/pk-pegawai-program';
import { useGetAllRefKegiatan } from '@/hooks/query/ref/ref-kegiatan';
import { useGetAllRefProgram } from '@/hooks/query/ref/ref-program';
import { useGetAllRefSubKegiatan } from '@/hooks/query/ref/ref-sub-kegiatan';
import { PerjanjianKinerjaPegawaiProgramDetail } from '@/types/database';
import { useStore } from '@tanstack/react-form';
import z from 'zod';

interface PerjanjianKinerjaProgramFormProps {
  initialData?: PerjanjianKinerjaPegawaiProgramDetail;
  pkId: number;
  pkPegawaiId: number;
  pkPegawaiSasaranId?: number;
  sasaranId?: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  programId: z
    .string()
    .min(1, { message: 'Silahkan pilih program' })
    .transform((val) => Number(val)),
  kegiatanId: z
    .string()
    .min(1, { message: 'Silahkan pilih kegiatan' })
    .transform((val) => Number(val)),
  subKegiatanId: z
    .string()
    .min(1, { message: 'Silahkan pilih sub-kegiatan' })
    .transform((val) => Number(val)),
  anggaran: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Harus berupa angka',
    })
    .transform((val) => {
      if (!val.trim()) return null;
      return Number(val);
    }),
});

const PerjanjianKinerjaProgramForm = ({
  initialData,
  pkId,
  pkPegawaiId,
  pkPegawaiSasaranId,
  sasaranId,
  onSuccess,
}: PerjanjianKinerjaProgramFormProps) => {
  const createPkPegawaiProgram = useCreatePkPegawaiProgram(pkId, pkPegawaiId);
  const updatePkPegawaiProgram = useUpdatePkPegawaiProgram(pkId, pkPegawaiId);
  const form = useAppForm({
    defaultValues: {
      programId: initialData?.program?.id.toString() ?? '',
      kegiatanId: initialData?.kegiatan?.id.toString() ?? '',
      subKegiatanId: initialData?.subKegiatan?.id.toString() ?? '',
      anggaran: initialData?.pkPegawaiProgram.anggaran?.toString() ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updatePkPegawaiProgram.mutateAsync({
            id: initialData.pkPegawaiProgram.id,
            subKegiatanId: payload.subKegiatanId,
            anggaran: payload.anggaran,
          });
        } else {
          if (!sasaranId || !pkPegawaiSasaranId) return null;
          await createPkPegawaiProgram.mutateAsync({
            anggaran: payload.anggaran,
            subKegiatanId: payload.subKegiatanId,
            pkPegawaiSasaranId: pkPegawaiSasaranId,
            sasaranId: sasaranId,
          });
        }
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const refProgramId = useStore(form.store, (state) => state.values.programId);
  const refKegiatanId = useStore(
    form.store,
    (state) => state.values.kegiatanId,
  );
  const { data: programList = [] } = useGetAllRefProgram();
  const { data: kegiatanList = [] } = useGetAllRefKegiatan(
    Number(refProgramId),
  );
  const { data: subKegiatanList = [] } = useGetAllRefSubKegiatan(
    Number(refKegiatanId),
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="flex flex-col gap-y-4">
        <form.AppField name="programId">
          {(field) => (
            <field.SelectField
              label="Program"
              placeholder="Pilih program..."
              options={programList.map((program) => ({
                label: program.nama,
                value: program.id.toString(),
              }))}
              className="max-w-full whitespace-normal break-words"
            />
          )}
        </form.AppField>
        <form.AppField name="kegiatanId">
          {(field) => (
            <field.SelectField
              label="Kegiatan"
              placeholder="Pilih kegiatan..."
              options={kegiatanList.map((kegiatan) => ({
                label: kegiatan.nama,
                value: kegiatan.id.toString(),
              }))}
            />
          )}
        </form.AppField>
        <form.AppField name="subKegiatanId">
          {(field) => (
            <field.SelectField
              label="Sub-kegiatan"
              placeholder="Pilih sub-kegiatan..."
              options={subKegiatanList.map((subKegiatan) => ({
                label: subKegiatan.nama,
                value: subKegiatan.id.toString(),
              }))}
            />
          )}
        </form.AppField>
        <div className="flex gap-x-2">
          <p className="mt-[25px] text-sm">Rp.</p>
          <div className="w-full">
            <form.AppField name="anggaran">
              {(field) => <field.TextField label="Anggaran" />}
            </form.AppField>
          </div>
        </div>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default PerjanjianKinerjaProgramForm;
