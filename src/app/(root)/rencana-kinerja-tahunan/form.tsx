'use client';

import { useAppForm } from '@/components/form';
import {
  useCreateRencanaKinerjaTahunan,
  useUpdateRencanaKinerjaTahunan,
} from '@/hooks/query/rencana-kinerja-tahunan/rencana-kinerja-tahunan';
import { Cascading, RencanaKinerjaTahunan } from '@/types/database';
import { toast } from 'sonner';
import z from 'zod';

interface CreateOrUpdateRKTFormProps {
  initialData?: RencanaKinerjaTahunan;
  cascadingList: Cascading[];
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  tahun: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 2000, {
      message: 'Harus sesudah tahun 2000',
    })
    .transform((val) => Number(val)),
  cascadingId: z
    .string()
    .min(1, { message: 'Silahkan pilih cascading' })
    .transform((val) => Number(val)),
});

const CreateOrUpdateRKTForm = ({
  initialData,
  cascadingList,
  onSuccess,
}: CreateOrUpdateRKTFormProps) => {
  const createRkt = useCreateRencanaKinerjaTahunan();
  const updateRkt = useUpdateRencanaKinerjaTahunan();
  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      tahun: initialData?.tahun.toString() ?? '',
      cascadingId: initialData?.cascadingId.toString() ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(formSchema.parse(value));
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateRkt.mutateAsync({
            id: initialData.id,
            nama: payload.nama,
          });
          toast.success('RKT berhasil di-update');
        } else {
          await createRkt.mutateAsync({ ...payload });
          toast.success('RKT berhasil dibuat');
        }
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="flex flex-col gap-y-4">
        <form.AppField name="nama">
          {(field) => <field.TextField label="Nama" />}
        </form.AppField>
        <form.AppField name="tahun">
          {(field) => <field.TextField label="Tahun" disabled={true} />}
        </form.AppField>
        <form.AppField name="cascadingId">
          {(field) => (
            <field.SelectField
              label="Cascading"
              placeholder="Pilih Cascading..."
              disabled={initialData ? true : false}
              options={cascadingList.map((item) => ({
                label: item.judul,
                value: String(item.id),
              }))}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default CreateOrUpdateRKTForm;
