import RealisasiRencanaAksiTable from './table';

export default function RealisasiRencanaAksiPage() {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Daftar Realisasi Rencana Aksi
      </h1>
      <RealisasiRencanaAksiTable />
    </section>
  );
}
