'use client';

import { useGetRencanaKinerjaTahunan } from '@/hooks/query/rencana-kinerja-tahunan/rencana-kinerja-tahunan';
import { useParams } from 'next/navigation';
import RencanaKinerjaTahunanDetailTable from './table';

const RencanaKinerjaTahunanDetailPage = () => {
  const params = useParams();
  const { data: rkt } = useGetRencanaKinerjaTahunan(
    Number(params['rencana-kinerja-tahunan-id']),
  );
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Detail Rencana Kinerja Tahunan
      </h1>
      <h2>{rkt?.nama}</h2>
      <RencanaKinerjaTahunanDetailTable />
    </section>
  );
};

export default RencanaKinerjaTahunanDetailPage;
