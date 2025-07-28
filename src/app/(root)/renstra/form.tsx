import { useAppForm } from '@/components/form';
import {
  useCreateRenstra,
  useUpdateRenstra,
} from '@/hooks/query/renstra/renstra';
import { Cascading, Renstra } from '@/types/database';
import { toast } from 'sonner';
import z from 'zod';

interface CreateOrUpdateRenstraFormProps {
  initialData?: Renstra;
  cascadingList: Cascading[];
  onSuccess: () => void;
}

const formSchema = z.object({
  judul: z.string().min(1, { message: 'Judul tidak boleh kosong' }),
  cascadingId: z
    .string()
    .min(1, { message: 'Silahkan pilih cascading' })
    .transform((val) => Number(val)),
});

const CreateOrUpdateRenstraForm = ({
  initialData,
  cascadingList,
  onSuccess,
}: CreateOrUpdateRenstraFormProps) => {
  const createRenstra = useCreateRenstra();
  const updateRenstra = useUpdateRenstra();
  const form = useAppForm({
    defaultValues: {
      judul: initialData?.judul ?? '',
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
          await updateRenstra.mutateAsync({
            id: initialData.id,
            judul: payload.judul,
          });
          toast.success('Renstra berhasil di-update');
        } else {
          await createRenstra.mutateAsync({ ...payload });
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
        <form.AppField name="judul">
          {(field) => <field.TextField label="Judul" />}
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

export default CreateOrUpdateRenstraForm;
