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
import { useGetAllTujuan } from '@/hooks/query/tujuan';
import { Tujuan, TujuanWithIndikator } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import CreateOrUpdateTujuanForm from './tujuan-form';
import IndikatorTujuanColumn from './indikator-tujuan-column';
import JudulTujuanColumn from './judul-tujuan-column';

const TujuanTable = () => {
  const params = useParams();
  const cascadingId = Number(params['cascading-id']);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Tujuan>();

  const columnHelper = createColumnHelper<TujuanWithIndikator>();
  const columns = [
    columnHelper.accessor('judul', {
      id: 'judul',
      header: 'Judul',
      cell: (info) => (
        <JudulTujuanColumn
          tujuan={info.row.original}
          cascadingId={cascadingId}
        />
      ),
    }),
    columnHelper.accessor('indikatorTujuanList', {
      id: 'indikatorTujuanList',
      header: 'Indikator tujuan',
      cell: (info) => (
        <IndikatorTujuanColumn
          tujuanId={info.row.original.id}
          cascadingId={cascadingId}
          data={info.getValue()}
        />
      ),
    }),
  ];

  const { data = [] } = useGetAllTujuan(cascadingId);
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
              Tambah Tujuan
            </Button>
          }
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingItem(undefined);
          }}>
          <CreateOrUpdateTujuanForm
            onSuccess={() => {
              setDialogOpen(false);
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
    </div>
  );
};

export default TujuanTable;
