import db from '@/db';
import RenstraDetailTable from './table';
import { eq } from 'drizzle-orm';
import { renstra } from '@/db/schema';
import BackButton from '@/components/back-button';

const RenstraDetailPage = async ({
  params,
}: {
  params: Promise<{ 'renstra-id': string }>;
}) => {
  const { 'renstra-id': renstraId } = await params;
  const data = await db.query.renstra.findFirst({
    where: eq(renstra.id, parseInt(renstraId)),
  });
  return (
    <section className="flex flex-col gap-y-8 w-fit">
      <div className="flex gap-x-2 items-center">
        <BackButton />
        <h1 className="font-semibold text-foreground text-3xl">
          Detail Renstra
        </h1>
      </div>
      <div>
        <h2>{data?.judul}</h2>
      </div>
      <RenstraDetailTable />
    </section>
  );
};

export default RenstraDetailPage;
