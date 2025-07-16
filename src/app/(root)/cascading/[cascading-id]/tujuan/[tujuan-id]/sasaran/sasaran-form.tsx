import { useAppForm } from '@/components/form';
import { useCreateSasaran, useUpdateSasaran } from '@/hooks/query/sasaran';
import { Sasaran } from '@/types/database';
import { toast } from 'sonner';
import z from 'zod';

interface SasaranFormProps {
  initialData?: Sasaran;
  cascadingId: number;
  tujuanId: number;
  level: number;
  parentId?: number;
  onSuccess(): void;
}

const formSchema = z.object({
  judul: z.string().min(1, { message: 'Judul tidak boleh kosong' }),
  pengampu: z.string().min(1, { message: 'Pengampu tidak boleh kosong' }),
});

const CreateOrUpdateSasaranForm = ({
  initialData,
  cascadingId,
  tujuanId,
  level,
  parentId,
  onSuccess,
}: SasaranFormProps) => {
  const createSasaran = useCreateSasaran(tujuanId, cascadingId);
  const updateSasaran = useUpdateSasaran(tujuanId, cascadingId);

  const form = useAppForm({
    defaultValues: {
      judul: initialData?.judul ?? '',
      pengampu: initialData?.pengampu ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateSasaran.mutateAsync({ id: initialData.id, ...payload });
          toast.success('Sasaran berhasil di-update');
        } else {
          await createSasaran.mutateAsync({
            ...payload,
            level: level,
            parentId: parentId,
          });
          toast.success('Sasaran berhasil dibuat');
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
          {(field) => <field.TextAreaField label="Judul" />}
        </form.AppField>
        <form.AppField name="pengampu">
          {(field) => <field.TextField label="Pengampu" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default CreateOrUpdateSasaranForm;
