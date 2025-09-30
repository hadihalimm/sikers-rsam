'use client';

import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
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
  useDeleteTujuan,
  useGetAllTujuan,
} from '@/hooks/query/cascading/tujuan';
import { Tujuan, TujuanWithIndikator } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { LayoutList, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import CreateOrUpdateTujuanForm from './tujuan-form';
import IndikatorTujuanColumn from './indikator-tujuan-column';
import JudulTujuanColumn from './judul-tujuan-column';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { toast } from 'sonner';
import Link from 'next/link';

const TujuanTable = () => {
  const params = useParams();
  const cascadingId = Number(params['cascading-id']);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Tujuan>();

  const columnHelper = createColumnHelper<TujuanWithIndikator>();
  const columns = [
    columnHelper.accessor('judul', {
      id: 'judul',
      header: 'Judul',
      size: 100,
      cell: (info) => (
        <JudulTujuanColumn
          tujuan={info.row.original}
          cascadingId={cascadingId}
          onEdit={(tujuan) => {
            setEditingItem(tujuan);
            setEditDialogOpen(true);
          }}
          onDelete={(tujuan) => {
            setEditingItem(tujuan);
            setDeleteDialogOpen(true);
          }}
        />
      ),
    }),
    columnHelper.accessor('indikatorTujuanList', {
      id: 'indikatorTujuanList',
      header: 'Indikator tujuan',
      size: 70,
      cell: (info) => (
        <IndikatorTujuanColumn
          tujuanId={info.row.original.id}
          cascadingId={cascadingId}
          data={info.getValue()}
        />
      ),
    }),
    columnHelper.display({
      id: 'sasaranList',
      header: 'Sasaran',
      size: 40,
      cell: (info) => (
        <Link
          href={`/cascading/${cascadingId}/tujuan/${info.row.original.id}/sasaran`}>
          <Button>
            <LayoutList />
            Daftar Sasaran
          </Button>
        </Link>
      ),
    }),
  ];

  const { data = [] } = useGetAllTujuan(cascadingId);
  const deleteTujuan = useDeleteTujuan(cascadingId);
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
          title={editingItem ? 'Edit tujuan' : 'Tambah tujuan'}
          trigger={
            <Button>
              <Plus />
              Tujuan baru
            </Button>
          }
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}>
          <CreateOrUpdateTujuanForm
            onSuccess={() => {
              setCreateDialogOpen(false);
              setEditingItem(undefined);
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
                  <TableHead
                    key={header.id}
                    style={{
                      width: `${header.getSize()}px`,
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
                    <TableCell key={cell.id} className="align-top">
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
        title="Edit Tujuan"
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}>
        <CreateOrUpdateTujuanForm
          initialData={editingItem}
          onSuccess={() => setEditDialogOpen(false)}
        />
      </FormDialog>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          deleteTujuan.mutateAsync(editingItem!.id);
          setDeleteDialogOpen(false);
          toast.info('Tujuan berhasil dihapus');
        }}
      />
    </div>
  );
};

export default TujuanTable;
