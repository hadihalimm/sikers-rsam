import { useAppForm } from '@/components/form';
import {
  useCreatePerjanjianKinerja,
  useUpdatePerjanjianKinerja,
} from '@/hooks/query/perjanjian-kinerja/perjanjian-kinerja';
import { PerjanjianKinerja } from '@/types/database';
import { toast } from 'sonner';
import z from 'zod';

interface PerjanjianKinerjaForm {
  initialData?: PerjanjianKinerja;
  userId: string;
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
});

const PerjanjianKinerjaForm = ({
  initialData,
  userId,
  onSuccess,
}: PerjanjianKinerjaForm) => {
  const createPk = useCreatePerjanjianKinerja();
  const updatePk = useUpdatePerjanjianKinerja();
  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      tahun: initialData?.tahun.toString() ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updatePk.mutateAsync({
            id: initialData.id,
            nama: payload.nama,
          });
          toast.success('Perjanjian Kinerja berhasil di-update');
        } else {
          await createPk.mutateAsync({
            ...payload,
            userId,
          });
          toast.success('Perjanjian Kinerja berhasil dibuat');
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
          {(field) => (
            <field.TextField
              label="Tahun"
              disabled={initialData ? true : false}
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

export default PerjanjianKinerjaForm;
