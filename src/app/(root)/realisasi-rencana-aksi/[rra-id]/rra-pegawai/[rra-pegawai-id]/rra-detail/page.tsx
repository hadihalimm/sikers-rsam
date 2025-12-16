import RealisasiRencanaAksiDetailTable from './table';
import { and, eq } from 'drizzle-orm';
import { realisasiRencanaAksi, realisasiRencanaAksiPegawai } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/db';
import BackButton from '@/components/back-button';

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
    where: and(eq(realisasiRencanaAksi.id, parseInt(rraId))),
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
      <div className="flex gap-x-2 items-start">
        <BackButton />
        <div>
          <h1 className="font-semibold text-foreground text-3xl">
            {rraRecord?.nama}
          </h1>
          <p>Tahun {rraRecord?.tahun}</p>
        </div>
      </div>
      <div className="text-sm">
        <h2>{rraPegawaiRecord?.pegawai.nama}</h2>
        {rraPegawaiRecord?.pegawai.nip && (
          <p>NIP: {rraPegawaiRecord?.pegawai.nip}</p>
        )}
        {rraPegawaiRecord?.pegawai.jabatan && (
          <p>Jabatan: {rraPegawaiRecord?.pegawai.jabatan}</p>
        )}
        {rraPegawaiRecord?.pegawai.profesi && (
          <p>Profesi: {rraPegawaiRecord?.pegawai.profesi}</p>
        )}
        {rraPegawaiRecord?.pegawai.penempatan && (
          <p>Penempatan: {rraPegawaiRecord?.pegawai.penempatan}</p>
        )}
      </div>
      <RealisasiRencanaAksiDetailTable />
    </section>
  );
};

export default RealisasiRencanaAksiDetail;
