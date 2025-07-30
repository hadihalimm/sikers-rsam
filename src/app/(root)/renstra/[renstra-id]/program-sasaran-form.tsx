import { useAppForm } from '@/components/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useGetAllRefKegiatan } from '@/hooks/query/ref/ref-kegiatan';
import { useGetAllRefProgram } from '@/hooks/query/ref/ref-program';
import { useGetAllRefSubKegiatan } from '@/hooks/query/ref/ref-sub-kegiatan';
import { useCreateProgramSasaran } from '@/hooks/query/renstra/program-sasaran';
import { useStore } from '@tanstack/react-form';
import z from 'zod';

interface ProgramSasaranFormProps {
  renstraId: number;
  sasaranId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  refProgramId: z
    .string()
    .min(1, { message: 'Silahkan pilih Program' })
    .transform((val) => Number(val)),
  refKegiatanId: z
    .string()
    .min(1, { message: 'Silahkan pilih Kegiatan' })
    .transform((val) => Number(val)),
  refSubKegiatanIds: z.array(z.number()),
});

const ProgramSasaranForm = ({
  renstraId,
  sasaranId,
  onSuccess,
}: ProgramSasaranFormProps) => {
  const createProgramSasaran = useCreateProgramSasaran(renstraId);
  const form = useAppForm({
    defaultValues: {
      refProgramId: '',
      refKegiatanId: '',
      refSubKegiatanIds: [] as number[],
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        await createProgramSasaran.mutateAsync({
          sasaranId: sasaranId,
          refProgramId: payload.refProgramId,
          refKegiatanId: payload.refKegiatanId,
          refSubKegiatanIds: payload.refSubKegiatanIds,
        });
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });
  const refProgramId = useStore(
    form.store,
    (state) => state.values.refProgramId,
  );
  const refKegiatanId = useStore(
    form.store,
    (state) => state.values.refKegiatanId,
  );
  const { data: refProgramList = [] } = useGetAllRefProgram();
  const { data: refKegiatanList = [] } = useGetAllRefKegiatan(
    Number(refProgramId),
  );
  const { data: refSubKegiatanList = [] } = useGetAllRefSubKegiatan(
    Number(refKegiatanId),
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="flex flex-col gap-y-4">
        <form.AppField name="refProgramId">
          {(field) => (
            <field.SelectField
              label="Program"
              placeholder="Pilih program..."
              options={refProgramList.map((program) => ({
                label: program.nama,
                value: String(program.id),
              }))}
              className="max-w-full whitespace-normal break-words"
            />
          )}
        </form.AppField>
        <form.AppField name="refKegiatanId">
          {(field) => (
            <field.SelectField
              label="Kegiatan"
              placeholder="Pilih kegiatan..."
              options={refKegiatanList.map((kegiatan) => ({
                label: kegiatan.nama,
                value: String(kegiatan.id),
              }))}
              onValueChange={() => form.setFieldValue('refSubKegiatanIds', [])}
            />
          )}
        </form.AppField>
        <form.AppField name="refSubKegiatanIds">
          {(field) => (
            <div className="flex flex-col gap-y-4">
              <Label className="ml-1">Sub-Kegiatan</Label>
              {refSubKegiatanList.map((item) => {
                return (
                  <div key={item.id} className="flex gap-x-2">
                    <Checkbox
                      id={`sub-kegiatan-${item.id}`}
                      onCheckedChange={(checked) => {
                        const value = checked
                          ? [...field.state.value, item.id]
                          : field.state.value.filter((id) => id !== item.id);
                        field.handleChange(value);
                      }}
                    />
                    <Label
                      htmlFor={`sub-kegiatan-${item.id}`}
                      className="font-normal">
                      {item.nama}
                    </Label>
                  </div>
                );
              })}
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

export default ProgramSasaranForm;
