import { Pegawai, PerjanjianKinerja } from '@/types/database';
import axios from 'axios';
import PerjanjianKinerjaSasaranTable from './sasaran-table';
import PerjanjianKinerjaProgramTable from './program-table';

const PerjanjianKinerjaDetail = async ({
  params,
}: {
  params: Promise<{ 'pk-id': string; 'pk-pegawai-id': string }>;
}) => {
  const { 'pk-id': pkId, 'pk-pegawai-id': pkPegawaiId } = await params;
  const { data: perjanjianKinerja } = await axios.get<PerjanjianKinerja>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/perjanjian-kinerja/${pkId}`,
  );
  const { data: pegawai } = await axios.get<Pegawai>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/pegawai/${pkPegawaiId}`,
  );

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div>
        <h1 className="font-semibold text-foreground text-3xl">
          {perjanjianKinerja.nama}
        </h1>
        <p>Tahun {perjanjianKinerja.tahun}</p>
      </div>
      <div>
        <h2>{pegawai.nama}</h2>
        <p>{pegawai.jabatan}</p>
      </div>
      <PerjanjianKinerjaSasaranTable />
      <PerjanjianKinerjaProgramTable />
    </section>
  );
};

export default PerjanjianKinerjaDetail;
