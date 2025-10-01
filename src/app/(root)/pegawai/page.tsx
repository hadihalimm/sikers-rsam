import PegawaiTable from './table';

const PegawaiPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Daftar Pegawai</h1>
      <PegawaiTable />
    </section>
  );
};

export default PegawaiPage;
