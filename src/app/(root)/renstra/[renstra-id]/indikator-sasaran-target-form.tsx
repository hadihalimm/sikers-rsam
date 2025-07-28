import { useAppForm } from '@/components/form';
import { useUpdateIndikatorSasaranTarget } from '@/hooks/query/renstra/indikator-sasaran-target';
import { IndikatorSasaranTarget } from '@/types/database';
import z from 'zod';

interface IndikatorSasaranTargetFormProps {
  initialData?: IndikatorSasaranTarget[];
  renstraId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  targetList: z.array(
    z.object({
      id: z.number(),
      target: z.string().min(1, { message: 'Target tidak boleh kosong' }),
    }),
  ),
});

const IndikatorSasaranTargetForm = ({
  initialData,
  renstraId,
  onSuccess,
}: IndikatorSasaranTargetFormProps) => {
  const updateIndikatorSasaranTarget =
    useUpdateIndikatorSasaranTarget(renstraId);
  const form = useAppForm({
    defaultValues: {
      targetList:
        initialData?.map((item) => ({
          id: item.id,
          target: item.target || '',
        })) ?? [],
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const parsedValue = formSchema.parse(value);
      try {
        parsedValue.targetList.map(async (target) => {
          await updateIndikatorSasaranTarget.mutateAsync({
            id: target.id,
            target: target.target,
          });
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
        {initialData?.map((item, index) => (
          <form.AppField name={`targetList[${index}].target`} key={item.id}>
            {(field) => <field.TextField label={`${item.tahun}`} />}
          </form.AppField>
        ))}
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default IndikatorSasaranTargetForm;
