import { useAppForm } from '@/components/form';
import { useUpdateRaTarget } from '@/hooks/query/rencana-aksi/ra-target';
import { RencanaAksiTarget } from '@/types/database';
import z from 'zod';

interface TargetKinerjaFormProps {
  initialData?: RencanaAksiTarget[];
  raId: number;
  raPegawaiId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  targetList: z.array(
    z.object({
      id: z.number(),
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

const TargetKinerjaForm = ({
  initialData,
  raId,
  raPegawaiId,
  onSuccess,
}: TargetKinerjaFormProps) => {
  const updateRaTarget = useUpdateRaTarget(raId, raPegawaiId);
  const form = useAppForm({
    defaultValues: {
      targetList: initialData?.map((item) => ({
        id: item.id,
        target: item.target?.toString() ?? '',
      })),
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = formSchema.parse(value);
      const changedItems = payload.targetList.filter((item) => {
        const initialTarget = initialData?.find(
          (data) => data.id === item.id,
        )?.target;
        return item.target !== initialTarget;
      });
      await Promise.all(
        changedItems.map((item) =>
          updateRaTarget.mutateAsync({ id: item.id, target: item.target }),
        ),
      );
      onSuccess();
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="grid grid-rows-6 grid-cols-2 grid-flow-col gap-y-2 gap-x-4">
        {initialData?.map((item, index) => (
          <form.AppField name={`targetList[${index}].target`} key={item.id}>
            {(field) => <field.TextField label={`Bulan ${item.bulan}`} />}
          </form.AppField>
        ))}
      </div>
      <form.AppForm>
        <form.SubmitButton className="mt-6 w-full">Submit</form.SubmitButton>
      </form.AppForm>
    </form>
  );
};

export default TargetKinerjaForm;
