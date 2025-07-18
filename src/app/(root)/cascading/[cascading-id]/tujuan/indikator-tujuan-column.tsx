import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import { IndikatorTujuan } from '@/types/database';
import { MoreHorizontal, Plus } from 'lucide-react';
import IndikatorTujuanForm from './indikator-tujuan-form';
import { useState } from 'react';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { useDeleteIndikatorTujuan } from '@/hooks/query/cascading/indikator-tujuan';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    <div className="flex flex-col gap-y-6">
      {data.map((item) => (
        <div key={item.id} className="flex items-center justify-between mr-8">
          <p className="whitespace-normal break-words">{item.nama}</p>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <FormDialog
            title="Edit Indikator Tujuan"
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}>
            <IndikatorTujuanForm
              tujuanId={tujuanId}
              initialData={item}
              onSuccess={() => setUpdateDialogOpen(false)}
            />
          </FormDialog>
          <DeleteAlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={() => {
              deleteIndikatorTujuan.mutateAsync(item.id);
              setDeleteDialogOpen(false);
            }}
          />
        </div>
      ))}
      <div className="flex justify-end mr-8">
        <FormDialog
          title="Tambah Indikator Tujuan"
          trigger={
            <Button variant="secondary" size="sm">
              <Plus className="size-4" />
              <p className="font-medium text-xs">Indikator</p>
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
    </div>
  );
};

export default IndikatorTujuanColumn;
