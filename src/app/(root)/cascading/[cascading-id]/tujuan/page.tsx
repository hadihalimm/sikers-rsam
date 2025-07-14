'use client';

import { useGetCascading } from '@/hooks/query/cascading';
import { useParams } from 'next/navigation';
import TujuanTable from './table';

const CascadingPage = () => {
  const params = useParams();
  const { data } = useGetCascading(Number(params['cascading-id']));
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex flex-col gap-y-1">
        <h1 className="font-semibold text-foreground text-3xl">
          {data?.judul}
        </h1>
        <p>
          Tahun {data?.tahunMulai} - {data?.tahunBerakhir}
        </p>
      </div>
      <TujuanTable />
    </section>
  );
};

export default CascadingPage;
