import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { IndikatorTujuan, IndikatorTujuanTarget } from '@/types/database';
import { PenSquare } from 'lucide-react';
type IndikatorTujuanWithTargets = IndikatorTujuan & {
  indikatorTujuanTargetList: IndikatorTujuanTarget[];
};

interface IndikatorTujuanColumnProps {
  indikatorTujuanList: IndikatorTujuanWithTargets[];
  onEdit: (item: IndikatorTujuanTarget) => void;
}

const IndikatorTujuanColumn = ({
  indikatorTujuanList,
  onEdit,
}: IndikatorTujuanColumnProps) => {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.roles?.includes('admin');

  return (
    <div className="flex flex-col gap-y-2">
      {indikatorTujuanList.map((indikator) => (
        <div
          key={indikator.id}
          className="grid auto-rows-auto grid-cols-4 gap-x-4 whitespace-normal break-words">
          <div className="flex justify-between col-span-2 items-start">
            <p>{indikator.nama}</p>
            <p> : </p>
          </div>
          {indikator.indikatorTujuanTargetList.map((target) => (
            <div
              key={target.id}
              className="col-span-2 flex items-start justify-between">
              <p>{target.target}</p>
              {isAdmin && (
                <Button
                  variant="ghost"
                  className="w-fit size-5 mr-4"
                  onClick={() => onEdit(target)}>
                  <PenSquare />
                </Button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default IndikatorTujuanColumn;
