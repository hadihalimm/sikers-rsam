import { useAppForm } from '@/components/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCreateDokumenLakip,
  useUpdateDokumenLakip,
} from '@/hooks/query/dokumen/dokumen-lakip';
import { DokumenLakip } from '@/types/database';
import { AlertCircle } from 'lucide-react';
import z from 'zod';

interface DokumenLakipFormProps {
  initialData?: DokumenLakip;
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  file: z.union([z.file(), z.undefined()]).refine(
    (file) => {
      if (!file) return true;

      return [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
      ].includes(file.type);
    },
    {
      message: 'Invalid file type',
    },
  ),
});

const DokumenLakipForm = ({
  initialData,
  onSuccess,
}: DokumenLakipFormProps) => {
  const createDokumenLakip = useCreateDokumenLakip();
  const updateDokumenLakip = useUpdateDokumenLakip();

  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
      file: undefined as File | undefined,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (initialData) {
        await updateDokumenLakip.mutateAsync({
          id: initialData.id,
          nama: value.nama,
          file: value.file,
        });
      } else {
        if (form.getFieldValue('file') === undefined) {
          form.setErrorMap({
            onChange: {
              fields: {
                file: { message: 'Silahkan pilih dokumen' },
              },
            },
          });
          return;
        }
        await createDokumenLakip.mutateAsync({
          nama: value.nama,
          file: value.file!,
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
        <form.AppField name="file">
          {(field) => (
            <div className="flex flex-col gap-y-1">
              <Label>Dokumen</Label>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.handleChange(file);
                }}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.map((err, index) => (
                  <div key={index} className="flex items-center gap-x-1">
                    <AlertCircle size="15" className="text-destructive" />
                    <p className="text-xs text-destructive">{err?.message}</p>
                  </div>
                ))}
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

export default DokumenLakipForm;
