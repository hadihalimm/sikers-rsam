import { auth } from '@/lib/auth';
import PerjanjianKinerjaPegawaiTable from './table';
import { PerjanjianKinerja } from '@/types/database';
import axios from 'axios';
import { headers } from 'next/headers';

const PerjanjianKinerjaPegawaiPage = async ({
  params,
}: {
  params: Promise<{ 'pk-id': string }>;
}) => {
  const { 'pk-id': pkId } = await params;
  const { data: perjanjianKinerja } = await axios.get<PerjanjianKinerja>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/perjanjian-kinerja/${pkId}`,
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Perjanjian Kinerja
      </h1>
      <div>
        <h2>{perjanjianKinerja.nama}</h2>
        <p>Bagian {session?.user.name}</p>
        <p>Tahun {perjanjianKinerja.tahun}</p>
      </div>
      <PerjanjianKinerjaPegawaiTable perjanjianKinerja={perjanjianKinerja} />
    </section>
  );
};

export default PerjanjianKinerjaPegawaiPage;
