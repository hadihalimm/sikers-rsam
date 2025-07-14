import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tujuan } from '@/types/database';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import CreateOrUpdateTujuanForm from './tujuan-form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { useDeleteTujuan } from '@/hooks/query/tujuan';
import { toast } from 'sonner';

interface JudulTujuanColumnProps {
  tujuan: Tujuan;
  cascadingId: number;
}

const JudulTujuanColumn = ({ tujuan, cascadingId }: JudulTujuanColumnProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteTujuan = useDeleteTujuan(cascadingId);
  return (
    <div className="flex gap-x-4 items-center justify-between mr-8">
      <p>{tujuan.judul}</p>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <FormDialog
        title="Edit Tujuan"
        open={dialogOpen}
        onOpenChange={setDialogOpen}>
        <CreateOrUpdateTujuanForm
          initialData={tujuan}
          onSuccess={() => setDialogOpen(false)}
        />
      </FormDialog>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          deleteTujuan.mutateAsync(tujuan.id);
          setDeleteDialogOpen(false);
          toast.info('Tujuan berhasil dihapus');
        }}
      />
    </div>
  );
};

export default JudulTujuanColumn;
