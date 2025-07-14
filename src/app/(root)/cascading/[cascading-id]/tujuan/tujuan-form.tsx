import { useAppForm } from '@/components/form';
import { useCreateTujuan, useUpdateTujuan } from '@/hooks/query/tujuan';
import { Tujuan } from '@/types/database';
import { useParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import z from 'zod';

interface CreateOrUpdateTujuanFormProps {
  initialData?: Tujuan;
  onSuccess: () => void;
}

const formSchema = z.object({
  judul: z.string().min(1, { message: 'Judul tidak boleh kosong' }),
});

const CreateOrUpdateTujuanForm = ({
  initialData,
  onSuccess,
}: CreateOrUpdateTujuanFormProps) => {
  const params = useParams();
  const cascadingId = Number(params['cascading-id']);
  const createTujuan = useCreateTujuan(cascadingId);
  const updateTujuan = useUpdateTujuan(cascadingId);
  const form = useAppForm({
    defaultValues: {
      judul: initialData?.judul ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(formSchema.parse(value));
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateTujuan.mutateAsync({ id: initialData.id, ...payload });
          toast.success('Tujuan berhasil di-update');
        } else {
          await createTujuan.mutateAsync({ ...payload });
          toast.success('Tujuan berhasil dibuat');
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
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default CreateOrUpdateTujuanForm;
