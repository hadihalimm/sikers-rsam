import PerjanjianKinerjaSasaranTable from './sasaran-table';
import PerjanjianKinerjaProgramTable from './program-table';
import db from '@/db';
import { perjanjianKinerja, perjanjianKinerjaPegawai } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
      <div>
        <h1 className="font-semibold text-foreground text-3xl">
          {perjanjianKinerjaRecord?.nama}
        </h1>
        <p>Tahun {perjanjianKinerjaRecord?.tahun}</p>
      </div>
      <div>
        <h2>{pkPegawaiRecord?.pegawai.nama}</h2>
        <p>{pkPegawaiRecord?.pegawai.jabatan}</p>
      </div>
      <PerjanjianKinerjaSasaranTable />
      <PerjanjianKinerjaProgramTable />
    </section>
  );
};

export default PerjanjianKinerjaDetail;
