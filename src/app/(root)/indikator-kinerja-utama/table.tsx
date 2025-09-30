'use client';

import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetAllCascading } from '@/hooks/query/cascading/cascading';
import {
  useDeleteIndikatorKinerjaUtama,
  useGetAllIndikatorKinerjaUtama,
} from '@/hooks/query/indikator-kinerja-utama/indikator-kinerja-utama';
import {
  IndikatorKinerjaUtama,
  IndikatorKinerjaUtamaWithCascading,
} from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CreateOrUpdateIKUForm from './form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { formatDate } from '@/lib/utils';

const IndikatorKinerjaUtamaTable = () => {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.roles?.includes('admin');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IndikatorKinerjaUtama>();

  const columnHelper = createColumnHelper<IndikatorKinerjaUtamaWithCascading>();
  const columns = [
    columnHelper.accessor('nama', {
      id: 'nama',
      header: 'Nama',
      size: 100,
      cell: (info) => (
        <Link
          href={`/indikator-kinerja-utama/${info.row.original.id}/iku-detail`}
          className="font-medium hover:cursor-pointer text-primary hover:font-semibold hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('cascading.tahunMulai', {
      id: 'tahunMulai',
      header: 'Tahun Mulai',
      size: 50,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('cascading.tahunBerakhir', {
      id: 'tahunBerakhir',
      header: 'Tahun Berakhir',
      size: 50,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('updatedAt', {
      id: 'updatedAt',
      header: 'Updated at',
      size: 100,
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      size: 30,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open menu</span>
              <SquarePen />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingItem(row.original);
                setUpdateDialogOpen(true);
              }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditingItem(row.original);
                setDeleteDialogOpen(true);
              }}>
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const { data = [] } = useGetAllIndikatorKinerjaUtama();
  const { data: cascadingList = [] } = useGetAllCascading();
  const deleteIku = useDeleteIndikatorKinerjaUtama();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        actions: isAdmin ?? false,
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-end">
        <Label htmlFor="search" className="flex flex-col items-start">
          <p className="font-semibold ml-1">Search</p>
          <Input id="search" className="w-[300px]" />
        </Label>
        {isAdmin && (
          <FormDialog
            title="Tambah Indikator Kinerja Utama"
            trigger={
              <Button>
                <Plus />
                Tambah IKU
              </Button>
            }
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}>
            <CreateOrUpdateIKUForm
              cascadingList={cascadingList}
              onSuccess={() => {
                setEditingItem(undefined);
                setCreateDialogOpen(false);
              }}
            />
          </FormDialog>
        )}
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                      maxWidth: `${header.getSize()}px`,
                    }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormDialog
        title="Edit Renstra"
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}>
        <CreateOrUpdateIKUForm
          initialData={editingItem}
          cascadingList={cascadingList}
          onSuccess={() => {
            setEditingItem(undefined);
            setUpdateDialogOpen(false);
          }}
        />
      </FormDialog>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          deleteIku.mutate(editingItem!.id);
          setEditingItem(undefined);
          setDeleteDialogOpen(false);
          toast.info('Indikator Kinerja Utama berhasil dihapus');
        }}
      />
    </div>
  );
};

export default IndikatorKinerjaUtamaTable;
