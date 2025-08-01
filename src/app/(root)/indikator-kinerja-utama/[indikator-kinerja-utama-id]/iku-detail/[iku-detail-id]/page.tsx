'use client';
import TipTapTextEditor from '@/components/tiptap/tiptap';
import { useGetIkuDetail } from '@/hooks/query/indikator-kinerja-utama/iku-detail';
import { useParams } from 'next/navigation';

const IkuDetailEditPage = () => {
  const params = useParams();
  const { data } = useGetIkuDetail(
    Number(params['indikator-kinerja-utama-id']),
    Number(params['iku-detail-id']),
  );
  if (!data) return null;
  return (
    <section className="flex flex-col gap-y-8">
      <h1 className="font-semibold text-foreground text-3xl">
        Edit Detail IKU
      </h1>

      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-8 justify-between">
          <div className="flex flex-col gap-y-1 w-full">
            <h2>Baseline</h2>
            <TipTapTextEditor
              content={data.baseline ?? { type: 'doc', content: [] }}
              onChange={(content) => console.log(content)}
            />
          </div>
          <div className="flex flex-col gap-y-1 w-full">
            <h2>Penanggung jawab</h2>
            <TipTapTextEditor
              content={data.penanggungJawab ?? { type: 'doc', content: [] }}
              onChange={(content) => console.log(content)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <h2>Penjelasan</h2>
          <TipTapTextEditor
            content={data.penjelasan ?? { type: 'doc', content: [] }}
            onChange={(content) => console.log(content)}
          />
        </div>
      </div>
    </section>
  );
};

export default IkuDetailEditPage;
