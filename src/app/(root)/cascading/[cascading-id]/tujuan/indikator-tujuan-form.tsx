import { useAppForm } from '@/components/form';
import {
  useCreateIndikatorTujuan,
  useUpdateIndikatorTujuan,
} from '@/hooks/query/cascading/indikator-tujuan';
import { IndikatorTujuan } from '@/types/database';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import z from 'zod';

interface CreateOrUpdateIndikatorTujuanFormProps {
  initialData?: IndikatorTujuan;
  tujuanId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Judul tidak boleh kosong' }),
});

const IndikatorTujuanForm = ({
  initialData,
  tujuanId,
  onSuccess,
}: CreateOrUpdateIndikatorTujuanFormProps) => {
  const params = useParams();
  const cascadingId = Number(params['cascading-id']);
  const createIndikatorTujuan = useCreateIndikatorTujuan(tujuanId, cascadingId);
  const updateIndikatorTujuan = useUpdateIndikatorTujuan(tujuanId, cascadingId);
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
          await updateIndikatorTujuan.mutateAsync({
            id: initialData.id,
            ...payload,
          });
          toast.success('Indikator tujuan berhasil di-update');
        } else {
          await createIndikatorTujuan.mutateAsync({
            ...payload,
          });
          toast.success('Indikator tujuan berhasil dibuat');
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

export default IndikatorTujuanForm;
