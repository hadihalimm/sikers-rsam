import { useAppForm } from '@/components/form';
import { useCreatePkPegawai } from '@/hooks/query/perjanjian-kinerja/pk-pegawai';
import { Pegawai, PerjanjianKinerja } from '@/types/database';
import { toast } from 'sonner';
import z from 'zod';

interface PerjanjianKinerjaPegawaiFormProps {
  perjanjianKinerja: PerjanjianKinerja;
  pegawaiList: Pegawai[];
  onSuccess: () => void;
}

const formSchema = z.object({
  pegawaiId: z
    .string()
    .min(1, { message: 'Silahkan pilih pegawai' })
    .transform((val) => Number(val)),
  tahun: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 2000, {
      message: 'Harus sesudah tahun 2000',
    })
    .transform((val) => Number(val)),
});

const PerjanjianKinerjaPegawaiForm = ({
  perjanjianKinerja,
  pegawaiList,
  onSuccess,
}: PerjanjianKinerjaPegawaiFormProps) => {
  const createPkPegawai = useCreatePkPegawai(perjanjianKinerja.id);
  const form = useAppForm({
    defaultValues: {
      pegawaiId: '',
      tahun: perjanjianKinerja.tahun.toString(),
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        await createPkPegawai.mutateAsync({
          ...payload,
        });
        toast.success('PK Pegawai berhasil dibuat');
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
        <form.AppField name="pegawaiId">
          {(field) => (
            <field.SelectWithSearchField
              label="Pegawai"
              placeholder="Pegawai"
              options={pegawaiList.map((pegawai) => ({
                label: pegawai.nama,
                value: String(pegawai.id),
              }))}
            />
          )}
        </form.AppField>
        <form.AppField name="tahun">
          {(field) => <field.TextField label="Tahun" disabled={true} />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default PerjanjianKinerjaPegawaiForm;
