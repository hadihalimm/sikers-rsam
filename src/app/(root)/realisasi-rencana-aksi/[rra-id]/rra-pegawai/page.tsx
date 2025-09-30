import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import RealisasiRencanaAksiPegawaiTable from './table';
import db from '@/db';
import { and, eq } from 'drizzle-orm';
import { realisasiRencanaAksi } from '@/db/schema';
import { redirect } from 'next/navigation';
import BackButton from '@/components/back-button';

const RealisasiRencanaAksiPegawaiPage = async ({
  params,
}: {
  params: Promise<{ 'rra-id': string }>;
}) => {
  const { 'rra-id': rraId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/sign-in');

  const rraRecord = await db.query.realisasiRencanaAksi.findFirst({
    where: and(eq(realisasiRencanaAksi.id, parseInt(rraId))),
    with: {
      user: true,
    },
  });

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-center">
        <BackButton />
        <h1 className="font-semibold text-foreground text-3xl">
          Realisasi Rencana Aksi
        </h1>
      </div>
      <div>
        <h2>{rraRecord?.nama}</h2>
        <p>Bagian {rraRecord?.user.name}</p>
        <p>Tahun {rraRecord?.tahun}</p>
      </div>
      <RealisasiRencanaAksiPegawaiTable />
    </section>
  );
};

export default RealisasiRencanaAksiPegawaiPage;
