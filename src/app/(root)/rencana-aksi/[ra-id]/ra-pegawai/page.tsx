import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import RencanaAksiPegawaiTable from './table';
import db from '@/db';
import { and, eq } from 'drizzle-orm';
import { rencanaAksi } from '@/db/schema';
import { redirect } from 'next/navigation';

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
    where: and(
      eq(rencanaAksi.id, parseInt(raId)),
      eq(rencanaAksi.userId, session.user.id),
    ),
  });
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Rencana Aksi</h1>
      <div>
        <h2>{data?.nama}</h2>
        <p>Bagian {session?.user.name}</p>
        <p>Tahun {data?.tahun}</p>
      </div>
      <RencanaAksiPegawaiTable />
    </section>
  );
};

export default RencanaAksiPegawaiPage;
