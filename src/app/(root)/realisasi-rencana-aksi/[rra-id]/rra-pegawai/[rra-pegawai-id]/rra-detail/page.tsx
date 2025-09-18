import RealisasiRencanaAksiDetailTable from './table';
import { and, eq } from 'drizzle-orm';
import { realisasiRencanaAksi, realisasiRencanaAksiPegawai } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/db';

const RealisasiRencanaAksiDetail = async ({
  params,
}: {
  params: Promise<{ 'rra-id': string; 'rra-pegawai-id': string }>;
}) => {
  const { 'rra-id': rraId, 'rra-pegawai-id': rraPegawaiId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/sign-in');

  const rraRecord = await db.query.realisasiRencanaAksi.findFirst({
    where: and(
      eq(realisasiRencanaAksi.id, parseInt(rraId)),
      eq(realisasiRencanaAksi.userId, session.user.id),
    ),
  });
  const rraPegawaiRecord = await db.query.realisasiRencanaAksiPegawai.findFirst(
    {
      where: eq(realisasiRencanaAksiPegawai.id, parseInt(rraPegawaiId)),
      with: {
        pegawai: true,
      },
    },
  );

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div>
        <h1 className="font-semibold text-foreground text-3xl">
          {rraRecord?.nama}
        </h1>
        <p>Tahun {rraRecord?.tahun}</p>
      </div>
      <div>
        <h2>{rraPegawaiRecord?.pegawai.nama}</h2>
        <p>{rraPegawaiRecord?.pegawai.jabatan}</p>
      </div>
      <RealisasiRencanaAksiDetailTable />
    </section>
  );
};

export default RealisasiRencanaAksiDetail;
