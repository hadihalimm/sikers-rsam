import RenstraTable from './table';

const RenstraPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Daftar Renstra</h1>
      <RenstraTable />
    </section>
  );
};

export default RenstraPage;
