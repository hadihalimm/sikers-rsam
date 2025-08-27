'use client';

import { useAppForm } from '@/components/form';
import { useGetAllSasaran } from '@/hooks/query/cascading/cascading';
import { useGetAllIndikatorSasaran } from '@/hooks/query/cascading/indikator-sasaran';
import { useGetPkPegawai } from '@/hooks/query/perjanjian-kinerja/pk-pegawai';
import { useCreatePkPegawaiProgram } from '@/hooks/query/perjanjian-kinerja/pk-pegawai-program';
import {
  useCreatePkPegawaiSasaran,
  useUpdatePkPegawaiSasaran,
} from '@/hooks/query/perjanjian-kinerja/pk-pegawai-sasaran';
import { PerjanjianKinerjaPegawaiSasaran } from '@/types/database';
import { useStore } from '@tanstack/react-form';
import { useParams } from 'next/navigation';
import z from 'zod';

interface PerjanjianKinerjaSasaranFormProps {
  initialData?: PerjanjianKinerjaPegawaiSasaran;
  onSuccess: () => void;
}

const createFormSchema = z.object({
  sasaranId: z
    .string()
    .min(1, { message: 'Silahkan pilih sasaran' })
    .transform((val) => Number(val)),
  indikatorSasaranId: z
    .string()
    .min(1, { message: 'Silahkan pilih indikator sasaran' })
    .transform((val) => Number(val)),
  target: z.string().min(1, { message: 'Target tidak boleh kosong' }),
  modelCapaian: z
    .string()
    .min(1, { message: 'Silahkan pilih model capaian' })
    .transform((val) => Number(val)),
});

const updateFormSchema = z.object({
  target: z.string().min(1, { message: 'Target tidak boleh kosong' }),
  modelCapaian: z
    .string()
    .min(1, { message: 'Silahkan pilih model capaian' })
    .transform((val) => Number(val)),
});

const PerjanjianKinerjaSasaranForm = ({
  initialData,
  onSuccess,
}: PerjanjianKinerjaSasaranFormProps) => {
  const { 'pk-id': pkId, 'pk-pegawai-id': pkPegawaiId } = useParams();
  const updatePkPegawaiSasaran = useUpdatePkPegawaiSasaran(
    Number(pkId),
    Number(pkPegawaiId),
  );
  const createPkPegawaiSasaran = useCreatePkPegawaiSasaran(
    Number(pkId),
    Number(pkPegawaiId),
  );
  const createPkPegawaiProgram = useCreatePkPegawaiProgram(
    Number(pkId),
    Number(pkPegawaiId),
  );
  const createForm = useAppForm({
    defaultValues: {
      sasaranId: '',
      indikatorSasaranId: initialData?.indikatorSasaranId ?? '',
      target: initialData?.target ?? '',
      modelCapaian: initialData?.modelCapaian.toString() ?? '',
    },
    validators: {
      onChange: createFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = createFormSchema.parse(value);
        const item = await createPkPegawaiSasaran.mutateAsync({
          indikatorSasaranId: payload.indikatorSasaranId,
          target: payload.target,
          modelCapaian: payload.modelCapaian,
        });
        createPkPegawaiProgram.mutateAsync({
          sasaranId: payload.sasaranId,
          pkPegawaiSasaranId: item.id,
        });
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const updateForm = useAppForm({
    defaultValues: {
      target: initialData?.target ?? '',
      modelCapaian: initialData?.modelCapaian.toString() ?? '',
    },
    validators: {
      onChange: updateFormSchema,
    },
    onSubmit: ({ value }) => {
      try {
        const payload = updateFormSchema.parse(value);
        if (initialData) {
          updatePkPegawaiSasaran.mutateAsync({
            id: initialData.id,
            target: payload.target,
            modelCapaian: payload.modelCapaian,
          });
        }
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const sasaranId = useStore(
    createForm.store,
    (state) => state.values.sasaranId,
  );
  const { data: pkPegawai } = useGetPkPegawai(
    Number(pkId),
    Number(pkPegawaiId),
  );
  const { data: sasaranList = [] } = useGetAllSasaran(pkPegawai?.tahun ?? 0);
  const { data: indikatorSasaranList = [] } = useGetAllIndikatorSasaran(
    Number(sasaranId),
    1,
    1,
  );

  if (initialData) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateForm.handleSubmit();
        }}>
        <div className="flex flex-col gap-y-4">
          <updateForm.AppField name="target">
            {(field) => <field.TextField label="Target" />}
          </updateForm.AppField>
          <updateForm.AppField name="modelCapaian">
            {(field) => (
              <field.SelectField
                label="Model capaian"
                placeholder="Pilih Model capaian..."
                options={[
                  {
                    label: 'Model A (Semakin tinggi target, semakin baik)',
                    value: '1',
                  },
                  {
                    label: 'Model B (Semakin rendah target, semakin baik)',
                    value: '2',
                  },
                ]}
              />
            )}
          </updateForm.AppField>
          <updateForm.AppForm>
            <updateForm.SubmitButton className="mt-4">
              Submit
            </updateForm.SubmitButton>
          </updateForm.AppForm>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createForm.handleSubmit();
      }}>
      <div className="flex flex-col gap-y-4">
        <createForm.AppField name="sasaranId">
          {(field) => (
            <field.SelectWithSearchField
              label="Sasaran"
              placeholder="Sasaran"
              disabled={initialData ? true : false}
              options={sasaranList.map((item) => ({
                label: item.judul,
                value: String(item.id),
              }))}
              onSelect={() => {
                createForm.setFieldValue('indikatorSasaranId', '');
              }}
            />
          )}
        </createForm.AppField>
        <createForm.AppField name="indikatorSasaranId">
          {(field) => (
            <field.SelectWithSearchField
              label="Indikator sasaran"
              placeholder="Indikator sasaran"
              disabled={initialData ? true : false}
              options={indikatorSasaranList.map((item) => ({
                label: item.nama,
                value: String(item.id),
              }))}
            />
          )}
        </createForm.AppField>
        <createForm.AppField name="target">
          {(field) => <field.TextField label="Target" />}
        </createForm.AppField>
        <createForm.AppField name="modelCapaian">
          {(field) => (
            <field.SelectField
              label="Model capaian"
              placeholder="Pilih Model capaian..."
              options={[
                {
                  label: 'Model A (Semakin tinggi target, semakin baik)',
                  value: '1',
                },
                {
                  label: 'Model B (Semakin rendah target, semakin baik)',
                  value: '2',
                },
              ]}
            />
          )}
        </createForm.AppField>
        <createForm.AppForm>
          <createForm.SubmitButton className="mt-4">
            Submit
          </createForm.SubmitButton>
        </createForm.AppForm>
      </div>
    </form>
  );
};

export default PerjanjianKinerjaSasaranForm;
