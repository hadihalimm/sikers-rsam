'use client';

import { useGetTujuan } from '@/hooks/query/cascading/tujuan';
import { useParams, useRouter } from 'next/navigation';
import SasaranTable from './sasaran-table';
import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';

const SasaranPage = () => {
  const params = useParams();
  const router = useRouter();
  const tujuanId = Number(params['tujuan-id']);
  const cascadingId = Number(params['cascading-id']);

  const { data: tujuan } = useGetTujuan(tujuanId, cascadingId);

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <MoveLeft />
        </Button>
        <p className="font-semibold text-foreground text-3xl">Daftar Sasaran</p>
      </div>
      <p>
        Tujuan: <span className="font-medium text-lg">{tujuan?.judul}</span>
      </p>
      <SasaranTable tujuanId={tujuanId} cascadingId={cascadingId} />
    </section>
  );
};

export default SasaranPage;
