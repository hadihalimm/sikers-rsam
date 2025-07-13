import CascadingTable from './table';

const CascadingPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Data Cascading</h1>
      <CascadingTable />
    </section>
  );
};

export default CascadingPage;
