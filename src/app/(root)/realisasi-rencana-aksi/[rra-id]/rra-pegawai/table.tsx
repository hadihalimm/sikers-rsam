'use client';

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
import { useGetAllRraPegawai } from '@/hooks/query/realisasi-rencana-aksi/rra-pegawai';
import { RealisasiRencanaAksiPegawai } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const RealisasiRencanaAksiPegawaiTable = () => {
  const params = useParams();

  const columnHelper = createColumnHelper<RealisasiRencanaAksiPegawai>();
  const columns = [
    columnHelper.accessor('pegawai.nama', {
      id: 'pegawaiNama',
      header: 'Nama pegawai',
      cell: (info) => (
        <Link
          href={`/realisasi-rencana-aksi/${params['rra-id']}/rra-pegawai/${info.row.original.id}/rra-detail`}
          className="font-medium hover:cursor-pointer text-primary hover:font-semibold hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('pegawai.jabatan', {
      id: 'pegawaiJabatan',
      header: 'Jabatan',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('tahun', {
      id: 'tahun',
      header: 'Tahun',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('updatedAt', {
      id: 'updatedAt',
      header: 'Last updated',
      cell: (info) => info.getValue(),
    }),
  ];

  const { data = [] } = useGetAllRraPegawai(Number(params['rra-id']));
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

export default RealisasiRencanaAksiPegawaiTable;
