import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { RealisasiRencanaAksiTargetDetail } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface RealisasiRencanaAksiTargetColumnProps {
  data: RealisasiRencanaAksiTargetDetail[];
  onEdit: (data: RealisasiRencanaAksiTargetDetail) => void;
}

const RealisasiRencanaAksiTargetColumn = ({
  data,
  onEdit,
}: RealisasiRencanaAksiTargetColumnProps) => {
  const columnHelper = createColumnHelper<RealisasiRencanaAksiTargetDetail>();
  const columns = [
    columnHelper.accessor('realisasiRencanaAksiTarget.bulan', {
      id: 'bulan',
      header: 'Bulan',
      size: 50,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row, {
      id: 'rencanaAksiTarget',
      header: 'Target',
      size: 68,
      cell: ({ row }) => {
        const target = row.original.rencanaAksiTarget.target;
        const satuan = row.original.satuan.nama;
        return target != null ? `${target} ${satuan}` : '';
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'realisasi',
      header: 'Realisasi',
      size: 68,
      cell: ({ row }) => {
        const realisasi = row.original.realisasiRencanaAksiTarget.realisasi;
        const satuan = row.original.satuan.nama;
        return realisasi != null ? `${realisasi} ${satuan}` : '';
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'capaian',
      header: 'Capaian',
      size: 68,
      cell: ({ row }) => {
        const capaian = row.original.realisasiRencanaAksiTarget.capaian;
        return capaian != null ? `${capaian} %` : '';
      },
    }),
    columnHelper.accessor('realisasiRencanaAksiTarget.hambatan', {
      id: 'hambatan',
      header: 'Hambatan',
      size: 150,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('realisasiRencanaAksiTarget.tindakLanjut', {
      id: 'tindakLanjut',
      header: 'Tindak lanjut',
      size: 150,
      cell: (info) => info.getValue(),
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
};

export default RealisasiRencanaAksiTargetColumn;
