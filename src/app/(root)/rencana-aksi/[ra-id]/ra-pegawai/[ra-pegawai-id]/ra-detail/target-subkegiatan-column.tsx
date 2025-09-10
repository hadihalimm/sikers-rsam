import { Button } from '@/components/ui/button';
import {
  PerjanjianKinerjaPegawaiProgram,
  RefKegiatan,
  RefProgram,
  RefSubKegiatan,
  RencanaAksiSubKegiatanTarget,
  RencanaAksiSubkegiatanTargetDetail,
  Satuan,
} from '@/types/database';
import { Edit, Plus, Trash } from 'lucide-react';

interface RencanaAksiSubkegiatanTargetColumnProps {
  data: RencanaAksiSubkegiatanTargetDetail[];
  onEdit: (data?: RencanaAksiSubKegiatanTarget) => void;
  onDelete: (data: RencanaAksiSubKegiatanTarget) => void;
}

type GroupedData = {
  refProgram: RefProgram;
  refKegiatan: RefKegiatan;
  refSubKegiatan: RefSubKegiatan;
  perjanjianKinerjaPegawaiProgram: PerjanjianKinerjaPegawaiProgram;
  satuan: Satuan;
  targetList: RencanaAksiSubKegiatanTarget[];
};

const RencanaAksiSubkegiatanTargetColumn = ({
  data,
  onEdit,
  onDelete,
}: RencanaAksiSubkegiatanTargetColumnProps) => {
  const grouped: GroupedData = {
    refProgram: data[0]?.refProgram,
    refKegiatan: data[0]?.refKegiatan,
    refSubKegiatan: data[0]?.refSubKegiatan,
    perjanjianKinerjaPegawaiProgram: data[0]?.perjanjianKinerjaPegawaiProgram,
    satuan: data[0]?.satuan,
    targetList: data
      .map((item) => item.rencanaAksiSubKegiatanTarget)
      .filter((item) => item),
  };
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <div>
          <p>{grouped.refProgram?.nama}</p>
          <p>{grouped.refKegiatan?.nama}</p>
          <p>{grouped.refSubKegiatan?.nama}</p>
          <p>Anggaran: {grouped.perjanjianKinerjaPegawaiProgram?.anggaran}</p>
        </div>
        <div className="flex flex-col gap-y-4">
          {grouped.targetList.map((target, index) => (
            <div key={target.id} className="flex justify-between">
              <div>
                <p>
                  {index + 1}. {target?.nama}
                </p>
                <p>
                  {target?.target} {grouped.satuan?.nama}
                </p>
              </div>
              <div className="flex flex-col gap-y-1">
                <Button
                  className="w-7 h-6"
                  onClick={() => {
                    onEdit(target);
                  }}>
                  <Edit />
                </Button>
                <Button
                  className="w-7 h-6"
                  variant="destructive"
                  onClick={() => {
                    onDelete(target);
                  }}>
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        className="w-fit h-6 bg-green-500 hover:bg-green-500/90"
        onClick={() => onEdit()}>
        <Plus />
        Tambah Indikator
      </Button>
    </div>
  );
};

export default RencanaAksiSubkegiatanTargetColumn;
