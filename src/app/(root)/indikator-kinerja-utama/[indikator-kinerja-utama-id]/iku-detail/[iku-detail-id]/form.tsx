'use client';

import TipTapTextEditor from '@/components/tiptap/tiptap';
import { Button } from '@/components/ui/button';
import { useUpdateIkuDetail } from '@/hooks/query/indikator-kinerja-utama/iku-detail';
import { IndikatorKinerjaUtamaDetail } from '@/types/database';
import { useForm } from '@tanstack/react-form';
import { JSONContent } from '@tiptap/react';
import { createHash } from 'crypto';
import { Save } from 'lucide-react';

interface IkuDetailUpdateFormProps {
  data: IndikatorKinerjaUtamaDetail;
  indikatorKinerjaUtamaId: number;
  ikuDetailId: number;
  onSuccess: () => void;
}

export const getEditorKey = (content: JSONContent) => {
  const json = JSON.stringify(content);
  const hash = createHash('sha256').update(json).digest('hex');
  return `editor-${hash.slice(0, 8)}`; // First 8 chars are enough for uniqueness
};

const IkuDetailUpdateForm = ({
  data,
  indikatorKinerjaUtamaId,
  ikuDetailId,
  onSuccess,
}: IkuDetailUpdateFormProps) => {
  const updateIkuDetail = useUpdateIkuDetail(indikatorKinerjaUtamaId);
  const form = useForm({
    defaultValues: {
      baseline: data?.baseline ?? ({ type: 'doc', content: [] } as JSONContent),
      penanggungJawab:
        data?.penanggungJawab ?? ({ type: 'doc', content: [] } as JSONContent),
      penjelasan:
        data?.penjelasan ?? ({ type: 'doc', content: [] } as JSONContent),
    },
    onSubmit: ({ value }) => {
      try {
        updateIkuDetail.mutateAsync({
          id: ikuDetailId,
          baseline: value.baseline,
          penanggungJawab: value.penanggungJawab,
          penjelasan: value.penjelasan,
        });
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-8 justify-between">
          <div className="flex flex-col gap-y-1 w-full">
            <h2>Baseline</h2>
            <form.Field name="baseline">
              {(field) => (
                <TipTapTextEditor
                  content={field.state.value}
                  onChange={(content) => field.handleChange(content)}
                />
              )}
            </form.Field>
          </div>
          <div className="flex flex-col gap-y-1 w-full">
            <h2>Penanggung jawab</h2>
            <form.Field name="penanggungJawab">
              {(field) => (
                <TipTapTextEditor
                  content={field.state.value}
                  onChange={(content) => field.handleChange(content)}
                />
              )}
            </form.Field>
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <h2>Penjelasan</h2>
          <form.Field name="penjelasan">
            {(field) => (
              <TipTapTextEditor
                content={field.state.value}
                onChange={(content) => field.handleChange(content)}
              />
            )}
          </form.Field>
        </div>
        <Button type="submit" className="w-fit mt-4">
          <Save />
          Save
        </Button>
      </div>
    </form>
  );
};

export default IkuDetailUpdateForm;
