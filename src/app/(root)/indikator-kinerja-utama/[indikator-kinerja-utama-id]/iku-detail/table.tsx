/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetAllIkuDetail } from '@/hooks/query/indikator-kinerja-utama/iku-detail';
import { IndikatorKinerjaUtamaDetailWithSasaran } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

type ProcessedRowData = IndikatorKinerjaUtamaDetailWithSasaran & {
  sasaranRowSpan: number;
  showSasaran: boolean;
  sasaranId: string;
};

const IndikatorKinerjaUtamaDetailTable = () => {
  const params = useParams();
  const { data = [] } = useGetAllIkuDetail(
    Number(params['indikator-kinerja-utama-id']),
  );
  const processedData = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      const sasaranId = item.sasaran.id;
      if (!acc[sasaranId]) {
        acc[sasaranId] = {
          sasaran: item.sasaran,
          items: [],
        };
      }
      acc[sasaranId].items.push(item);
      return acc;
    }, {} as Record<string, { sasaran: any; items: IndikatorKinerjaUtamaDetailWithSasaran[] }>);

    // Flatten the data with row span information
    const result: ProcessedRowData[] = [];

    Object.values(grouped).forEach((group) => {
      group.items.forEach((item, index) => {
        result.push({
          ...item,
          sasaranRowSpan: index === 0 ? group.items.length : 0,
          showSasaran: index === 0,
          sasaranId: group.sasaran.id,
        });
      });
    });

    return result;
  }, [data]);

  const columnHelper = createColumnHelper<ProcessedRowData>();
  const columns = [
    columnHelper.accessor((row) => row.sasaran.judul, {
      id: 'sasaran',
      header: 'Sasaran',
      cell: (info) => {
        if (!info.row.original.showSasaran) {
          return null;
        }
        return info.getValue();
      },
    }),
    columnHelper.accessor((row) => row.indikatorSasaran.nama, {
      id: 'indikatorSasaran',
      header: 'Indikator Sasaran',
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor('detail.baseline', {
    //   id: 'baseline',
    //   header: 'Baseline',
    //   cell: (info) => info.getValue(),
    // }),
    // columnHelper.accessor('detail.penjelasan', {
    //   id: 'penjelasan',
    //   header: 'Penjelasan',
    //   cell: (info) => info.getValue(),
    // }),
    // columnHelper.accessor('detail.penanggungJawab', {
    //   id: 'penanggungJawab',
    //   header: 'Penanggung Jawab',
    //   cell: (info) => info.getValue(),
    // }),
  ];

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === 'sasaran') {
                    if (!row.original.showSasaran) {
                      return null;
                    }
                    return (
                      <TableCell
                        key={cell.id}
                        rowSpan={row.original.sasaranRowSpan}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
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
    </div>
  );
};

export default IndikatorKinerjaUtamaDetailTable;
