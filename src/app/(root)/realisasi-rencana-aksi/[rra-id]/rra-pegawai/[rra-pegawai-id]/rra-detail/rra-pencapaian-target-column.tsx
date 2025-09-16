import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { RealisasiRencanaAksiPencapaianTargetDetail } from '@/types/database';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

interface RealisasiRencanaAksiPencapaianTargetColumnProps {
  data: RealisasiRencanaAksiPencapaianTargetDetail[];
  onEdit: (data: RealisasiRencanaAksiPencapaianTargetDetail) => void;
}

const RealisasiRencanaAksiPencapaianTargetColumn = ({
  data,
  onEdit,
}: RealisasiRencanaAksiPencapaianTargetColumnProps) => {
  const grouped = useMemo(() => {
    return Object.values(
      data.reduce((acc, item) => {
        const { id, nama } = item.rencanaAksiPencapaianLangkah;
        if (!acc[id]) {
          acc[id] = { id, nama, items: [] };
        }
        acc[id].items.push(item);
        return acc;
      }, {} as Record<number, { id: number; nama: string; items: typeof data }>),
    );
  }, [data]);
  return (
    <div className="flex flex-col gap-y-6">
      {grouped.map((data, index) => (
        <RealisasiRencanaAksiPencapaianTargetSubtable
          key={data.id}
          index={index}
          group={data}
          onEdit={(data) => {
            onEdit(data);
          }}
        />
      ))}
    </div>
  );
};

interface RealisasiRencanaAksiPencapaianTargetSubtableProps {
  index: number;
  group: {
    id: number;
    nama: string;
    items: RealisasiRencanaAksiPencapaianTargetDetail[];
  };
  onEdit: (data: RealisasiRencanaAksiPencapaianTargetDetail) => void;
}
const RealisasiRencanaAksiPencapaianTargetSubtable = ({
  index,
  group,
  onEdit,
}: RealisasiRencanaAksiPencapaianTargetSubtableProps) => {
  const columnHelper =
    createColumnHelper<RealisasiRencanaAksiPencapaianTargetDetail>();
  const columns = [
    columnHelper.accessor('rencanaAksiPencapaianTarget.bulan', {
      id: 'bulan',
      header: 'Bulan',
      size: 50,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row, {
      id: 'rencanaAksiPencapaianTarget',
      header: 'Target',
      size: 68,
      cell: ({ row }) => {
        const target = row.original.rencanaAksiPencapaianTarget.target;
        const satuan = row.original.satuan.nama;
        return target != null ? `${target} ${satuan}` : '';
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'realisasiRencanaAksiPencapaianTarget',
      header: 'Realisasi',
      size: 68,
      cell: ({ row }) => {
        const realisasi =
          row.original.realisasiRencanaAksiPencapaianTarget.realisasi;
        const satuan = row.original.satuan.nama;
        return realisasi != null ? `${realisasi} ${satuan}` : '';
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'capaian',
      header: 'Capaian',
      size: 68,
      cell: ({ row }) => {
        const capaian =
          row.original.realisasiRencanaAksiPencapaianTarget.capaian;
        return capaian != null ? `${capaian} %` : '';
      },
    }),
  ];
  const table = useReactTable({
    data: group.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-y-2">
      <p>
        {index + 1}. {group.nama}
      </p>

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
    </div>
  );
};

export default RealisasiRencanaAksiPencapaianTargetColumn;
