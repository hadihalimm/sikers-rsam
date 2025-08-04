'use client';

import { useGetIndikatorKinerjaUtama } from '@/hooks/query/indikator-kinerja-utama/indikator-kinerja-utama';
import IndikatorKinerjaUtamaDetailTable from './table';
import { useParams } from 'next/navigation';

const IndikatorKinerjaUtamaDetailPage = () => {
  const params = useParams();
  const { data: iku } = useGetIndikatorKinerjaUtama(
    Number(params['indikator-kinerja-utama-id']),
  );
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Detail Indikator Kinerja Utama
      </h1>
      <h2>{iku?.nama}</h2>
      <IndikatorKinerjaUtamaDetailTable />
    </section>
  );
};

export default IndikatorKinerjaUtamaDetailPage;
