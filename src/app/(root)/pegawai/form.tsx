import { useAppForm } from '@/components/form';
import {
  useCreatePegawai,
  useUpdatePegawai,
} from '@/hooks/query/pegawai/pegawai';
import { Pegawai } from '@/types/database';
import z from 'zod';

interface PegawaiFormProps {
  initialData?: Pegawai;
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  nip: z.string(),
  jabatan: z.string(),
  profesi: z.string(),
  penempatan: z.string(),
});

const PegawaiForm = ({ initialData, onSuccess }: PegawaiFormProps) => {
  const createPegawai = useCreatePegawai();
  const updatePegawai = useUpdatePegawai();
  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      nip: initialData?.nip ?? '',
      jabatan: initialData?.jabatan ?? '',
      profesi: initialData?.profesi ?? '',
      penempatan: initialData?.penempatan ?? '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updatePegawai.mutateAsync({
            id: initialData.id,
            nama: payload.nama,
            nip: payload.nip,
            jabatan: payload.jabatan,
            profesi: payload.profesi,
            penempatan: payload.penempatan,
          });
        } else {
          await createPegawai.mutateAsync({
            nama: payload.nama,
            nip: payload.nip,
            jabatan: payload.jabatan,
            profesi: payload.profesi,
            penempatan: payload.penempatan,
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
      }}
    >
      <div className="flex flex-col gap-y-4">
        <form.AppField name="nama">
          {(field) => <field.TextField label="Nama" />}
        </form.AppField>
        <form.AppField name="nip">
          {(field) => <field.TextField label="NIP" />}
        </form.AppField>
        <form.AppField name="jabatan">
          {(field) => <field.TextField label="Jabatan" />}
        </form.AppField>
        <form.AppField name="profesi">
          {(field) => <field.TextField label="Profesi" />}
        </form.AppField>
        <form.AppField name="penempatan">
          {(field) => <field.TextField label="Penempatan" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default PegawaiForm;
