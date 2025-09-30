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
import {
  useDeleteRealisasiRencanaAksi,
  useGetAllRealisasiRencanaAksi,
} from '@/hooks/query/realisasi-rencana-aksi/realisasi-rencana-aksi';
import { authClient } from '@/lib/auth-client';
import { RealisasiRencanaAksi } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import RealisasiRencanaAksiForm from './form';

const RealisasiRencanaAksiTable = () => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RealisasiRencanaAksi>();

  const columnHelper = createColumnHelper<RealisasiRencanaAksi>();
  const columns = [
    columnHelper.accessor('nama', {
      id: 'nama',
      header: 'Nama',
      size: 100,
      cell: (info) => (
        <Link
          href={`/realisasi-rencana-aksi/${info.row.original.id}/rra-pegawai`}
          className="font-medium hover:cursor-pointer text-primary hover:font-semibold hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('user.name', {
      id: 'user',
      header: 'User',
      size: 100,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('tahun', {
      id: 'tahun',
      header: 'Tahun',
      size: 50,
      cell: (info) => info.getValue(),
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

  const { data: session } = authClient.useSession();
  const { data = [] } = useGetAllRealisasiRencanaAksi(session?.user.id ?? '');
  const deleteRealisasiRencanaAksi = useDeleteRealisasiRencanaAksi();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-y-4">
      <Label htmlFor="search" className="flex flex-col items-start">
        <p className="font-semibold ml-1">Search</p>
        <Input id="search" className="w-[300px]" />
      </Label>

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
                    <TableCell
                      key={cell.id}
                      className="whitespace-normal break-words">
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
        title="Edit Realisai Rencana Aksi"
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}>
        <RealisasiRencanaAksiForm
          initialData={editingItem}
          onSuccess={() => {
            setUpdateDialogOpen(false);
            setEditingItem(undefined);
          }}
        />
      </FormDialog>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={async () => {
          await deleteRealisasiRencanaAksi.mutateAsync(editingItem!.id);
          setDeleteDialogOpen(true);
        }}
      />
    </div>
  );
};

export default RealisasiRencanaAksiTable;
