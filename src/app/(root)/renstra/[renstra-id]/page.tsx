import RenstraDetailTable from './table';

const RenstraDetailPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Detail Renstra</h1>
      <RenstraDetailTable />
    </section>
  );
};

export default RenstraDetailPage;
