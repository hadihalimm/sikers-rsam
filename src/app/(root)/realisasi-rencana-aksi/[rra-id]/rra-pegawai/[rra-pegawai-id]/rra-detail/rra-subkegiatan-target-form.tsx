import { useAppForm } from '@/components/form';
import { useUpdateRraSubkegiatanTarget } from '@/hooks/query/realisasi-rencana-aksi/rra-subkegiatan-target';
import { RealisasiRencanaAksiSubkegiatanTargetDetail } from '@/types/database';
import z from 'zod';

interface RealisasiRencanaAksiSubkegiatanTargetFormProps {
  initialData?: RealisasiRencanaAksiSubkegiatanTargetDetail;
  rraId: number;
  rraPegawaiId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  target: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Harus berupa angka',
    })
    .transform((val) => {
      if (!val.trim()) return null;
      return Number(val);
    }),
  realisasi: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Harus berupa angka',
    })
    .transform((val) => {
      if (!val.trim()) return null;
      return Number(val);
    }),
  realisasiAnggaran: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Harus berupa angka',
    })
    .transform((val) => {
      if (!val.trim()) return null;
      return Number(val);
    }),
});

const RealisasiRencanaAksiSubkegiatanTargetForm = ({
  initialData,
  rraId,
  rraPegawaiId,
  onSuccess,
}: RealisasiRencanaAksiSubkegiatanTargetFormProps) => {
  const updateRraSubkegiatanTarget = useUpdateRraSubkegiatanTarget(
    rraId,
    rraPegawaiId,
  );
  const form = useAppForm({
    defaultValues: {
      target:
        initialData?.rencanaAksiSubKegiatanTarget.target?.toString() ?? '',
      realisasi:
        initialData?.realisasiRencanaAksiSubkegiatanTarget.realisasi?.toString() ??
        '',
      realisasiAnggaran:
        initialData?.realisasiRencanaAksiSubkegiatanTarget.realisasiAnggaran?.toString() ??
        '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateRraSubkegiatanTarget.mutateAsync({
            id: initialData.realisasiRencanaAksiSubkegiatanTarget.id,
            realisasi: payload.realisasi,
            realisasiAnggaran: payload.realisasiAnggaran,
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
        <form.AppField name="target">
          {(field) => (
            <div className="flex gap-x-2 items-center">
              <field.TextField label="Target" disabled={true} />
              <p className="mt-4">{initialData?.satuan.nama}</p>
            </div>
          )}
        </form.AppField>
        <form.AppField name="realisasi">
          {(field) => (
            <div className="flex gap-x-2 items-center">
              <field.TextField label="Realisasi" />
              <p className="mt-4">{initialData?.satuan.nama}</p>
            </div>
          )}
        </form.AppField>
        <form.AppField name="realisasiAnggaran">
          {(field) => (
            <div className="flex gap-x-2">
              <p className="mt-[25px] text-sm">Rp.</p>
              <field.TextField label="Realisasi anggaran" className="w-full" />
            </div>
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default RealisasiRencanaAksiSubkegiatanTargetForm;
