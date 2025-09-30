import { useAppForm } from '@/components/form';
import { useUpdateRraPencapaianTarget } from '@/hooks/query/realisasi-rencana-aksi/rra-pencapaian-target';
import { RealisasiRencanaAksiPencapaianTargetDetail } from '@/types/database';
import z from 'zod';

interface RealisasiRencanaAksiPencapaianTargetFormProps {
  initialData: RealisasiRencanaAksiPencapaianTargetDetail;
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
});

const RealisasiRencanaAksiPencapaianTargetForm = ({
  initialData,
  rraId,
  rraPegawaiId,
  onSuccess,
}: RealisasiRencanaAksiPencapaianTargetFormProps) => {
  const updateRraPencapaianTarget = useUpdateRraPencapaianTarget(
    rraId,
    rraPegawaiId,
  );
  const form = useAppForm({
    defaultValues: {
      target: initialData.rencanaAksiPencapaianTarget.target?.toString() ?? '',
      realisasi:
        initialData.realisasiRencanaAksiPencapaianTarget.realisasi?.toString() ??
        '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        await updateRraPencapaianTarget.mutateAsync({
          id: initialData.realisasiRencanaAksiPencapaianTarget.id,
          realisasi: payload.realisasi,
          capaian: calculateCapaian(
            initialData.rencanaAksiPencapaianTarget.target,
            payload.realisasi,
          ),
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
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

const calculateCapaian = (target: number | null, realisasi: number | null) => {
  if (target === null || realisasi === null) return null;
  return (realisasi / target) * 100;
};

export default RealisasiRencanaAksiPencapaianTargetForm;
