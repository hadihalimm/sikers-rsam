import { RencanaAksi, RencanaAksiPegawai } from '@/types/database';
import axios from 'axios';
import RencanaAksiPegawaiDetailTable from './table';

const RencanaAksiPegawaiDetailPage = async ({
  params,
}: {
  params: Promise<{ 'ra-id': string; 'ra-pegawai-id': string }>;
}) => {
  const { 'ra-id': raId, 'ra-pegawai-id': raPegawaiId } = await params;
  const { data: rencanaAksi } = await axios.get<RencanaAksi>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/rencana-aksi/${raId}`,
  );
  const { data: raPegawai } = await axios.get<RencanaAksiPegawai>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/rencana-aksi/${raId}/ra-pegawai/${raPegawaiId}`,
  );

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div>
        <h1 className="font-semibold text-foreground text-3xl">
          {rencanaAksi.nama}
        </h1>
        <p>Tahun {rencanaAksi.tahun}</p>
      </div>
      <div>
        <h2>{raPegawai.pegawai.nama}</h2>
        <p>{raPegawai.pegawai.jabatan}</p>
      </div>
      <RencanaAksiPegawaiDetailTable />
    </section>
  );
};

export default RencanaAksiPegawaiDetailPage;
