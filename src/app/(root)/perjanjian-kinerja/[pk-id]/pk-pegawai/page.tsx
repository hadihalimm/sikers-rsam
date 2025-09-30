import BackButton from '@/components/back-button';
import PerjanjianKinerjaPegawaiTable from './table';
import db from '@/db';
import { perjanjianKinerja } from '@/db/schema';
import { eq } from 'drizzle-orm';

const PerjanjianKinerjaPegawaiPage = async ({
  params,
}: {
  params: Promise<{ 'pk-id': string }>;
}) => {
  const { 'pk-id': pkId } = await params;
  const perjanjianKinerjaRecord = await db.query.perjanjianKinerja.findFirst({
    where: eq(perjanjianKinerja.id, parseInt(pkId)),
    with: {
      user: true,
    },
  });
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-center">
        <BackButton />
        <h1 className="font-semibold text-foreground text-3xl">
          Perjanjian Kinerja
        </h1>
      </div>
      <div>
        <h2>{perjanjianKinerjaRecord?.nama}</h2>
        <p>Bagian {perjanjianKinerjaRecord?.user.name}</p>
        <p>Tahun {perjanjianKinerjaRecord?.tahun}</p>
      </div>
      <PerjanjianKinerjaPegawaiTable
        perjanjianKinerja={perjanjianKinerjaRecord!}
      />
    </section>
  );
};

export default PerjanjianKinerjaPegawaiPage;
