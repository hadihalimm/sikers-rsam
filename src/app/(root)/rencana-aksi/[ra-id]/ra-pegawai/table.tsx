'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useGetAllRaPegawai,
  useVerifyRaPegawai,
} from '@/hooks/query/rencana-aksi/ra-pegawai';
import { authClient } from '@/lib/auth-client';
import { RencanaAksiPegawai } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { CircleCheck, CircleEllipsis } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const RencanaAksiPegawaiTable = () => {
  const params = useParams();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.roles?.includes('admin');

  const verifyRaPegawai = useVerifyRaPegawai(Number(params['ra-id']));

  const columnHelper = createColumnHelper<RencanaAksiPegawai>();
  const columns = [
    columnHelper.accessor('pegawai.nama', {
      id: 'pegawaiNama',
      header: 'Nama pegawai',
      size: 100,
      cell: (info) => (
        <Link
          href={`/rencana-aksi/${params['ra-id']}/ra-pegawai/${info.row.original.id}/ra-detail`}
          className="font-medium hover:cursor-pointer text-primary hover:font-semibold hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('pegawai.jabatan', {
      id: 'pegawaiJabatan',
      header: 'Jabatan',
      size: 100,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('tahun', {
      id: 'tahun',
      header: 'Tahun',
      size: 40,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row, {
      id: 'status',
      header: 'Status',
      size: 100,
      cell: ({ row }) => {
        if (isAdmin)
          return (
            <Select
              value={String(row.original.status)}
              onValueChange={async (value) => {
                await verifyRaPegawai.mutateAsync({
                  id: row.original.id,
                  status: value === 'true' ? true : false,
                });
                return value;
              }}>
              <SelectTrigger className="w-fit !h-auto whitespace-normal break-words">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">
                  <CircleEllipsis className="text-orange-400" />
                  <p>Belum diverifikasi</p>
                </SelectItem>
                <SelectItem value="true">
                  <CircleCheck className="text-green-400" />
                  <p>Sudah diverifikasi</p>
                </SelectItem>
              </SelectContent>
            </Select>
          );

        return row.original.status ? (
          <div className="flex gap-x-2 items-center">
            <CircleEllipsis className="text-orange-400 size-5" />
            <p>Belum diverifikasi</p>
          </div>
        ) : (
          <div className="flex gap-x-2 items-center">
            <CircleCheck className="text-green-400 size-5" />
            <p>Sudah diverifikasi</p>
          </div>
        );
      },
    }),
    columnHelper.accessor('updatedAt', {
      id: 'updatedAt',
      size: 90,
      header: 'Last updated',
      cell: (info) => info.getValue(),
    }),
  ];

  const { data = [] } = useGetAllRaPegawai(Number(params['ra-id']));
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
    </div>
  );
};

export default RencanaAksiPegawaiTable;
