import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Sasaran } from '@/types/database';
import { ChevronRightIcon, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';

interface SasaranItemProps {
  sasaran: Sasaran;
  level: number;
  sasaranList: Sasaran[];
  onCreateSubSasaran: (sasaran: Sasaran) => void;
  onUpdateSasaran: (sasaran: Sasaran) => void;
  onDeleteSasaran: (sasaran: Sasaran) => void;
  onSelectSasaranForIndikator: (sasaran: Sasaran) => void;
}
const SasaranItem = ({
  sasaran,
  level,
  sasaranList,
  onCreateSubSasaran,
  onUpdateSasaran,
  onDeleteSasaran,
  onSelectSasaranForIndikator,
}: SasaranItemProps) => {
  const children = sasaranList.filter((item) => item.parentId === sasaran.id);
  const hasChildren = children.length > 0;
  const indentationStyle = { marginLeft: `${level * 40}px` };
  const [isOpen, setIsOpen] = useState(false);

  if (hasChildren) {
    return (
      <>
        <TableRow>
          <TableCell>
            <div className="flex gap-x-1 items-center" style={indentationStyle}>
              <Button
                variant="link"
                size="sm"
                className="w-5"
                onClick={() => setIsOpen(!isOpen)}>
                <ChevronRightIcon
                  className={`transition-transform duration-200 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
              </Button>
              <p
                className="whitespace-normal hover:text-primary hover:cursor-pointer hover:underline"
                onClick={() => onSelectSasaranForIndikator(sasaran)}>
                {sasaran.judul}
              </p>
            </div>
          </TableCell>
          <TableCell>{sasaran.pengampu}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    onCreateSubSasaran(sasaran);
                  }}>
                  <Plus />
                  Sub-sasaran
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onUpdateSasaran(sasaran);
                  }}>
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onDeleteSasaran(sasaran);
                  }}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>

        {isOpen &&
          children.map((item) => (
            <SasaranItem
              key={item.id}
              sasaran={item}
              level={level + 1}
              sasaranList={sasaranList}
              onCreateSubSasaran={onCreateSubSasaran}
              onUpdateSasaran={onUpdateSasaran}
              onDeleteSasaran={onDeleteSasaran}
              onSelectSasaranForIndikator={onSelectSasaranForIndikator}
            />
          ))}
      </>
    );
  }
  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex gap-x-2 items-center" style={indentationStyle}>
            <div className="w-4" />
            <p
              className="whitespace-normal hover:text-primary hover:cursor-pointer"
              onClick={() => onSelectSasaranForIndikator(sasaran)}>
              {sasaran.judul}
            </p>
          </div>
        </TableCell>
        <TableCell>{sasaran.pengampu}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  onCreateSubSasaran(sasaran);
                }}>
                <Plus />
                Sub-sasaran
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onUpdateSasaran(sasaran);
                }}>
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onDeleteSasaran(sasaran);
                }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isOpen &&
        children.map((item) => (
          <SasaranItem
            key={item.id}
            sasaran={item}
            level={level + 1}
            sasaranList={sasaranList}
            onCreateSubSasaran={onCreateSubSasaran}
            onUpdateSasaran={onUpdateSasaran}
            onDeleteSasaran={onDeleteSasaran}
            onSelectSasaranForIndikator={onSelectSasaranForIndikator}
          />
        ))}
    </>
  );
};

export default SasaranItem;
