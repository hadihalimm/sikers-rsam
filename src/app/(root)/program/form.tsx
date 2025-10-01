import { useAppForm } from '@/components/form';
import {
  useCreateRefKegiatan,
  useUpdateRefKegiatan,
} from '@/hooks/query/ref/ref-kegiatan';
import {
  useCreateRefProgram,
  useUpdateRefProgram,
} from '@/hooks/query/ref/ref-program';
import {
  useCreateRefSubKegiatan,
  useUpdateRefSubKegiatan,
} from '@/hooks/query/ref/ref-sub-kegiatan';
import { RefKegiatan, RefProgram, RefSubKegiatan } from '@/types/database';
import z from 'zod';

interface ProgramDetailFormProps {
  type: 'program' | 'kegiatan' | 'subKegiatan';
  initialData?: RefProgram | RefKegiatan | RefSubKegiatan;
  programId?: number;
  kegiatanId?: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
});

const ProgramDetailForm = ({
  type,
  initialData,
  programId,
  kegiatanId,
  onSuccess,
}: ProgramDetailFormProps) => {
  const createProgram = useCreateRefProgram();
  const createKegiatan = useCreateRefKegiatan();
  const createSubKegiatan = useCreateRefSubKegiatan();
  const updateProgram = useUpdateRefProgram();
  const updateKegiatan = useUpdateRefKegiatan();
  const updateSubKegiatan = useUpdateRefSubKegiatan();
  const form = useAppForm({
    defaultValues: {
      nama: initialData?.nama ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = formSchema.parse(value);
      if (initialData) {
        switch (type) {
          case 'program':
            await updateProgram.mutateAsync({
              id: initialData.id,
              nama: payload.nama,
            });
            break;

          case 'kegiatan':
            await updateKegiatan.mutateAsync({
              id: initialData.id,
              nama: payload.nama,
            });
            break;

          case 'subKegiatan':
            await updateSubKegiatan.mutateAsync({
              id: initialData.id,
              nama: payload.nama,
            });
            break;
        }
      } else {
        switch (type) {
          case 'program':
            await createProgram.mutateAsync({ nama: payload.nama });
            break;
          case 'kegiatan':
            await createKegiatan.mutateAsync({
              nama: payload.nama,
              refProgramId: programId!,
            });
            break;
          case 'subKegiatan':
            await createSubKegiatan.mutateAsync({
              nama: payload.nama,
              refKegiatanId: kegiatanId!,
            });
            break;
        }
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
          {(field) => <field.TextAreaField label="Nama" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default ProgramDetailForm;
