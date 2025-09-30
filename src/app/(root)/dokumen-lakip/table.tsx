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
import {
  useDeleteDokumenLakip,
  useGetAllDokumenLakip,
} from '@/hooks/query/dokumen/dokumen-lakip';
import { authClient } from '@/lib/auth-client';
import { DokumenLakip } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Download, Plus, SquarePen } from 'lucide-react';
import { useState } from 'react';
import DokumenLakipForm from './form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';

const DokumenLakipTable = () => {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.roles?.includes('admin');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DokumenLakip>();

  const columnHelper = createColumnHelper<DokumenLakip>();
  const columns = [
    columnHelper.accessor('nama', {
      id: 'nama',
      header: 'Nama',
      size: 150,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('updatedAt', {
      id: 'updatedAt',
      header: 'Updated at',
      size: 80,
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'download',
      header: 'Download',
      size: 30,
      cell: ({ row }) => (
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL}/api/dokumen/lakip/${row.original.id}`}
          target="_blank"
          rel="noopener noreferrer">
          <Button size="icon">
            <Download />
          </Button>
        </a>
      ),
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

  const { data = [] } = useGetAllDokumenLakip();
  const deleteDokumenLakip = useDeleteDokumenLakip();
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
        {isAdmin && (
          <FormDialog
            title="Tambah Dokumen Lakip"
            trigger={
              <Button>
                <Plus />
                Tambah Dokumen
              </Button>
            }
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}>
            <DokumenLakipForm
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
        title="Edit Dokumen Lakip"
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}>
        <DokumenLakipForm
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
        onSuccess={async () => {
          await deleteDokumenLakip.mutateAsync(editingItem!.id);
          setEditingItem(undefined);
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
};

export default DokumenLakipTable;
