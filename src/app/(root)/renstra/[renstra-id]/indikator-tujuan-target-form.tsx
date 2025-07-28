import z from 'zod';
import { IndikatorTujuanTarget } from '@/types/database';
import { useUpdateIndikatorTujuanTarget } from '@/hooks/query/renstra/indikator-tujuan-target';
import { useAppForm } from '@/components/form';

interface IndikatorTujuanTargetFormProps {
  initialData?: IndikatorTujuanTarget;
  renstraId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  target: z.string().min(1, { message: 'Target tidak boleh kosong' }),
});

const IndikatorTujuanTargetForm = ({
  initialData,
  renstraId,
  onSuccess,
}: IndikatorTujuanTargetFormProps) => {
  const updateIndikatorTujuanTarget = useUpdateIndikatorTujuanTarget(renstraId);
  const form = useAppForm({
    defaultValues: {
      target: initialData?.target ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateIndikatorTujuanTarget.mutateAsync({
            id: initialData.id,
            ...payload,
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
          {(field) => <field.TextField label="Target" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default IndikatorTujuanTargetForm;
