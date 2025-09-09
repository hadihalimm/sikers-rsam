import { auth } from '@/lib/auth';
import { RencanaAksi } from '@/types/database';
import axios from 'axios';
import { headers } from 'next/headers';
import RencanaAksiPegawaiTable from './table';

const RencanaAksiPegawaiPage = async ({
  params,
}: {
  params: Promise<{ 'ra-id': string }>;
}) => {
  const { 'ra-id': raId } = await params;
  const { data: rencanaAksi } = await axios.get<RencanaAksi>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/rencana-aksi/${raId}`,
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Rencana Aksi</h1>
      <div>
        <h2>{rencanaAksi.nama}</h2>
        <p>Bagian {session?.user.name}</p>
        <p>Tahun {rencanaAksi.tahun}</p>
      </div>
      <RencanaAksiPegawaiTable />
    </section>
  );
};

export default RencanaAksiPegawaiPage;
