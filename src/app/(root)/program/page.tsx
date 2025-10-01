import ProgramTable from './table';

const ProgramPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Daftar Program</h1>
      <ProgramTable />
    </section>
  );
};

export default ProgramPage;
