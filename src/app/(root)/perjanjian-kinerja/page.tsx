import PerjanjianKinerjaTable from './table';

const PerjanjianKinerjaPage = async () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Daftar Perjanjian Kinerja
      </h1>
      <PerjanjianKinerjaTable />
    </section>
  );
};

export default PerjanjianKinerjaPage;
