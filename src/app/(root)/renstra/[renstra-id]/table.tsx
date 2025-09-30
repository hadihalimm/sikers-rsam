'use client';

import { useParams } from 'next/navigation';
import { useGetRenstra } from '@/hooks/query/renstra/renstra';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  IndikatorSasaranTarget,
  IndikatorTujuanTarget,
  ProgramSasaran,
  RenstraDetail,
  Sasaran,
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
import { useEffect, useState } from 'react';
import FormDialog from '@/components/form-dialog';
import IndikatorTujuanTargetForm from './indikator-tujuan-target-form';
import IndikatorSasaranColumn from './indikator-sasaran-column';
import IndikatorSasaranTargetForm from './indikator-sasaran-target-form';
import ProgramSasaranForm from './program-sasaran-form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { useDeleteProgramSasaran } from '@/hooks/query/renstra/program-sasaran';
import { toast } from 'sonner';
import IndikatorSasaranTargetFilterDropdown from './indikator-sasaran-target-filter-dropdown';

const RenstraDetailTable = () => {
  const params = useParams();
  const { data: renstra = [] } = useGetRenstra(Number(params['renstra-id']));
  const [selectedSasaranLevels, setSelectedSasaranLevels] = useState<number[]>(
    [],
  );
  useEffect(() => {
    if (renstra.length > 0) {
      const levels = Array.from(
        new Set(
          renstra.flatMap((item) =>
            item.sasaranList.map((sasaran) => sasaran.level),
          ),
        ),
      ).sort((a, b) => a - b);

      setSelectedSasaranLevels(levels.filter((val) => val === 1));
    }
  }, [renstra]);

  const columnHelper = createColumnHelper<RenstraDetail>();
  const columns = [
    columnHelper.accessor('judul', {
      id: 'judul',
      header: 'Tujuan',
      size: 50,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('indikatorTujuanList', {
      id: 'indikatorTujuanList',
      header: 'Target Indikator Tujuan',
      size: 70,
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
      header: () => (
        <div className="flex gap-x-2 items-center">
          <p>Target Indikator Sasaran</p>
          <IndikatorSasaranTargetFilterDropdown
            data={renstra}
            selectedLevels={selectedSasaranLevels}
            onFilterChange={(levels) => {
              setSelectedSasaranLevels(levels);
            }}
          />
        </div>
      ),
      size: 100,
      cell: (info) => (
        <IndikatorSasaranColumn
          sasaranList={info
            .getValue()
            .filter((sasaran) => selectedSasaranLevels.includes(sasaran.level))}
          onEditTarget={(target) => {
            setSasaranTargetItem(target);
            setSasaranTargetDialogOpen(true);
          }}
          onAddProgram={(sasaran) => {
            setSasaran(sasaran);
            setProgramSasaranDialogOpen(true);
          }}
          onDeleteProgram={(ps) => {
            setProgramSasaran(ps);
            setDeleteProgramSasaranDialogOpen(true);
          }}
        />
      ),
    }),
  ];
  const table = useReactTable({
    data: renstra,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const [tujuanTargetDialogOpen, setTujuanTargetDialogOpen] = useState(false);
  const [tujuanTargetItem, setTujuanTargetItem] =
    useState<IndikatorTujuanTarget>();
  const [sasaranTargetDialogOpen, setSasaranTargetDialogOpen] = useState(false);
  const [sasaranTargetItem, setSasaranTargetItem] = useState<
    IndikatorSasaranTarget[]
  >([]);
  const [programSasaranDialogOpen, setProgramSasaranDialogOpen] =
    useState(false);
  const [sasaran, setSasaran] = useState<Sasaran>();
  const [deleteProgramSasaranDialogOpen, setDeleteProgramSasaranDialogOpen] =
    useState(false);
  const [programSasaran, setProgramSasaran] = useState<ProgramSasaran>();
  const deleteProgramSasaran = useDeleteProgramSasaran(
    Number(params['renstra-id']),
  );

  return (
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

      <FormDialog
        title="Tambah Program"
        open={programSasaranDialogOpen}
        onOpenChange={setProgramSasaranDialogOpen}>
        <ProgramSasaranForm
          renstraId={Number(params['renstra-id'])}
          sasaranId={sasaran?.id ?? 0}
          onSuccess={() => {
            setProgramSasaranDialogOpen(false);
            setSasaran(undefined);
          }}
        />
      </FormDialog>

      <DeleteAlertDialog
        open={deleteProgramSasaranDialogOpen}
        onOpenChange={setDeleteProgramSasaranDialogOpen}
        onSuccess={() => {
          deleteProgramSasaran.mutateAsync(programSasaran!.id);
          setProgramSasaran(undefined);
          setDeleteProgramSasaranDialogOpen(false);
          toast.info('Program berhasil dihapus');
        }}
      />
    </div>
  );
};

export default RenstraDetailTable;
