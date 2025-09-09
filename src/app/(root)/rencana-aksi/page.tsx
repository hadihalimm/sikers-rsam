import RencanaAksiTable from './table';

const RencanaAksiPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Daftar Rencana Aksi
      </h1>
      <RencanaAksiTable />
    </section>
  );
};

export default RencanaAksiPage;
