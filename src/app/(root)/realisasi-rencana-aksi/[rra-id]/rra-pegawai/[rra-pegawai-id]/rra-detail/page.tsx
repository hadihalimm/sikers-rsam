import {
  RealisasiRencanaAksi,
  RealisasiRencanaAksiPegawai,
} from '@/types/database';
import axios from 'axios';
import RealisasiRencanaAksiDetailTable from './table';

const RealisasiRencanaAksiDetail = async ({
  params,
}: {
  params: Promise<{ 'rra-id': string; 'rra-pegawai-id': string }>;
}) => {
  const { 'rra-id': rraId, 'rra-pegawai-id': rraPegawaiId } = await params;
  const { data: rra } = await axios.get<RealisasiRencanaAksi>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/realisasi-rencana-aksi/${rraId}`,
  );
  const { data: rraPegawai } = await axios.get<RealisasiRencanaAksiPegawai>(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/realisasi-rencana-aksi/${rraId}/rra-pegawai/${rraPegawaiId}`,
  );

  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div>
        <h1 className="font-semibold text-foreground text-3xl">{rra.nama}</h1>
        <p>Tahun {rra.tahun}</p>
      </div>
      <div>
        <h2>{rraPegawai.pegawai.nama}</h2>
        <p>{rraPegawai.pegawai.jabatan}</p>
      </div>
      <RealisasiRencanaAksiDetailTable />
    </section>
  );
};

export default RealisasiRencanaAksiDetail;
