import { useAppForm } from '@/components/form';
import {
  useCreateRencanaAksi,
  useUpdateRencanaAksi,
} from '@/hooks/query/rencana-aksi/rencana-aksi';
import { RencanaAksi } from '@/types/database';
import z from 'zod';

interface RencanaAksiFormInterface {
  initialData?: RencanaAksi;
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

const RencanaAksiForm = ({
  initialData,
  onSuccess,
}: RencanaAksiFormInterface) => {
  const createRencanaAksi = useCreateRencanaAksi();
  const updateRencanaAksi = useUpdateRencanaAksi();
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
          await updateRencanaAksi.mutateAsync({
            id: initialData.id,
            nama: payload.nama,
          });
        } else {
          await createRencanaAksi.mutateAsync({
            ...payload,
          });
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

export default RencanaAksiForm;
