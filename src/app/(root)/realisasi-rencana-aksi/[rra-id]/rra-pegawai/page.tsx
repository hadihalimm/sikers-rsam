import { auth } from '@/lib/auth';
import { RealisasiRencanaAksi } from '@/types/database';
import axios from 'axios';
import { headers } from 'next/headers';
import RealisasiRencanaAksiPegawaiTable from './table';

const RealisasiRencanaAksiPegawaiPage = async ({
  params,
}: {
  params: Promise<{ 'rra-id': string }>;
}) => {
  const { 'rra-id': rraId } = await params;
  const { data: realisasiRencanaAksi } = await axios.get<RealisasiRencanaAksi>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/realisasi-rencana-aksi/${rraId}`,
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Realisasi Rencana Aksi
      </h1>
      <div>
        <h2>{realisasiRencanaAksi.nama}</h2>
        <p>Bagian {session?.user.name}</p>
        <p>Tahun {realisasiRencanaAksi.tahun}</p>
      </div>
      <RealisasiRencanaAksiPegawaiTable />
    </section>
  );
};

export default RealisasiRencanaAksiPegawaiPage;
