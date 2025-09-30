'use client';
import { useGetIkuDetail } from '@/hooks/query/indikator-kinerja-utama/iku-detail';
import { useParams } from 'next/navigation';
import IkuDetailUpdateForm from './form';
import BackButton from '@/components/back-button';

const IkuDetailEditPage = () => {
  const params = useParams();
  const { data } = useGetIkuDetail(
    Number(params['indikator-kinerja-utama-id']),
    Number(params['iku-detail-id']),
  );

  if (!data) return null;
  return (
    <section className="flex flex-col gap-y-8">
      <div className="flex gap-x-2 items-center">
        <BackButton />
        <h1 className="font-semibold text-foreground text-3xl">
          Edit Detail IKU
        </h1>
      </div>
      <IkuDetailUpdateForm
        data={data}
        indikatorKinerjaUtamaId={Number(params['indikator-kinerja-utama-id'])}
        ikuDetailId={Number(params['iku-detail-id'])}
        onSuccess={() => {
          window.location.href = `/indikator-kinerja-utama/${Number(
            params['indikator-kinerja-utama-id'],
          )}/iku-detail`;
        }}
      />
    </section>
  );
};

export default IkuDetailEditPage;
