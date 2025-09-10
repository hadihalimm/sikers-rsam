import { useAppForm } from '@/components/form';
import {
  useCreateIndikatorKinerjaUtama,
  useUpdateIndikatorKinerjaUtama,
} from '@/hooks/query/indikator-kinerja-utama/indikator-kinerja-utama';
import { Cascading, IndikatorKinerjaUtama } from '@/types/database';
import { toast } from 'sonner';
import z from 'zod';

interface CreateOrUpdateIKUFormProps {
  initialData?: IndikatorKinerjaUtama;
  cascadingList: Cascading[];
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  cascadingId: z
    .string()
    .min(1, { message: 'Silahkan pilih cascading' })
    .transform((val) => Number(val)),
});

const CreateOrUpdateIKUForm = ({
  initialData,
  cascadingList,
  onSuccess,
}: CreateOrUpdateIKUFormProps) => {
  const createIku = useCreateIndikatorKinerjaUtama();
  const updateIku = useUpdateIndikatorKinerjaUtama();
  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      cascadingId: initialData?.cascadingId.toString() ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateIku.mutateAsync({
            id: initialData.id,
            nama: payload.nama,
          });
          toast.success('Renstra berhasil di-update');
        } else {
          await createIku.mutateAsync({ ...payload });
          toast.success('Renstra berhasil dibuat');
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

export default CreateOrUpdateIKUForm;
