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
import { useGetAllPegawai } from '@/hooks/query/pegawai/pegawai';
import {
  useDeletePkPegawai,
  useGetAllPkPegawai,
  useVerifyPkPegawai,
} from '@/hooks/query/perjanjian-kinerja/pk-pegawai';
import { PerjanjianKinerja, PerjanjianKinerjaPegawai } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { CircleCheck, CircleEllipsis, Plus, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import PerjanjianKinerjaPegawaiForm from './form';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';

interface PerjanjianKinerjaPegawaiTableProps {
  perjanjianKinerja: PerjanjianKinerja;
}

const PerjanjianKinerjaPegawaiTable = ({
  perjanjianKinerja,
}: PerjanjianKinerjaPegawaiTableProps) => {
  const params = useParams();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.roles?.includes('admin');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PerjanjianKinerjaPegawai>();
  const verifyPkPegawai = useVerifyPkPegawai(Number(params['pk-id']));

  const columnHelper = createColumnHelper<PerjanjianKinerjaPegawai>();
  const columns = [
    columnHelper.accessor('pegawai.nama', {
      id: 'pegawaiNama',
      header: 'Nama pegawai',
      size: 100,
      cell: (info) => (
        <Link
          href={`/perjanjian-kinerja/${params['pk-id']}/pk-pegawai/${info.row.original.id}/pk-detail`}
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
      size: 50,
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
                await verifyPkPegawai.mutateAsync({
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
                setDeleteDialogOpen(true);
              }}>
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const { data = [] } = useGetAllPkPegawai(Number(params['pk-id']));
  const { data: pegawaiList = [] } = useGetAllPegawai();
  const deletePkPegawai = useDeletePkPegawai(Number(params['pk-id']));
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
          title="Tambah PK Pegawai"
          trigger={
            <Button>
              <Plus />
              Tambah PK
            </Button>
          }
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}>
          <PerjanjianKinerjaPegawaiForm
            pegawaiList={pegawaiList}
            perjanjianKinerja={perjanjianKinerja}
            onSuccess={() => {
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

      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          deletePkPegawai.mutate(editingItem!.id);
          setEditingItem(undefined);
          setDeleteDialogOpen(false);
          toast.info('PK Pegawai berhasil dihapus');
        }}
      />
    </div>
  );
};

export default PerjanjianKinerjaPegawaiTable;
