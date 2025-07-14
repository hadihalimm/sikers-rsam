import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import { IndikatorTujuan } from '@/types/database';
import { Plus, SquarePen, Trash } from 'lucide-react';
import IndikatorTujuanForm from './indikator-tujuan-form';
import { useState } from 'react';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { useDeleteIndikatorTujuan } from '@/hooks/query/indikator-tujuan';

interface IndikatorTujuanColumnProps {
  tujuanId: number;
  cascadingId: number;
  data: IndikatorTujuan[];
}

const IndikatorTujuanColumn = ({
  data,
  tujuanId,
  cascadingId,
}: IndikatorTujuanColumnProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteIndikatorTujuan = useDeleteIndikatorTujuan(tujuanId, cascadingId);
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <p className="">{item.nama}</p>
          <div className="flex gap-x-2 mr-8">
            <FormDialog
              title="Edit Indikator Tujuan"
              trigger={
                <Button variant="outline" className="size-7">
                  <SquarePen />
                </Button>
              }
              open={updateDialogOpen}
              onOpenChange={setUpdateDialogOpen}>
              <IndikatorTujuanForm
                tujuanId={tujuanId}
                initialData={item}
                onSuccess={() => setUpdateDialogOpen(false)}
              />
            </FormDialog>

            <Button
              variant="destructive"
              className="size-7"
              onClick={() => setDeleteDialogOpen(true)}>
              <Trash />
            </Button>
            <DeleteAlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              onSuccess={() => {
                deleteIndikatorTujuan.mutateAsync(item.id);
                setDeleteDialogOpen(false);
              }}
            />
          </div>
        </div>
      ))}
      <FormDialog
        title="Tambah Indikator Tujuan"
        trigger={
          <Button variant="secondary" className="size-7">
            <Plus />
          </Button>
        }
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}>
        <IndikatorTujuanForm
          tujuanId={tujuanId}
          onSuccess={() => setCreateDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default IndikatorTujuanColumn;
