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
import { useGetAllRencanaAksi } from '@/hooks/query/rencana-aksi/rencana-aksi';
import { authClient } from '@/lib/auth-client';
import { RencanaAksi } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import RencanaAksiForm from './form';

const RencanaAksiTable = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RencanaAksi>();

  const columnHelper = createColumnHelper<RencanaAksi>();
  const columns = [
    columnHelper.accessor('nama', {
      id: 'nama',
      header: 'Nama',
      cell: (info) => (
        <Link
          href={`/rencana-aksi/${info.row.original.id}/ra-pegawai`}
          className="font-medium hover:cursor-pointer text-primary hover:font-semibold hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('user.name', {
      id: 'name',
      header: 'Nama',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('tahun', {
      id: 'tahun',
      header: 'Tahun',
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

  const { data: session } = authClient.useSession();
  const { data = [] } = useGetAllRencanaAksi(session?.user.id ?? '');
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-end">
        <Label htmlFor="search" className="flex flex-col items-start">
          <p className="font-semibold ml-1">Search</p>
          <Input id="search" className="w-[300px]" />
        </Label>
        <FormDialog
          title="Tambah Rencana Aksi"
          trigger={
            <Button>
              <Plus />
              Tambah Rencana Aksi
            </Button>
          }
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}>
          <RencanaAksiForm
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
        title="Edit Rencana Aksi"
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}>
        <RencanaAksiForm
          initialData={editingItem}
          onSuccess={() => {
            setEditingItem(undefined);
            setUpdateDialogOpen(false);
          }}
        />
      </FormDialog>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default RencanaAksiTable;
