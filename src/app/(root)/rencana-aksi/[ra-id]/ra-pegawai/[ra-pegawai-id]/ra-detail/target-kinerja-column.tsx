import { Button } from '@/components/ui/button';
import { RencanaAksiTarget } from '@/types/database';
import { Edit } from 'lucide-react';

interface TargetKinerjaColumnProps {
  data: RencanaAksiTarget[];
  onEdit: (data: RencanaAksiTarget[]) => void;
}

const TargetKinerjaColumn = ({ data, onEdit }: TargetKinerjaColumnProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid grid-rows-6 grid-cols-2 auto-rows-auto grid-flow-col">
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-[35px_auto]">
            <p className="whitespace-normal break-words">M-{item.bulan}</p>
            <p> : {item.target}</p>
          </div>
        ))}
      </div>
      <Button className="w-fit mr-4 h-6 self-end" onClick={() => onEdit(data)}>
        <Edit />
        Edit
      </Button>
    </div>
  );
};

export default TargetKinerjaColumn;
