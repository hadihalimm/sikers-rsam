import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { RealisasiRencanaAksiSubkegiatanTargetDetail } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { groupBy } from 'lodash';

interface RealisasiRencanaAksiSubkegiatanTargetColumnProps {
  data: RealisasiRencanaAksiSubkegiatanTargetDetail[];
  onEdit: (data: RealisasiRencanaAksiSubkegiatanTargetDetail) => void;
}

const RealisasiRencanaAksiSubkegiatanTargetColumn = ({
  data,
  onEdit,
}: RealisasiRencanaAksiSubkegiatanTargetColumnProps) => {
  const grouped = groupBy(data, (item) => item.refSubKegiatan.id);

  return (
    <div className="flex flex-col gap-y-8">
      {Object.values(grouped).map((item, index) => {
        return (
          <RealisasiRencanaAksiSubkegiatanTargetColumnDetail
            key={index}
            data={item}
            onEdit={(data) => onEdit(data)}
          />
        );
      })}
    </div>
  );
};

interface RealisasiRencanaAksiSubkegiatanTargetColumnDetailProps {
  data: RealisasiRencanaAksiSubkegiatanTargetDetail[];
  onEdit: (data: RealisasiRencanaAksiSubkegiatanTargetDetail) => void;
}

const RealisasiRencanaAksiSubkegiatanTargetColumnDetail = ({
  data,
  onEdit,
}: RealisasiRencanaAksiSubkegiatanTargetColumnDetailProps) => {
  const columnHelper =
    createColumnHelper<RealisasiRencanaAksiSubkegiatanTargetDetail>();
  const columns = [
    columnHelper.accessor('rencanaAksiSubKegiatanTarget.nama', {
      id: 'indikatorOutput',
      header: 'Indikator Output',
      size: 120,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row, {
      id: 'target',
      header: 'Target',
      size: 68,
      cell: ({ row }) => {
        const target = row.original.rencanaAksiSubKegiatanTarget.target;
        const satuan = row.original.satuan.nama;
        return target != null ? `${target} ${satuan}` : '';
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'realisasi',
      header: 'Realisasi',
      size: 68,
      cell: ({ row }) => {
        const realisasi =
          row.original.realisasiRencanaAksiSubkegiatanTarget.realisasi;
        const satuan = row.original.satuan.nama;
        return realisasi != null ? `${realisasi} ${satuan}` : '';
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'realisasiAnggaran',
      header: 'Realisasi Anggaran',
      size: 80,
      cell: ({ row }) => {
        const realisasi =
          row.original.realisasiRencanaAksiSubkegiatanTarget.realisasiAnggaran;
        return realisasi != null ? `${realisasi}` : '';
      },
    }),
  ];

  const first = data[0];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col">
        <p className="font-semibold">{first.refProgram.nama}</p>
        <p>Kegiatan: {first.refKegiatan.nama}</p>
        <p>Sub-kegiatan: {first.refSubKegiatan.nama}</p>
      </div>

      <div>
        <p>Anggaran: {first.perjanjianKinerjaPegawaiProgram.anggaran}</p>
        <Table className="table-fixed text-xs">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                      maxWidth: `${header.getSize()}px`,
                    }}
                    className={cn(
                      'whitespace-normal break-words border',
                      header.column.id === 'bulan' &&
                        'sticky left-0 z-10 bg-background',
                    )}>
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
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => {
                    onEdit(row.original);
                  }}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'whitespace-normal break-words border',
                        cell.column.id === 'bulan' &&
                          'sticky left-0 z-10 bg-background',
                      )}>
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

export default RealisasiRencanaAksiSubkegiatanTargetColumn;
