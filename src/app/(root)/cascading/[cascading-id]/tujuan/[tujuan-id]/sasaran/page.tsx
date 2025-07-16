'use client';

import { useGetTujuan } from '@/hooks/query/tujuan';
import { useParams } from 'next/navigation';
import SasaranTable from './sasaran-table';

const SasaranPage = () => {
  const params = useParams();
  const tujuanId = Number(params['tujuan-id']);
  const cascadingId = Number(params['cascading-id']);

  const { data: tujuan } = useGetTujuan(tujuanId, cascadingId);

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex flex-col gap-y-2">
        <h1 className="font-semibold text-foreground text-3xl">
          Daftar Sasaran
        </h1>
        <p className="font-medium">Tujuan: {tujuan?.judul}</p>
      </div>
      <SasaranTable tujuanId={tujuanId} cascadingId={cascadingId} />
    </section>
  );
};

export default SasaranPage;
