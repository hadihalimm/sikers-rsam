import { useAppForm } from '@/components/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCreateDokumenEvaluasi,
  useUpdateDokumenEvaluasi,
} from '@/hooks/query/dokumen/dokumen-evaluasi';
import { DokumenEvaluasi } from '@/types/database';
import { AlertCircle } from 'lucide-react';
import z from 'zod';

interface DokumenEvaluasiFormProps {
  initialData?: DokumenEvaluasi;
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

const DokumenEvaluasiForm = ({
  initialData,
  onSuccess,
}: DokumenEvaluasiFormProps) => {
  const createDokumenEvaluasi = useCreateDokumenEvaluasi();
  const updateDokumenEvaluasi = useUpdateDokumenEvaluasi();

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
        await updateDokumenEvaluasi.mutateAsync({
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
        await createDokumenEvaluasi.mutateAsync({
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

export default DokumenEvaluasiForm;
