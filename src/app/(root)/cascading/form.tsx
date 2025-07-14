'use client';

import { useAppForm } from '@/components/form';
import {
  useCreateCascading,
  useUpdateCascading,
} from '@/hooks/query/cascading';
import { Cascading } from '@/types/database';
import { toast } from 'sonner';
import { z } from 'zod';

interface CreateOrUpdateCascadingFormProps {
  initialData?: Cascading;
  onSuccess: () => void;
}

const formSchema = z.object({
  judul: z.string().min(1, { message: 'Judul tidak boleh kosong' }),
  tahunMulai: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 2000, {
      message: 'Harus sesudah tahun 2000',
    })
    .transform((val) => Number(val)),
  tahunBerakhir: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 2000, {
      message: 'Harus sesudah tahun 2000',
    })
    .transform((val) => Number(val)),
});

const CreateOrUpdateCascadingForm = ({
  initialData,
  onSuccess,
}: CreateOrUpdateCascadingFormProps) => {
  const createCascading = useCreateCascading();
  const updateCascading = useUpdateCascading();
  const form = useAppForm({
    defaultValues: {
      judul: initialData?.judul ?? '',
      tahunMulai: initialData?.tahunMulai.toString() ?? '',
      tahunBerakhir: initialData?.tahunBerakhir.toString() ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(formSchema.parse(value));
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateCascading.mutateAsync({
            id: initialData.id,
            ...payload,
          });
          toast.success('Cascading berhasil di-update');
        } else {
          await createCascading.mutateAsync(payload);
          toast.success('Cascading berhasil dibuat');
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
        <form.AppField name="judul">
          {(field) => <field.TextField label="Judul" />}
        </form.AppField>

        <form.AppField name="tahunMulai">
          {(field) => <field.TextField label="Tahun mulai" />}
        </form.AppField>

        <form.AppField name="tahunBerakhir">
          {(field) => <field.TextField label="Tahun berakhir" />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default CreateOrUpdateCascadingForm;
