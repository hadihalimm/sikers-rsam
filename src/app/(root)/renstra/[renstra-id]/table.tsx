'use client';

import { useParams } from 'next/navigation';
import { useGetRenstra } from '@/hooks/query/renstra/renstra';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  IndikatorSasaranTarget,
  IndikatorTujuanTarget,
  RenstraDetail,
} from '@/types/database';
import IndikatorTujuanColumn from './indikator-tujuan-column';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import FormDialog from '@/components/form-dialog';
import IndikatorTujuanTargetForm from './indikator-tujuan-target-form';
import IndikatorSasaranColumn from './indikator-sasaran-column';
import IndikatorSasaranTargetForm from './indikator-sasaran-target-form';

const RenstraDetailTable = () => {
  const params = useParams();
  const { data: renstra = [] } = useGetRenstra(Number(params['renstra-id']));
  const columnHelper = createColumnHelper<RenstraDetail>();
  const columns = [
    columnHelper.accessor('judul', {
      id: 'judul',
      header: 'Tujuan',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('indikatorTujuanList', {
      id: 'indikatorTujuanList',
      header: 'Target Indikator Tujuan',
      cell: (info) => (
        <IndikatorTujuanColumn
          indikatorTujuanList={info.getValue()}
          onEdit={(item) => {
            setTujuanTargetItem(item);
            setTujuanTargetDialogOpen(true);
          }}
        />
      ),
    }),
    columnHelper.accessor('sasaranList', {
      id: 'sasaranList',
      header: 'Target Indikator Sasaran',
      cell: (info) => (
        <IndikatorSasaranColumn
          sasaranList={info.getValue()}
          onEditTarget={(target) => {
            setSasaranTargetItem(target);
            setSasaranTargetDialogOpen(true);
          }}
        />
      ),
    }),
  ];
  const table = useReactTable({
    data: renstra,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [tujuanTargetDialogOpen, setTujuanTargetDialogOpen] = useState(false);
  const [tujuanTargetItem, setTujuanTargetItem] =
    useState<IndikatorTujuanTarget>();
  const [sasaranTargetDialogOpen, setSasaranTargetDialogOpen] = useState(false);
  const [sasaranTargetItem, setSasaranTargetItem] = useState<
    IndikatorSasaranTarget[]
  >([]);

  return (
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
                  <TableCell
                    key={cell.id}
                    className="align-top whitespace-normal break-words">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <FormDialog
        title="Edit Indikator Tujuan Target"
        open={tujuanTargetDialogOpen}
        onOpenChange={setTujuanTargetDialogOpen}>
        <IndikatorTujuanTargetForm
          initialData={tujuanTargetItem!}
          renstraId={Number(params['renstra-id'])}
          onSuccess={() => {
            setTujuanTargetDialogOpen(false);
            setTujuanTargetItem(undefined);
          }}
        />
      </FormDialog>

      <FormDialog
        title="Edit Indikator Sasaran Target"
        open={sasaranTargetDialogOpen}
        onOpenChange={setSasaranTargetDialogOpen}>
        <IndikatorSasaranTargetForm
          initialData={sasaranTargetItem}
          renstraId={Number(params['renstra-id'])}
          onSuccess={() => {
            setSasaranTargetDialogOpen(false);
            setTimeout(() => {
              setSasaranTargetItem([]);
            }, 200);
          }}
        />
      </FormDialog>
    </div>
  );
};

export default RenstraDetailTable;
