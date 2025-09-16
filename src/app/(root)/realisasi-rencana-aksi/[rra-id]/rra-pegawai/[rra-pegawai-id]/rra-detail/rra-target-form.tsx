import { useAppForm } from '@/components/form';
import { useUpdateRraTarget } from '@/hooks/query/realisasi-rencana-aksi/rra-target';
import { RealisasiRencanaAksiTargetDetail } from '@/types/database';
import z from 'zod';

interface RealisasiRencanaAksiTargetFormProps {
  initialData: RealisasiRencanaAksiTargetDetail;
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
  hambatan: z.string().transform((val) => {
    if (!val.trim()) return null;
    return val;
  }),
  tindakLanjut: z.string().transform((val) => {
    if (!val.trim()) return null;
    return val;
  }),
});

const RealisasiRencanaAksiTargetForm = ({
  initialData,
  rraId,
  rraPegawaiId,
  onSuccess,
}: RealisasiRencanaAksiTargetFormProps) => {
  const updateRraTarget = useUpdateRraTarget(rraId, rraPegawaiId);
  const form = useAppForm({
    defaultValues: {
      target: initialData?.rencanaAksiTarget.target?.toString() ?? '',
      realisasi:
        initialData?.realisasiRencanaAksiTarget.realisasi?.toString() ?? '',
      hambatan: initialData?.realisasiRencanaAksiTarget.hambatan ?? '',
      tindakLanjut: initialData?.realisasiRencanaAksiTarget.tindakLanjut ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        await updateRraTarget.mutateAsync({
          id: initialData.realisasiRencanaAksiTarget.id,
          realisasi: payload.realisasi,
          capaian: calculateCapaian(
            initialData.rencanaAksiTarget.target,
            payload.realisasi,
            initialData.perjanjianKinerjaPegawaiSasaran.modelCapaian,
          ),
          hambatan: payload.hambatan,
          tindakLanjut: payload.tindakLanjut,
        });
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
        <form.AppField name="hambatan">
          {(field) => <field.TextAreaField label="Hambatan" />}
        </form.AppField>
        <form.AppField name="tindakLanjut">
          {(field) => <field.TextAreaField label="Tindak lanjut" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

const calculateCapaian = (
  target: number | null,
  realisasi: number | null,
  modelCapaian: number,
) => {
  if (target === null || realisasi === null) return null;
  let capaian = 0;
  if (modelCapaian === 1) {
    capaian = (realisasi / target) * 100;
  } else {
    capaian = (target / realisasi) * 100;
  }
  return capaian;
};

export default RealisasiRencanaAksiTargetForm;
