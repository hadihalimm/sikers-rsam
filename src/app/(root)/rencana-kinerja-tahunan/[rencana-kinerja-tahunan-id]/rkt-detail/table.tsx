/* eslint-disable @typescript-eslint/no-explicit-any */
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
  useDeleteRencanaKinerjaTahunanDetail,
  useGetAllRencanaKinerjaTahunanDetail,
} from '@/hooks/query/rencana-kinerja-tahunan/rencana-kinerja-tahunan-detail';
import {
  RencanaKinerjaTahunanDetail,
  RencanaKinerjaTahunanDetailWithSasaran,
} from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, SquarePen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import RencanaKinerjaTahunanDetailForm from './form';

type ProcessedRowData = RencanaKinerjaTahunanDetailWithSasaran & {
  sasaranRowSpan: number;
  showSasaran: boolean;
  sasaranId: string;
};

const RencanaKinerjaTahunanDetailTable = () => {
  const params = useParams();
  const { data = [] } = useGetAllRencanaKinerjaTahunanDetail(
    Number(params['rencana-kinerja-tahunan-id']),
  );
  const deleteRencanaKinerjaTahunanDetail =
    useDeleteRencanaKinerjaTahunanDetail(
      Number(params['rencana-kinerja-tahunan-id']),
    );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RencanaKinerjaTahunanDetail>();

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
    }, {} as Record<string, { sasaran: any; items: RencanaKinerjaTahunanDetailWithSasaran[] }>);

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
      size: 100,
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
      size: 100,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.detail.target, {
      id: 'target',
      header: 'Target',
      size: 80,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.detail.updatedAt, {
      id: 'updatedAt',
      header: 'Updated at',
      size: 100,
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      size: 40,
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
                setEditingItem(row.original.detail);
                setUpdateDialogOpen(true);
              }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditingItem(row.original.detail);
                setDeleteDialogOpen(true);
              }}>
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useReactTable({
    data: processedData,
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
          title="Tambah Rencana Kinerja Tahunan"
          trigger={
            <Button>
              <Plus />
              Tambah RKT Detail
            </Button>
          }
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}>
          <RencanaKinerjaTahunanDetailForm
            onSuccess={() => {
              setEditingItem(undefined);
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
                <TableRow key={row.id} className="hover:bg-background">
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'sasaran') {
                      if (!row.original.showSasaran) {
                        return null;
                      }
                      return (
                        <TableCell
                          key={cell.id}
                          rowSpan={row.original.sasaranRowSpan}
                          className="whitespace-normal break-words align-top pt-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={cell.id}
                        className="whitespace-normal break-words">
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
        title="Edit Rencana Kinerja Tahunan"
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}>
        <RencanaKinerjaTahunanDetailForm
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
        onSuccess={() => {
          deleteRencanaKinerjaTahunanDetail.mutate(editingItem!.id);
          setEditingItem(undefined);
          setDeleteDialogOpen(false);
          toast.info('Rencana Kinerja Tahunan Detail berhasil dihapus');
        }}
      />
    </div>
  );
};

export default RencanaKinerjaTahunanDetailTable;
