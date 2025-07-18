'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  useDeleteCascading,
  useGetAllCascading,
} from '@/hooks/query/cascading/cascading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormDialog from '@/components/form-dialog';
import CreateOrUpdateCascadingForm from './form';
import { Button } from '@/components/ui/button';
import { Plus, SquarePen } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { Cascading } from '@/types/database';
import Link from 'next/link';

const CascadingTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cascading>();

  const columnHelper = createColumnHelper<Cascading>();
  const columns = [
    columnHelper.accessor('judul', {
      id: 'judul',
      header: 'Judul',
      cell: (info) => (
        <Link
          href={`/cascading/${info.row.original.id}/tujuan`}
          className="font-medium hover:cursor-pointer text-primary hover:font-semibold hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('tahunMulai', {
      id: 'tahunMulai',
      header: 'Tahun Mulai',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('tahunBerakhir', {
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
      header: 'Action',
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
                setDialogOpen(true);
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
  const { data = [] } = useGetAllCascading();
  const deleteCascading = useDeleteCascading();
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
          title={editingItem ? 'Edit cascading' : 'Tambah cascading'}
          trigger={
            <Button>
              <Plus />
              Tambah Cascading
            </Button>
          }
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingItem(undefined);
          }}>
          <CreateOrUpdateCascadingForm
            initialData={editingItem}
            onSuccess={() => {
              setEditingItem(undefined);
              setDialogOpen(false);
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
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setEditingItem(undefined);
        }}
        onSuccess={() => {
          deleteCascading.mutate(editingItem!.id);
          setEditingItem(undefined);
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
};

export default CascadingTable;
