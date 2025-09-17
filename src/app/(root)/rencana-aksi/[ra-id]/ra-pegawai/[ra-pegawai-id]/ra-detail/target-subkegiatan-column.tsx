import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PerjanjianKinerjaPegawaiProgram,
  RencanaAksiSubKegiatanTarget,
  RencanaAksiSubkegiatanTargetDetail,
} from '@/types/database';
import { groupBy } from 'lodash';
import { Edit, Plus, Trash } from 'lucide-react';

interface RencanaAksiSubkegiatanTargetColumnProps {
  data: RencanaAksiSubkegiatanTargetDetail[];
  onEdit: (
    data?: RencanaAksiSubKegiatanTarget,
    pkPegawaiProgram?: PerjanjianKinerjaPegawaiProgram,
  ) => void;
  onDelete: (data: RencanaAksiSubKegiatanTarget) => void;
}

const RencanaAksiSubkegiatanTargetColumn = ({
  data,
  onEdit,
  onDelete,
}: RencanaAksiSubkegiatanTargetColumnProps) => {
  const grouped = groupBy(data, (item) => item.refSubKegiatan.id);
  return (
    <div className="flex flex-col gap-y-8">
      {Object.values(grouped).map((items) => {
        const first = items[0];
        return (
          <div key={first.refSubKegiatan.id} className="flex flex-col gap-y-6">
            <div>
              <p className="font-semibold">{first.refProgram?.nama}</p>
              <p>Kegiatan: {first.refKegiatan?.nama}</p>
              <p>Sub-kegiatan: {first.refSubKegiatan?.nama}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p>Anggaran: {first.perjanjianKinerjaPegawaiProgram.anggaran}</p>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">
                      Indikator Output Kegiatan
                    </TableHead>
                    <TableHead className="w-18">Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={`sub-${item.refSubKegiatan?.id}-target-${item.rencanaAksiSubKegiatanTarget?.id}`}>
                      <TableCell>
                        {item.rencanaAksiSubKegiatanTarget?.nama}
                      </TableCell>
                      <TableCell>
                        {item.rencanaAksiSubKegiatanTarget?.target}
                      </TableCell>
                      <TableCell className="flex flex-col gap-y-1">
                        <Button
                          className="w-7 h-6"
                          onClick={() => {
                            onEdit(item.rencanaAksiSubKegiatanTarget);
                          }}>
                          <Edit />
                        </Button>
                        <Button
                          className="w-7 h-6"
                          variant="destructive"
                          onClick={() => {
                            onDelete(item.rencanaAksiSubKegiatanTarget);
                          }}>
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                className="w-fit h-6 bg-green-500 hover:bg-green-500/90"
                onClick={() =>
                  onEdit(undefined, first.perjanjianKinerjaPegawaiProgram)
                }>
                <Plus />
                Tambah Indikator
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RencanaAksiSubkegiatanTargetColumn;
