import { useAppForm } from '@/components/form';
import { useUpdateRealisasiRencanaAksi } from '@/hooks/query/realisasi-rencana-aksi/realisasi-rencana-aksi';
import { RealisasiRencanaAksi } from '@/types/database';
import z from 'zod';

interface RealisasiRencanaAksiFormProps {
  initialData?: RealisasiRencanaAksi;
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

const RealisasiRencanaAksiForm = ({
  initialData,
  onSuccess,
}: RealisasiRencanaAksiFormProps) => {
  const updateRealisasiRencanaAksi = useUpdateRealisasiRencanaAksi();
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
          await updateRealisasiRencanaAksi.mutateAsync({
            id: initialData.id,
            nama: payload.nama,
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

export default RealisasiRencanaAksiForm;
