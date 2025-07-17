import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tujuan } from '@/types/database';
import { MoreHorizontal } from 'lucide-react';

interface JudulTujuanColumnProps {
  tujuan: Tujuan;
  cascadingId: number;
  onEdit: (tujuan: Tujuan) => void;
  onDelete: (tujuan: Tujuan) => void;
}

const JudulTujuanColumn = ({
  tujuan,
  onEdit,
  onDelete,
}: JudulTujuanColumnProps) => {
  return (
    <div className="flex gap-x-4 items-center justify-between mr-8">
      <p className="font-medium whitespace-normal break-words">
        {tujuan.judul}
      </p>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onEdit(tujuan)}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(tujuan)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default JudulTujuanColumn;
