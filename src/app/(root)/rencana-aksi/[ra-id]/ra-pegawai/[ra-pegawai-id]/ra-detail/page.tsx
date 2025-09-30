import RencanaAksiPegawaiDetailTable from './table';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import db from '@/db';
import { rencanaAksi, rencanaAksiPegawai } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import BackButton from '@/components/back-button';

const RencanaAksiPegawaiDetailPage = async ({
  params,
}: {
  params: Promise<{ 'ra-id': string; 'ra-pegawai-id': string }>;
}) => {
  const { 'ra-id': raId, 'ra-pegawai-id': raPegawaiId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/sign-in');

  const rencanaAksiRecord = await db.query.rencanaAksi.findFirst({
    where: and(eq(rencanaAksi.id, parseInt(raId))),
  });

  const raPegawaiRecord = await db.query.rencanaAksiPegawai.findFirst({
    where: eq(rencanaAksiPegawai.id, parseInt(raPegawaiId)),
    with: {
      pegawai: true,
    },
  });

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-start">
        <BackButton />
        <div>
          <h1 className="font-semibold text-foreground text-3xl">
            {rencanaAksiRecord?.nama}
          </h1>
          <p>Tahun {rencanaAksiRecord?.tahun}</p>
        </div>
      </div>
      <div>
        <h2>{raPegawaiRecord?.pegawai.nama}</h2>
        <p>{raPegawaiRecord?.pegawai.jabatan}</p>
      </div>
      <RencanaAksiPegawaiDetailTable />
    </section>
  );
};

export default RencanaAksiPegawaiDetailPage;
