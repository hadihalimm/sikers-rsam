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
import { useGetRaPegawaiDetail } from '@/hooks/query/rencana-aksi/ra-pegawai';
import {
  RencanaAksiPegawaiDetail,
  RencanaAksiPencapaianDetail,
  RencanaAksiSubKegiatanTarget,
  RencanaAksiTarget,
} from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import TargetKinerjaColumn from './target-kinerja-column';
import FormDialog from '@/components/form-dialog';
import TargetKinerjaForm from './target-kinerja-form';
import { useGetAllRaTarget } from '@/hooks/query/rencana-aksi/ra-target';
import {
  useDeleteRaPencapaianLangkah,
  useGetAllRaPencapaianLangkah,
} from '@/hooks/query/rencana-aksi/ra-pencapaian-langkah';
import RencanaAksiPencapaianColumn from './ra-pencapaian-column';
import RencanaAksiPencapaianForm from './ra-pencapaian-form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import RencanaAksiSubkegiatanTargetColumn from './target-subkegiatan-column';
import {
  useDeleteRaSubkegiatanTarget,
  useGetAllRaSubkegiatanTargetDetail,
} from '@/hooks/query/rencana-aksi/ra-subkegiatan-target';
import RencanaAksiSubkegiatanTargetForm from './target-subkegiatan-form';

type ProcessedRowData = RencanaAksiPegawaiDetail & {
  sasaranRowSpan: number;
  showSasaran: boolean;
  sasaranId: string;
};

const RencanaAksiPegawaiDetailTable = () => {
  const { 'ra-id': raId, 'ra-pegawai-id': raPegawaiId } = useParams();
  const { data = [] } = useGetRaPegawaiDetail(
    Number(raId),
    Number(raPegawaiId),
  );
  const [selectedRaPegawaiDetail, setSelectedRaPegawaiDetail] =
    useState<RencanaAksiPegawaiDetail>();

  const [updateRaTargetDialog, setUpdateRaTargetDialog] = useState(false);
  const [selectedRaTarget, setSelectedRaTarget] = useState<RencanaAksiTarget[]>(
    [],
  );
  const [editRaPencapaianDialog, setEditRaPencapaianDialog] = useState(false);
  const [selectedRaPencapaian, setSelectedRaPencapaian] =
    useState<RencanaAksiPencapaianDetail>();
  const [deleteRaPencapaianDialog, setDeleteRaPencapaianDialog] =
    useState(false);

  const [selectedRaSubkegiatanTarget, setSelectedRaSubkegiatanTarget] =
    useState<RencanaAksiSubKegiatanTarget>();
  const [updateRaSubkegiatanTargetDialog, setUpdateRaSubkegiatanTargetDialog] =
    useState(false);
  const [deleteRaSubkegiatanTargetDialog, setDeleteRaSubkegiatanTargetDialog] =
    useState(false);

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
    }, {} as Record<string, { sasaran: any; items: RencanaAksiPegawaiDetail[] }>);

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

  const { data: raTargetList = [] } = useGetAllRaTarget(
    Number(raId),
    Number(raPegawaiId),
  );

  const { data: raPencapaianDetailList = [] } = useGetAllRaPencapaianLangkah(
    Number(raId),
    Number(raPegawaiId),
  );

  const { data: raSubKegiatanTargetList = [] } =
    useGetAllRaSubkegiatanTargetDetail(Number(raId), Number(raPegawaiId));

  const deleteRaPencapaianLangkah = useDeleteRaPencapaianLangkah(
    Number(raId),
    Number(raPegawaiId),
  );
  const deleteRaSubKegiatanTarget = useDeleteRaSubkegiatanTarget(
    Number(raId),
    Number(raPegawaiId),
  );
  const columnHelper = createColumnHelper<ProcessedRowData>();
  const columns = [
    columnHelper.accessor('sasaran.judul', {
      id: 'sasaran',
      header: 'Sasaran',
      size: 50,
      cell: (info) => {
        if (!info.row.original.showSasaran) {
          return null;
        }
        return info.getValue();
      },
    }),
    columnHelper.accessor('indikatorSasaran.nama', {
      id: 'indikatorSasaran',
      header: 'Indikator Sasaran',
      size: 40,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row, {
      id: 'targetKinerja',
      header: 'Target Kinerja',
      size: 80,
      cell: ({ row }) => (
        <TargetKinerjaColumn
          data={raTargetList.filter(
            (item) =>
              item.perjanjianKinerjaPegawaiSasaranId ===
              row.original.perjanjianKinerjaPegawaiSasaran.id,
          )}
          onEdit={(data) => {
            setSelectedRaTarget(data);
            setUpdateRaTargetDialog(true);
          }}
        />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'raPencapaian',
      header: 'Langkah Pencapaian & Target',
      size: 100,
      cell: ({ row }) => (
        <RencanaAksiPencapaianColumn
          data={raPencapaianDetailList.filter(
            (item) =>
              item.perjanjianKinerjaPegawaiSasaranId ===
              row.original.perjanjianKinerjaPegawaiSasaran.id,
          )}
          onEdit={(data) => {
            setSelectedRaPencapaian(data);
            setSelectedRaPegawaiDetail(row.original);
            setEditRaPencapaianDialog(true);
          }}
          onDelete={(data) => {
            setSelectedRaPencapaian(data);
            setDeleteRaPencapaianDialog(true);
          }}
        />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'outputKegiatan',
      header: 'Indikator Output Kegiatan',
      size: 80,
      cell: ({ row }) => (
        <RencanaAksiSubkegiatanTargetColumn
          data={raSubKegiatanTargetList.filter((item) => {
            return (
              item.perjanjianKinerjaPegawaiProgram.id ===
              row.original.perjanjianKinerjaPegawaiProgram.id
            );
          })}
          onEdit={(data) => {
            setSelectedRaPegawaiDetail(row.original);
            setSelectedRaSubkegiatanTarget(data);
            setUpdateRaSubkegiatanTargetDialog(true);
          }}
          onDelete={(data) => {
            setSelectedRaPegawaiDetail(row.original);
            setSelectedRaSubkegiatanTarget(data);
            setDeleteRaSubkegiatanTargetDialog(true);
          }}
        />
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
      <div className="border rounded-md overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-normal break-words"
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
                        className="whitespace-normal break-words  align-top">
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
        title="Edit Target Kinerja"
        open={updateRaTargetDialog}
        onOpenChange={setUpdateRaTargetDialog}>
        <TargetKinerjaForm
          initialData={selectedRaTarget}
          raId={Number(raId)}
          raPegawaiId={Number(raPegawaiId)}
          onSuccess={() => {
            setUpdateRaTargetDialog(false);
            setSelectedRaTarget([]);
          }}
        />
      </FormDialog>

      <FormDialog
        title={
          selectedRaPencapaian
            ? 'Edit Langkah Pencapaian'
            : 'Tambah Langkah Pencapaian'
        }
        open={editRaPencapaianDialog}
        onOpenChange={setEditRaPencapaianDialog}>
        <RencanaAksiPencapaianForm
          initialData={selectedRaPencapaian}
          raId={Number(raId)}
          raPegawaiId={Number(raPegawaiId)}
          pkPegawaiSasaranId={
            selectedRaPegawaiDetail?.perjanjianKinerjaPegawaiSasaran.id
          }
          onSuccess={() => {
            setEditRaPencapaianDialog(false);
            setSelectedRaPencapaian(undefined);
            setSelectedRaPegawaiDetail(undefined);
          }}
        />
      </FormDialog>

      <DeleteAlertDialog
        open={deleteRaPencapaianDialog}
        onOpenChange={setDeleteRaPencapaianDialog}
        onSuccess={() => {
          deleteRaPencapaianLangkah.mutateAsync(selectedRaPencapaian!.id);
          setSelectedRaPencapaian(undefined);
        }}
      />

      <FormDialog
        title={
          selectedRaSubkegiatanTarget
            ? 'Edit Indikator Output Kegiatan'
            : 'Tambah Indikator Output Kegiatan'
        }
        open={updateRaSubkegiatanTargetDialog}
        onOpenChange={setUpdateRaSubkegiatanTargetDialog}>
        <RencanaAksiSubkegiatanTargetForm
          initialData={selectedRaSubkegiatanTarget}
          raId={Number(raId)}
          raPegawaiId={Number(raPegawaiId)}
          pkPegawaiProgramId={
            selectedRaPegawaiDetail?.perjanjianKinerjaPegawaiProgram.id
          }
          onSuccess={() => {
            setUpdateRaSubkegiatanTargetDialog(false);
            setSelectedRaSubkegiatanTarget(undefined);
          }}
        />
      </FormDialog>

      <DeleteAlertDialog
        open={deleteRaSubkegiatanTargetDialog}
        onOpenChange={setDeleteRaSubkegiatanTargetDialog}
        onSuccess={() => {
          deleteRaSubKegiatanTarget.mutateAsync(
            selectedRaSubkegiatanTarget!.id,
          );
          setSelectedRaSubkegiatanTarget(undefined);
        }}
      />
    </div>
  );
};

export default RencanaAksiPegawaiDetailTable;
