import { useAppForm } from '@/components/form';
import {
  useCreateIndikatorSasaran,
  useUpdateIndikatorSasaran,
} from '@/hooks/query/cascading/indikator-sasaran';
import { IndikatorSasaran } from '@/types/database';
import { toast } from 'sonner';
import z from 'zod';

interface IndikatorSasaranFormProps {
  initialData?: IndikatorSasaran;
  sasaranId: number;
  tujuanId: number;
  cascadingId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama indikator tidak boleh kosong' }),
});

const CreateOrUpdateIndikatorSasaranForm = ({
  initialData,
  sasaranId,
  tujuanId,
  cascadingId,
  onSuccess,
}: IndikatorSasaranFormProps) => {
  const createIndikatorSasaran = useCreateIndikatorSasaran(
    sasaranId,
    tujuanId,
    cascadingId,
  );
  const updateIndikatorSasaran = useUpdateIndikatorSasaran(
    sasaranId,
    tujuanId,
    cascadingId,
  );

  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateIndikatorSasaran.mutateAsync({
            id: initialData.id,
            ...payload,
          });
          toast.success('Indikator sasaran berhasil di-update');
        } else {
          await createIndikatorSasaran.mutateAsync({
            ...payload,
          });
          toast.success('Indikator sasaran berhasil dibuat');
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
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default CreateOrUpdateIndikatorSasaranForm;
