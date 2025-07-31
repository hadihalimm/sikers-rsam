import IndikatorKinerjaUtamaTable from './table';

const IndikatorKinerjaUtamaPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Daftar Indikator Kinerja Utama
      </h1>
      <IndikatorKinerjaUtamaTable />
    </section>
  );
};

export default IndikatorKinerjaUtamaPage;
