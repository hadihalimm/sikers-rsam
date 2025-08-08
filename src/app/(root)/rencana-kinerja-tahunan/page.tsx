import RencanaKinerjaTahunanTable from './table';

const RencanaKinerjaTahunanPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Daftar Rencana Kinerja Tahunan
      </h1>
      <RencanaKinerjaTahunanTable />
    </section>
  );
};

export default RencanaKinerjaTahunanPage;
