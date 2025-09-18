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
import { useGetRraPegawaiDetail } from '@/hooks/query/realisasi-rencana-aksi/rra-pegawai';
import { useGetAllRraTarget } from '@/hooks/query/realisasi-rencana-aksi/rra-target';
import {
  RealisasiRencanaAksiPegawaiDetail,
  RealisasiRencanaAksiPencapaianTargetDetail,
  RealisasiRencanaAksiSubkegiatanTargetDetail,
  RealisasiRencanaAksiTargetDetail,
} from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import RealisasiRencanaAksiTargetColumn from './rra-target-column';
import FormDialog from '@/components/form-dialog';
import RealisasiRencanaAksiTargetForm from './rra-target-form';
import { useGetAllRraPencapaianTarget } from '@/hooks/query/realisasi-rencana-aksi/rra-pencapaian-target';
import RealisasiRencanaAksiPencapaianTargetColumn from './rra-pencapaian-target-column';
import RealisasiRencanaAksiPencapaianTargetForm from './rra-pencapaian-target-form';
import { useGetAllRraSubkegiatanTarget } from '@/hooks/query/realisasi-rencana-aksi/rra-subkegiatan-target';
import RealisasiRencanaAksiSubkegiatanTargetColumn from './rra-subkegiatan-target-column';
import RealisasiRencanaAksiSubkegiatanTargetForm from './rra-subkegiatan-target-form';

type ProcessedRowData = RealisasiRencanaAksiPegawaiDetail & {
  sasaranRowSpan: number;
  showSasaran: boolean;
  sasaranId: string;
};

const RealisasiRencanaAksiDetailTable = () => {
  const { 'rra-id': rraId, 'rra-pegawai-id': rraPegawaiId } = useParams();
  const { data = [] } = useGetRraPegawaiDetail(
    Number(rraId),
    Number(rraPegawaiId),
  );

  const [editRraTargetDialog, setEditRraTargetDialog] = useState(false);
  const [selectedRraTarget, setSelectedRraTarget] =
    useState<RealisasiRencanaAksiTargetDetail>();

  const [editRraPencapaianTargetDialog, setEditRraPencapaianTargetDialog] =
    useState(false);
  const [selectedRraPencapaianTarget, setSelectedRraPencapaianTarget] =
    useState<RealisasiRencanaAksiPencapaianTargetDetail>();

  const [editRraSubkegiatanTarget, setEditRraSubkegiatanTarget] =
    useState(false);
  const [selectedRraSubkegiatanTarget, setSelectedRraSubkegiatanTarget] =
    useState<RealisasiRencanaAksiSubkegiatanTargetDetail>();

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
    }, {} as Record<string, { sasaran: any; items: RealisasiRencanaAksiPegawaiDetail[] }>);

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

  const { data: rraTargetList = [] } = useGetAllRraTarget(
    Number(rraId),
    Number(rraPegawaiId),
  );

  const { data: rraPencapaianTargetList = [] } = useGetAllRraPencapaianTarget(
    Number(rraId),
    Number(rraPegawaiId),
  );

  const { data: rraSubkegiatanTargetList = [] } = useGetAllRraSubkegiatanTarget(
    Number(rraId),
    Number(rraPegawaiId),
  );

  const columnHelper = createColumnHelper<ProcessedRowData>();
  const columns = [
    columnHelper.accessor('sasaran.judul', {
      id: 'sasaran',
      header: 'Sasaran',
      size: 60,
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
      size: 50,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row, {
      id: 'realisasiRencanaAksiTarget',
      header: 'Realisasi Target',
      size: 160,
      cell: ({ row }) => (
        <RealisasiRencanaAksiTargetColumn
          data={rraTargetList.filter(
            (item) =>
              item.perjanjianKinerjaPegawaiSasaran.id ===
              row.original.perjanjianKinerjaPegawaiSasaran.id,
          )}
          onEdit={(data) => {
            setSelectedRraTarget(data);
            setEditRraTargetDialog(true);
          }}
        />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'realisasiRencanaAksiPencapaianTarget',
      header: 'Realisasi Langkah Pencapaian',
      size: 160,
      cell: ({ row }) => (
        <RealisasiRencanaAksiPencapaianTargetColumn
          data={rraPencapaianTargetList.filter(
            (item) =>
              item.rencanaAksiPencapaianLangkah
                .perjanjianKinerjaPegawaiSasaranId ===
              row.original.perjanjianKinerjaPegawaiSasaran.id,
          )}
          onEdit={(data) => {
            setSelectedRraPencapaianTarget(data);
            setEditRraPencapaianTargetDialog(true);
          }}
        />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'realisasiIndikatorOutputKegiatan',
      header: 'Realisasi Indikator Output Kegiatan',
      size: 160,
      cell: ({ row }) => (
        <RealisasiRencanaAksiSubkegiatanTargetColumn
          data={rraSubkegiatanTargetList.filter(
            (item) =>
              item.perjanjianKinerjaPegawaiProgram
                .perjanjianKinerjaPegawaiSasaranId ===
              row.original.perjanjianKinerjaPegawaiSasaran.id,
          )}
          onEdit={(data) => {
            setSelectedRraSubkegiatanTarget(data);
            setEditRraSubkegiatanTarget(true);
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
                          className="whitespace-normal break-words border align-top">
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
                        className="whitespace-normal border break-words align-top">
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
        title="Edit Realisasi Rencana Aksi Target"
        description={`Bulan ${selectedRraTarget?.realisasiRencanaAksiTarget.bulan}`}
        open={editRraTargetDialog}
        onOpenChange={setEditRraTargetDialog}>
        <RealisasiRencanaAksiTargetForm
          initialData={selectedRraTarget!}
          rraId={Number(rraId)}
          rraPegawaiId={Number(rraPegawaiId)}
          onSuccess={() => {
            setEditRraTargetDialog(false);
            setSelectedRraTarget(undefined);
          }}
        />
      </FormDialog>

      <FormDialog
        title="Edit Realisasi Rencana Aksi Pencapaian Target"
        description={`${selectedRraPencapaianTarget?.rencanaAksiPencapaianLangkah.nama} - Bulan ${selectedRraPencapaianTarget?.rencanaAksiPencapaianTarget.bulan}`}
        open={editRraPencapaianTargetDialog}
        onOpenChange={setEditRraPencapaianTargetDialog}>
        <RealisasiRencanaAksiPencapaianTargetForm
          initialData={selectedRraPencapaianTarget!}
          rraId={Number(rraId)}
          rraPegawaiId={Number(rraPegawaiId)}
          onSuccess={() => {
            setEditRraPencapaianTargetDialog(false);
            // setSelectedRraPencapaianTarget(undefined);
          }}
        />
      </FormDialog>

      <FormDialog
        title="Edit Realisasi Indikator Output Kegiatan"
        description={
          selectedRraSubkegiatanTarget?.rencanaAksiSubKegiatanTarget.nama
        }
        open={editRraSubkegiatanTarget}
        onOpenChange={setEditRraSubkegiatanTarget}>
        <RealisasiRencanaAksiSubkegiatanTargetForm
          initialData={selectedRraSubkegiatanTarget!}
          rraId={Number(rraId)}
          rraPegawaiId={Number(rraPegawaiId)}
          onSuccess={() => {
            setEditRraSubkegiatanTarget(false);
            // setSelectedRraPencapaianTarget(undefined);
          }}
        />
      </FormDialog>
    </div>
  );
};

export default RealisasiRencanaAksiDetailTable;
