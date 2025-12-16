import PerjanjianKinerjaSasaranTable from './sasaran-table';
import PerjanjianKinerjaProgramTable from './program-table';
import db from '@/db';
import { perjanjianKinerja, perjanjianKinerjaPegawai } from '@/db/schema';
import { eq } from 'drizzle-orm';
import BackButton from '@/components/back-button';

const PerjanjianKinerjaDetail = async ({
  params,
}: {
  params: Promise<{ 'pk-id': string; 'pk-pegawai-id': string }>;
}) => {
  const { 'pk-id': pkId, 'pk-pegawai-id': pkPegawaiId } = await params;
  const perjanjianKinerjaRecord = await db.query.perjanjianKinerja.findFirst({
    where: eq(perjanjianKinerja.id, parseInt(pkId)),
    with: {
      user: true,
    },
  });
  const pkPegawaiRecord = await db.query.perjanjianKinerjaPegawai.findFirst({
    where: eq(perjanjianKinerjaPegawai.id, parseInt(pkPegawaiId)),
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
            {perjanjianKinerjaRecord?.nama}
          </h1>
          <p>Tahun {perjanjianKinerjaRecord?.tahun}</p>
        </div>
      </div>
      <div className="text-sm">
        <h2>{pkPegawaiRecord?.pegawai.nama}</h2>
        {pkPegawaiRecord?.pegawai.nip && (
          <p>NIP: {pkPegawaiRecord?.pegawai.nip}</p>
        )}
        {pkPegawaiRecord?.pegawai.jabatan && (
          <p>Jabatan: {pkPegawaiRecord?.pegawai.jabatan}</p>
        )}
        {pkPegawaiRecord?.pegawai.profesi && (
          <p>Profesi: {pkPegawaiRecord?.pegawai.profesi}</p>
        )}
        {pkPegawaiRecord?.pegawai.penempatan && (
          <p>Penempatan: {pkPegawaiRecord?.pegawai.penempatan}</p>
        )}
      </div>
      <PerjanjianKinerjaSasaranTable />
      <PerjanjianKinerjaProgramTable />
    </section>
  );
};

export default PerjanjianKinerjaDetail;
