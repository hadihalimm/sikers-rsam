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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetAllPkPegawaiProgram } from '@/hooks/query/perjanjian-kinerja/pk-pegawai-program';
import {
  PerjanjianKinerjaPegawaiProgram,
  PerjanjianKinerjaPegawaiProgramDetail,
  PerjanjianKinerjaPegawaiProgramDetailFlat,
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
import PerjanjianKinerjaProgramForm from './program-form';
import { useDeletePkPegawaiProgramDetail } from '@/hooks/query/perjanjian-kinerja/pk-pegawai-program-detail';
import { toast } from 'sonner';

type ProcessedRowData = PerjanjianKinerjaPegawaiProgramDetailFlat & {
  sasaranRowSpan: number;
  showSasaran: boolean;
  sasaranId: string;
};

const PerjanjianKinerjaProgramTable = () => {
  const { 'pk-id': pkId, 'pk-pegawai-id': pkPegawaiId } = useParams();
  const { data = [] } = useGetAllPkPegawaiProgram(
    Number(pkId),
    Number(pkPegawaiId),
  );

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPkPegawaiProgram, setSelectedPkPegawaiProgram] =
    useState<PerjanjianKinerjaPegawaiProgram>();
  const [editingItem, setEditingItem] =
    useState<PerjanjianKinerjaPegawaiProgramDetail>();

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
    }, {} as Record<string, { sasaran: any; items: PerjanjianKinerjaPegawaiProgramDetailFlat[] }>);

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

  console.log(processedData);

  const columnHelper = createColumnHelper<ProcessedRowData>();
  const columns = [
    columnHelper.accessor('sasaran.judul', {
      id: 'sasaran',
      header: 'Sasaran',
      cell: (info) => {
        if (!info.row.original.showSasaran) {
          return null;
        }
        return (
          <div className="flex flex-col gap-y-4">
            <p>{info.getValue()}</p>
            <Button
              size="sm"
              onClick={() => {
                setSelectedPkPegawaiProgram(info.row.original.pkPegawaiProgram);
                setCreateDialogOpen(true);
              }}
              className="w-fit">
              <Plus className="size-4" />
              <p className="text-xs">Program</p>
            </Button>
          </div>
        );
      },
    }),
    columnHelper.accessor('programDetail', {
      id: 'program',
      header: 'Program',
      cell: (info) => {
        if (info.getValue().programNama === null) {
          return null;
        }
        return (
          <div>
            <p className="font-semibold text-md">
              {info.getValue().programNama}
            </p>
            <p>Kegiatan: {info.getValue().kegiatanNama}</p>
            <p>Sub-kegiatan: {info.getValue().subKegiatanNama}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor('pkPegawaiProgramDetail.anggaran', {
      id: 'anggaran',
      header: 'Anggaran',
      cell: (info) => {
        if (info.getValue() === null) return null;
        return <p>{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor('pkPegawaiProgramDetail.updatedAt', {
      id: 'updatedAt',
      header: 'Updated at',
      cell: (info) => {
        if (info.getValue() === null) return null;
        return info.getValue();
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        if (row.original.programDetail.programNama === null) {
          return null;
        }
        return (
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
                  setSelectedPkPegawaiProgram(row.original.pkPegawaiProgram);
                  setEditingItem(row.original.pkPegawaiProgramDetail);
                  setUpdateDialogOpen(true);
                }}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedPkPegawaiProgram(row.original.pkPegawaiProgram);
                  setEditingItem(row.original.pkPegawaiProgramDetail);
                  setDeleteDialogOpen(true);
                }}>
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const deletePkPegawaiProgramDetail = useDeletePkPegawaiProgramDetail(
    Number(pkId),
    Number(pkPegawaiId),
    selectedPkPegawaiProgram?.id ?? 0,
  );
  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-end">
        {selectedPkPegawaiProgram && (
          <FormDialog
            title="Tambah PK Pegawai Program"
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}>
            <PerjanjianKinerjaProgramForm
              pkId={Number(pkId)}
              pkPegawaiId={Number(pkPegawaiId)}
              pkPegawaiProgramId={selectedPkPegawaiProgram!.id}
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
                          className="whitespace-normal break-words align-top">
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

      {selectedPkPegawaiProgram && (
        <FormDialog
          title="Edit PK Pegawai Program"
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}>
          <PerjanjianKinerjaProgramForm
            initialData={editingItem}
            pkId={Number(pkId)}
            pkPegawaiId={Number(pkPegawaiId)}
            pkPegawaiProgramId={selectedPkPegawaiProgram!.id}
            onSuccess={() => {
              setEditingItem(undefined);
              setUpdateDialogOpen(false);
            }}
          />
        </FormDialog>
      )}

      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          deletePkPegawaiProgramDetail.mutateAsync(editingItem!.id);
          setEditingItem(undefined);
          setDeleteDialogOpen(false);
          toast.info('PK Pegawai Program berhasil dihapus');
        }}
      />
    </div>
  );
};

export default PerjanjianKinerjaProgramTable;
