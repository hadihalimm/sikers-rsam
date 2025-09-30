'use client';

import { useGetCascading } from '@/hooks/query/cascading/cascading';
import { useParams } from 'next/navigation';
import TujuanTable from './table';
import BackButton from '@/components/back-button';

const CascadingPage = () => {
  const params = useParams();
  const { data } = useGetCascading(Number(params['cascading-id']));
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-center">
        <BackButton />
        <h1 className="font-semibold text-foreground text-3xl">
          Daftar Tujuan
        </h1>
      </div>
      <div>
        <p className="font-medium text-xl">{data?.judul}</p>
        <p className="text-sm">
          Tahun {data?.tahunMulai} - {data?.tahunBerakhir}
        </p>
      </div>
      <TujuanTable />
    </section>
  );
};

export default CascadingPage;
