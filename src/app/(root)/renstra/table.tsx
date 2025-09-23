'use client';

import DeleteAlertDialog from '@/components/delete-alert-dialog';
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
  useDeleteRenstra,
  useGetAllRenstra,
} from '@/hooks/query/renstra/renstra';
import { Renstra, RenstraWithCascading } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CreateOrUpdateRenstraForm from './form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const RenstraTable = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Renstra>();

  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.roles?.includes('admin');

  const columnHelper = createColumnHelper<RenstraWithCascading>();
  const columns = [
    columnHelper.accessor('judul', {
      id: 'judul',
      header: 'Judul',
      cell: (info) => (
        <Link
          href={`/renstra/${info.row.original.id}`}
          className="font-medium hover:cursor-pointer text-primary hover:font-semibold hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('cascading.tahunMulai', {
      id: 'tahunMulai',
      header: 'Tahun Mulai',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('cascading.tahunBerakhir', {
      id: 'tahunBerakhir',
      header: 'Tahun Berakhir',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('updatedAt', {
      id: 'updatedAt',
      header: 'Updated at',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
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

  const { data = [] } = useGetAllRenstra();
  const { data: cascadingList = [] } = useGetAllCascading();
  const deleteRenstra = useDeleteRenstra();
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
        <FormDialog
          title="Tambah Renstra"
          trigger={
            <Button>
              <Plus />
              Tambah Renstra
            </Button>
          }
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}>
          <CreateOrUpdateRenstraForm
            cascadingList={cascadingList}
            onSuccess={() => {
              setEditingItem(undefined);
              setCreateDialogOpen(false);
            }}
          />
        </FormDialog>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
        <CreateOrUpdateRenstraForm
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
          deleteRenstra.mutate(editingItem!.id);
          setEditingItem(undefined);
          setDeleteDialogOpen(false);
          toast.info('Renstra berhasil dihapus');
        }}
      />
    </div>
  );
};

export default RenstraTable;
