import DokumenEvaluasiTable from './table';

const DokumenEvaluasiPage = () => {
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <h1 className="font-semibold text-foreground text-3xl">
        Dokumen Evaluasi
      </h1>
      <DokumenEvaluasiTable />
    </section>
  );
};

export default DokumenEvaluasiPage;
