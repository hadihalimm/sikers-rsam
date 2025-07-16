import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useDeleteIndikatorSasaran,
  useGetAllIndikatorSasaran,
} from '@/hooks/query/indikator-sasaran';
import { IndikatorSasaran, Sasaran } from '@/types/database';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import CreateOrUpdateIndikatorSasaranForm from './indikator-sasaran-form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';

interface IndikatorSasaranTableProps {
  sasaran: Sasaran | undefined;
  tujuanId: number;
  cascadingId: number;
}

const IndikatorSasaranTable = ({
  sasaran,
  tujuanId,
  cascadingId,
}: IndikatorSasaranTableProps) => {
  const sasaranId = sasaran?.id ?? 0;
  const { data: indikatorSasaranList = [] } = useGetAllIndikatorSasaran(
    sasaranId,
    tujuanId,
    cascadingId,
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIndikator, setSelectedIndikator] =
    useState<IndikatorSasaran>();
  const deleteIndikatorSasaran = useDeleteIndikatorSasaran(
    sasaranId,
    tujuanId,
    cascadingId,
  );

  if (sasaranId === 0) {
    return (
      <div className="w-1/3">
        <h1 className="font-semibold text-lg">Daftar Indikator Sasaran</h1>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%]">Indikator</TableHead>
              <TableHead className="w-[20%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} className="h-16 text-center">
                Silahkan pilih sasaran
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-1/3 flex flex-col gap-y-3">
      <div>
        <h1 className="font-semibold text-lg">Daftar Indikator Sasaran</h1>
        <p>{sasaran?.judul}</p>
      </div>
      <Button
        size="sm"
        className="w-fit"
        onClick={() => {
          setSelectedIndikator(undefined);
          setCreateDialogOpen(true);
        }}>
        <Plus />
        Indikator sasaran
      </Button>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80%]">Indikator</TableHead>
            <TableHead className="w-[20%]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indikatorSasaranList.length !== 0 ? (
            indikatorSasaranList.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nama}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIndikator(item);
                          setUpdateDialogOpen(true);
                        }}>
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIndikator(item);
                          setDeleteDialogOpen(true);
                        }}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="h-16 text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <FormDialog
        title="Tambah Indikator Sasaran"
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}>
        <CreateOrUpdateIndikatorSasaranForm
          sasaranId={sasaran!.id}
          tujuanId={tujuanId}
          cascadingId={cascadingId}
          onSuccess={() => {
            setCreateDialogOpen(false);
          }}
        />
      </FormDialog>
      <FormDialog
        title="Update Indikator Sasaran"
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}>
        <CreateOrUpdateIndikatorSasaranForm
          initialData={selectedIndikator}
          sasaranId={sasaran!.id}
          tujuanId={tujuanId}
          cascadingId={cascadingId}
          onSuccess={() => {
            setUpdateDialogOpen(false);
          }}
        />
      </FormDialog>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          deleteIndikatorSasaran.mutateAsync(selectedIndikator!.id);
        }}
      />
    </div>
  );
};

export default IndikatorSasaranTable;
