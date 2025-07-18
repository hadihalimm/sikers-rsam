'use client';

import { useGetCascading } from '@/hooks/query/cascading/cascading';
import { useParams, useRouter } from 'next/navigation';
import TujuanTable from './table';
import { MoveLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CascadingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data } = useGetCascading(Number(params['cascading-id']));
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <MoveLeft />
        </Button>
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
