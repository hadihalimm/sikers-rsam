import IndikatorKinerjaUtamaDetailTable from './table';

const IndikatorKinerjaUtamaDetailPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Detail IKU</h1>
      <IndikatorKinerjaUtamaDetailTable />
    </section>
  );
};

export default IndikatorKinerjaUtamaDetailPage;
