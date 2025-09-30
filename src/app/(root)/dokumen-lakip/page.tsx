import DokumenLakipTable from './table';

const DokumenLakipPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">Dokumen LAKIP</h1>
      <DokumenLakipTable />
    </section>
  );
};

export default DokumenLakipPage;
