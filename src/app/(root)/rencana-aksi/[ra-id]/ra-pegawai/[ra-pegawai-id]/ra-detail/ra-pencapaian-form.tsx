import { useAppForm } from '@/components/form';
import {
  useCreateRaPencapaianLangkah,
  useUpdateRaPencapaianLangkah,
} from '@/hooks/query/rencana-aksi/ra-pencapaian-langkah';
import { useGetAllSatuan } from '@/hooks/query/satuan/satuan';
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
  satuanId: z
    .string()
    .min(1, { message: 'Silahkan pilih satuan' })
    .transform((val) => Number(val)),
  targetList: z.array(
    z.object({
      id: z.number(),
      bulan: z.number(),
      target: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
          message: 'Harus berupa angka',
        })
        .transform((val) => {
          if (!val.trim()) return null;
          return Number(val);
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
  const { data: satuanList = [] } = useGetAllSatuan();
  const createRaPencapaianLangkah = useCreateRaPencapaianLangkah(
    raId,
    raPegawaiId,
  );
  const updateRaPencapaianLangkah = useUpdateRaPencapaianLangkah(
    raId,
    raPegawaiId,
  );

  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      satuanId:
        initialData?.rencanaAksiPencapaianTargetList[0].satuanId.toString() ??
        '',
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
      try {
        if (!pkPegawaiSasaranId)
          throw new Error('no pkPegawaiSasaranId provided.');
        const payload = formSchema.parse(value);
        if (initialData) {
          const changedTargets = payload.targetList.filter((target) => {
            const original = initialData.rencanaAksiPencapaianTargetList.find(
              (t) => t.id === target.id,
            );
            return (
              target.target !== original?.target ||
              payload.satuanId !== original.satuanId
            );
          });
          await updateRaPencapaianLangkah.mutateAsync({
            id: initialData.id,
            nama: payload.nama,
            satuanId: payload.satuanId,
            targetList: changedTargets,
          });
        } else {
          await createRaPencapaianLangkah.mutateAsync({
            nama: payload.nama,
            satuanId: payload.satuanId,
            targetList: payload.targetList,
            pkPegawaiSasaranId,
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
          {(field) => <field.TextAreaField label="Nama" />}
        </form.AppField>
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
