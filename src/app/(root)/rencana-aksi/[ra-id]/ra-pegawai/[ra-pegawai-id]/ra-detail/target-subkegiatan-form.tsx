import { useAppForm } from '@/components/form';
import {
  useCreateRaSubkegiatanTarget,
  useUpdateRaSubkegiatanTarget,
} from '@/hooks/query/rencana-aksi/ra-subkegiatan-target';
import { useGetAllSatuan } from '@/hooks/query/satuan/satuan';
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
  satuanId: z
    .string()
    .min(1, { message: 'Silahkan pilih satuan' })
    .transform((val) => Number(val)),
});

const RencanaAksiSubkegiatanTargetForm = ({
  initialData,
  raId,
  raPegawaiId,
  pkPegawaiProgramId,
  onSuccess,
}: RencanaAksiSubkegiatanTargetFormProps) => {
  const { data: satuanList = [] } = useGetAllSatuan();
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
      target: initialData?.target?.toString() ?? '',
      satuanId: initialData?.satuanId.toString() ?? '',
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
          satuanId: payload.satuanId,
        });
      } else {
        if (!pkPegawaiProgramId) {
          return;
        }
        await createRaSubkegiatanTarget.mutateAsync({
          nama: payload.nama,
          target: payload.target,
          satuanId: payload.satuanId,
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
        <div className="flex gap-x-2">
          <div className="w-3/5">
            <form.AppField name="target">
              {(field) => <field.TextField label="Target" />}
            </form.AppField>
          </div>
          <div className="w-2/5">
            <form.AppField name="satuanId">
              {(field) => (
                <field.SelectWithSearchField
                  label="Satuan"
                  placeholder="Satuan"
                  options={satuanList.map((item) => ({
                    label: item.nama,
                    value: String(item.id),
                  }))}
                />
              )}
            </form.AppField>
          </div>
        </div>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default RencanaAksiSubkegiatanTargetForm;
