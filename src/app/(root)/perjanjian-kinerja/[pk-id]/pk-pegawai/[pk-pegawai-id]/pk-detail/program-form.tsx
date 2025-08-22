import { useAppForm } from '@/components/form';
import {
  useCreatePkPegawaiProgramDetail,
  useGetPkPegawaiProgramDetail,
  useUpdatePkPegawaiProgramDetail,
} from '@/hooks/query/perjanjian-kinerja/pk-pegawai-program-detail';
import { useGetAllRefKegiatan } from '@/hooks/query/ref/ref-kegiatan';
import { useGetAllRefProgram } from '@/hooks/query/ref/ref-program';
import { useGetAllRefSubKegiatan } from '@/hooks/query/ref/ref-sub-kegiatan';
import { PerjanjianKinerjaPegawaiProgramDetail } from '@/types/database';
import { useStore } from '@tanstack/react-form';
import z from 'zod';

interface PerjanjianKinerjaProgramFormProps {
  initialData?: PerjanjianKinerjaPegawaiProgramDetail;
  pkId: number;
  pkPegawaiId: number;
  pkPegawaiProgramId: number;
  onSuccess: () => void;
}

const formSchema = z.object({
  programId: z
    .string()
    .min(1, { message: 'Silahkan pilih program' })
    .transform((val) => Number(val)),
  kegiatanId: z
    .string()
    .min(1, { message: 'Silahkan pilih kegiatan' })
    .transform((val) => Number(val)),
  subKegiatanId: z
    .string()
    .min(1, { message: 'Silahkan pilih sub-kegiatan' })
    .transform((val) => Number(val)),
  anggaran: z
    .string()
    .min(1, { message: 'Anggaran tidak boleh kosong' })
    .transform((val) => Number(val)),
});

const PerjanjianKinerjaProgramForm = ({
  initialData,
  pkId,
  pkPegawaiId,
  pkPegawaiProgramId,
  onSuccess,
}: PerjanjianKinerjaProgramFormProps) => {
  const { data: pkPegawaiProgramDetail } = useGetPkPegawaiProgramDetail(
    pkId,
    pkPegawaiId,
    pkPegawaiProgramId,
    initialData?.id ?? 0,
  );

  const createPkPegawaiProgramDetail = useCreatePkPegawaiProgramDetail(
    pkId,
    pkPegawaiId,
    pkPegawaiProgramId,
  );
  const updatePkPegawaiProgramDetail = useUpdatePkPegawaiProgramDetail(
    pkId,
    pkPegawaiId,
    pkPegawaiProgramId,
  );
  console.log(pkPegawaiProgramDetail);
  const form = useAppForm({
    defaultValues: {
      programId:
        pkPegawaiProgramDetail?.subKegiatan.refKegiatan.refProgramId.toString() ??
        '',
      kegiatanId:
        pkPegawaiProgramDetail?.subKegiatan.refKegiatanId.toString() ?? '',
      subKegiatanId: initialData?.subKegiatanId.toString() ?? '',
      anggaran: initialData?.anggaran?.toString() ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          updatePkPegawaiProgramDetail.mutateAsync({
            id: initialData.id,
            anggaran: payload.anggaran,
          });
        } else {
          createPkPegawaiProgramDetail.mutateAsync({
            subKegiatanId: payload.subKegiatanId,
            anggaran: payload.anggaran,
          });
        }
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const refProgramId = useStore(form.store, (state) => state.values.programId);
  const refKegiatanId = useStore(
    form.store,
    (state) => state.values.kegiatanId,
  );
  const { data: programList = [] } = useGetAllRefProgram();
  const { data: kegiatanList = [] } = useGetAllRefKegiatan(
    Number(refProgramId),
  );
  const { data: subKegiatanList = [] } = useGetAllRefSubKegiatan(
    Number(refKegiatanId),
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="flex flex-col gap-y-4">
        <form.AppField name="programId">
          {(field) => (
            <field.SelectField
              label="Program"
              placeholder="Pilih program..."
              options={programList.map((program) => ({
                label: program.nama,
                value: program.id.toString(),
              }))}
              disabled={initialData ? true : false}
              className="max-w-full whitespace-normal break-words"
            />
          )}
        </form.AppField>
        <form.AppField name="kegiatanId">
          {(field) => (
            <field.SelectField
              label="Kegiatan"
              placeholder="Pilih kegiatan..."
              options={kegiatanList.map((kegiatan) => ({
                label: kegiatan.nama,
                value: kegiatan.id.toString(),
              }))}
              disabled={initialData ? true : false}
            />
          )}
        </form.AppField>
        <form.AppField name="subKegiatanId">
          {(field) => (
            <field.SelectField
              label="Sub-kegiatan"
              placeholder="Pilih sub-kegiatan..."
              options={subKegiatanList.map((subKegiatan) => ({
                label: subKegiatan.nama,
                value: subKegiatan.id.toString(),
              }))}
              disabled={initialData ? true : false}
            />
          )}
        </form.AppField>
        <div className="flex gap-x-2">
          <p className="mt-[25px] text-sm">Rp.</p>
          <div className="w-full">
            <form.AppField name="anggaran">
              {(field) => <field.TextField label="Anggaran" />}
            </form.AppField>
          </div>
        </div>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Submit</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default PerjanjianKinerjaProgramForm;
