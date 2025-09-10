import { Button } from '@/components/ui/button';
import { RencanaAksiPencapaianDetail } from '@/types/database';
import { Edit, Plus, Trash } from 'lucide-react';

interface RencanaAksiPencapaianColumnProps {
  data: RencanaAksiPencapaianDetail[];
  onEdit: (data?: RencanaAksiPencapaianDetail) => void;
  onDelete: (data: RencanaAksiPencapaianDetail) => void;
}

const RencanaAksiPencapaianColumn = ({
  data,
  onEdit,
  onDelete,
}: RencanaAksiPencapaianColumnProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((langkah) => (
        <div key={langkah.id} className="flex flex-col gap-y-4">
          <div className="flex gap-x-2 justify-between">
            <p>{langkah.nama}</p>
            <div className="flex flex-col gap-y-1 mr-6">
              <Button
                className="w-7 h-6"
                onClick={() => {
                  onEdit(langkah);
                }}>
                <Edit />
              </Button>
              <Button
                className="w-7 h-6"
                variant="destructive"
                onClick={() => {
                  onDelete(langkah);
                }}>
                <Trash />
              </Button>
            </div>
          </div>
          <div className="grid grid-rows-6 grid-cols-2 auto-rows-auto grid-flow-col">
            {langkah.rencanaAksiPencapaianTargetList.map((target) => (
              <div key={target.id} className="grid grid-cols-[35px_auto]">
                <p className="whitespace-normal break-words">
                  M-{target.bulan}
                </p>
                <p>
                  {' '}
                  : {target.target} {target.target && target.satuan.nama}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button
        className="w-fit h-6 bg-green-500 hover:bg-green-500/90"
        onClick={() => {
          onEdit();
        }}>
        <Plus />
        Tambah Langkah
      </Button>
    </div>
  );
};

export default RencanaAksiPencapaianColumn;
