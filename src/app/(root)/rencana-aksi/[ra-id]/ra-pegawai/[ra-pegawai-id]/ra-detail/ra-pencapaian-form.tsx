import { useAppForm } from '@/components/form';
import {
  useCreateRaPencapaianLangkah,
  useUpdateRaPencapaianLangkah,
} from '@/hooks/query/rencana-aksi/ra-pencapaian-langkah';
import {
  useCreateRaPencapaianTarget,
  useUpdateRaPencapaianTarget,
} from '@/hooks/query/rencana-aksi/ra-pencapaian-target';
import { getQueryClient } from '@/lib/get-query-client';
import { RencanaAksiPencapaianDetail } from '@/types/database';
import z from 'zod';

interface RencanaAksiPencapaianFormProps {
  initialData?: RencanaAksiPencapaianDetail;
  raId: number;
  raPegawaiId: number;
  pkPegawaiSasaranId: number | undefined;
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  targetList: z.array(
    z.object({
      id: z.number(),
      bulan: z.number(),
      target: z.string().transform((val) => {
        if (!val.trim()) return null;
        return val;
      }),
    }),
  ),
});

const RencanaAksiPencapaianForm = ({
  initialData,
  raId,
  raPegawaiId,
  pkPegawaiSasaranId,
  onSuccess,
}: RencanaAksiPencapaianFormProps) => {
  const createRaPencapaianLangkah = useCreateRaPencapaianLangkah(
    raId,
    raPegawaiId,
  );
  const updateRaPencapaianLangkah = useUpdateRaPencapaianLangkah(
    raId,
    raPegawaiId,
  );
  const createRaPencapaianTarget = useCreateRaPencapaianTarget(
    raId,
    raPegawaiId,
  );
  const updateRaPencapaianTarget = useUpdateRaPencapaianTarget(
    raId,
    raPegawaiId,
    initialData?.id ?? 0,
  );

  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      targetList:
        initialData?.rencanaAksiPencapaianTargetList.map((item) => ({
          id: item.id,
          bulan: item.bulan,
          target: item.target?.toString() ?? '',
        })) ??
        Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          bulan: i + 1,
          target: '',
        })),
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = formSchema.parse(value);
      const queryClient = getQueryClient();
      if (initialData) {
        const changedItems = payload.targetList.filter((item) => {
          const initialTarget =
            initialData.rencanaAksiPencapaianTargetList.find(
              (data) => data.id === item.id,
            )?.target;
          return item.target !== initialTarget;
        });
        await updateRaPencapaianLangkah.mutateAsync({
          id: initialData.id,
          nama: payload.nama,
        });
        await Promise.all(
          changedItems.map((target) =>
            updateRaPencapaianTarget.mutateAsync({
              id: target.id,
              target: target.target,
            }),
          ),
        );
      } else {
        if (!pkPegawaiSasaranId) {
          onSuccess();
          return;
        }
        const raPencapaianLangkah = await createRaPencapaianLangkah.mutateAsync(
          {
            nama: payload.nama,
            pkPegawaiSasaranId: pkPegawaiSasaranId,
          },
        );
        await Promise.all(
          payload.targetList.map((target) =>
            createRaPencapaianTarget.mutateAsync({
              bulan: target.bulan,
              target: target.target,
              newRaPencapaianLangkahId: raPencapaianLangkah.id,
            }),
          ),
        );
      }
      queryClient.invalidateQueries({
        queryKey: ['ra-pencapaian-langkah-list', raPegawaiId],
      });
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
          {(field) => <field.TextAreaField label="Nama" />}
        </form.AppField>

        <div className="grid grid-rows-4 grid-cols-3 grid-flow-col gap-y-2 gap-x-4">
          {form.state.values.targetList.map((item, index) => (
            <form.AppField name={`targetList[${index}].target`} key={item.id}>
              {(field) => <field.TextField label={`Bulan ${item.bulan}`} />}
            </form.AppField>
          ))}
        </div>
        <form.AppForm>
          <form.SubmitButton className="mt-6 w-full">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default RencanaAksiPencapaianForm;
