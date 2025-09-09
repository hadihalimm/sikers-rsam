import { useAppForm } from '@/components/form';
import {
  useCreateRaSubkegiatanTarget,
  useUpdateRaSubkegiatanTarget,
} from '@/hooks/query/rencana-aksi/ra-subkegiatan-target';
import { RencanaAksiSubKegiatanTarget } from '@/types/database';
import z from 'zod';

interface RencanaAksiSubkegiatanTargetFormProps {
  initialData?: RencanaAksiSubKegiatanTarget;
  raId: number;
  raPegawaiId: number;
  pkPegawaiProgramId: number | undefined;
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  target: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Harus berupa angka',
    })
    .transform((val) => Number(val)),
  satuan: z.string(),
});

const RencanaAksiSubkegiatanTargetForm = ({
  initialData,
  raId,
  raPegawaiId,
  pkPegawaiProgramId,
  onSuccess,
}: RencanaAksiSubkegiatanTargetFormProps) => {
  const createRaSubkegiatanTarget = useCreateRaSubkegiatanTarget(
    raId,
    raPegawaiId,
  );
  const updateRaSubkegiatanTarget = useUpdateRaSubkegiatanTarget(
    raId,
    raPegawaiId,
  );
  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      target: initialData?.target ?? '',
      satuan: initialData?.satuan ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = formSchema.parse(value);
      if (initialData) {
        await updateRaSubkegiatanTarget.mutateAsync({
          id: initialData.id,
          nama: payload.nama,
          target: payload.target,
          satuan: payload.satuan,
        });
      } else {
        if (!pkPegawaiProgramId) {
          return;
        }
        await createRaSubkegiatanTarget.mutateAsync({
          nama: payload.nama,
          target: payload.target,
          satuan: payload.satuan,
          pkPegawaiProgramId,
        });
      }
      onSuccess();
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
        <form.AppField name="target">
          {(field) => <field.TextField label="Target" />}
        </form.AppField>
        <form.AppField name="satuan">
          {(field) => <field.TextField label="Satuan" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default RencanaAksiSubkegiatanTargetForm;
