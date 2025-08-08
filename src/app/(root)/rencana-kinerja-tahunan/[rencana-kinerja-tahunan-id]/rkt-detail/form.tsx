'use client';

import { useAppForm } from '@/components/form';
import { useGetAllIndikatorSasaran } from '@/hooks/query/cascading/indikator-sasaran';
import { useGetAllSasaran } from '@/hooks/query/cascading/sasaran';
import { useGetAllTujuan } from '@/hooks/query/cascading/tujuan';
import { useGetRencanaKinerjaTahunan } from '@/hooks/query/rencana-kinerja-tahunan/rencana-kinerja-tahunan';
import {
  useCreateRencanaKinerjaTahunanDetail,
  useUpdateRencanaKinerjaTahunanDetail,
} from '@/hooks/query/rencana-kinerja-tahunan/rencana-kinerja-tahunan-detail';
import { RencanaKinerjaTahunanDetail } from '@/types/database';
import { useStore } from '@tanstack/react-form';
import { useParams } from 'next/navigation';
import z from 'zod';

interface RencanaKinerjaTahunanDetailFormProps {
  initialData?: RencanaKinerjaTahunanDetail;
  onSuccess: () => void;
}

const formSchema = z.object({
  target: z.string().min(1, { message: 'Target tidak boleh kosong' }),
  tujuanId: z
    .string()
    .min(1, { message: 'Silahkan pilih tujuan' })
    .transform((val) => Number(val)),
  sasaranId: z
    .string()
    .min(1, { message: 'Silahkan pilih sasaran' })
    .transform((val) => Number(val)),
  indikatorSasaranId: z
    .string()
    .min(1, { message: 'Silahkan pilih Indikator sasaran' })
    .transform((val) => Number(val)),
});

const RencanaKinerjaTahunanDetailForm = ({
  initialData,
  onSuccess,
}: RencanaKinerjaTahunanDetailFormProps) => {
  const params = useParams();
  const { data: rkt } = useGetRencanaKinerjaTahunan(
    Number(params['rencana-kinerja-tahunan-id']),
  );
  const createRencanaKinerjaTahunanDetail =
    useCreateRencanaKinerjaTahunanDetail(rkt?.id);
  const updateRencanaKinerjaTahunanDetail =
    useUpdateRencanaKinerjaTahunanDetail(rkt?.id);

  const form = useAppForm({
    defaultValues: {
      target: initialData?.target ?? '',
      tujuanId: '',
      sasaranId: '',
      indikatorSasaranId: initialData?.indikatorSasaranId ?? '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = formSchema.parse(value);
        if (initialData) {
          await updateRencanaKinerjaTahunanDetail.mutateAsync({
            id: initialData.id,
            target: payload.target,
          });
        } else {
          await createRencanaKinerjaTahunanDetail.mutateAsync({
            target: payload.target,
            indikatorSasaranId: payload.indikatorSasaranId,
          });
        }
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });
  const tujuanId = useStore(form.store, (state) => state.values.tujuanId);
  const sasaranId = useStore(form.store, (state) => state.values.sasaranId);

  const { data: tujuanList = [] } = useGetAllTujuan(rkt?.cascadingId || 0);
  const { data: sasaranList = [] } = useGetAllSasaran(
    Number(tujuanId),
    rkt?.cascadingId || 0,
  );
  const { data: indikatorSasaranList = [] } = useGetAllIndikatorSasaran(
    Number(sasaranId),
    Number(tujuanId),
    rkt?.cascadingId || 0,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="flex flex-col gap-y-4">
        {!initialData && (
          <>
            <form.AppField name="tujuanId">
              {(field) => (
                <field.SelectField
                  label="Tujuan"
                  placeholder="Pilih Tujuan..."
                  disabled={initialData ? true : false}
                  options={tujuanList.map((item) => ({
                    label: item.judul,
                    value: String(item.id),
                  }))}
                  className="max-w-full whitespace-normal break-words"
                  onValueChange={() => {
                    form.setFieldValue('sasaranId', '');
                    form.setFieldValue('indikatorSasaranId', '');
                  }}
                />
              )}
            </form.AppField>
            <form.AppField name="sasaranId">
              {(field) => (
                <field.SelectField
                  label="Sasaran"
                  placeholder="Pilih Sasaran..."
                  disabled={initialData ? true : false}
                  options={sasaranList.map((item) => ({
                    label: item.judul,
                    value: String(item.id),
                  }))}
                  className="max-w-full whitespace-normal break-words"
                  onValueChange={() => {
                    form.setFieldValue('indikatorSasaranId', '');
                  }}
                />
              )}
            </form.AppField>
            <form.AppField name="indikatorSasaranId">
              {(field) => (
                <field.SelectField
                  label="Indikator Sasaran"
                  placeholder="Pilih Indikator Sasaran..."
                  disabled={initialData ? true : false}
                  options={indikatorSasaranList.map((item) => ({
                    label: item.nama,
                    value: String(item.id),
                  }))}
                  className="max-w-full whitespace-normal break-words"
                />
              )}
            </form.AppField>
          </>
        )}
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

export default RencanaKinerjaTahunanDetailForm;
