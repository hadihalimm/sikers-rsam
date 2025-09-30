import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import RencanaAksiPegawaiTable from './table';
import db from '@/db';
import { and, eq } from 'drizzle-orm';
import { rencanaAksi } from '@/db/schema';
import { redirect } from 'next/navigation';
import BackButton from '@/components/back-button';

const RencanaAksiPegawaiPage = async ({
  params,
}: {
  params: Promise<{ 'ra-id': string }>;
}) => {
  const { 'ra-id': raId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/sign-in');
  const data = await db.query.rencanaAksi.findFirst({
    where: and(eq(rencanaAksi.id, parseInt(raId))),
    with: {
      user: true,
    },
  });
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-center">
        <BackButton />
        <h1 className="font-semibold text-foreground text-3xl">Rencana Aksi</h1>
      </div>
      <div>
        <h2>{data?.nama}</h2>
        <p>Bagian {data?.user.name}</p>
        <p>Tahun {data?.tahun}</p>
      </div>
      <RencanaAksiPegawaiTable />
    </section>
  );
};

export default RencanaAksiPegawaiPage;
