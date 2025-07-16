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
  setCreateDialogOpen: (open: boolean) => void;
  setUpdateDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedSasaran: (sasaran: Sasaran) => void;
  setSelectedSasaranForIndikator: (sasaran: Sasaran) => void;
}
const SasaranItem = ({
  sasaran,
  level,
  sasaranList,
  setCreateDialogOpen,
  setUpdateDialogOpen,
  setDeleteDialogOpen,
  setSelectedSasaran,
  setSelectedSasaranForIndikator,
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
                className="whitespace-normal hover:text-primary hover:cursor-pointer"
                onClick={() => setSelectedSasaranForIndikator(sasaran)}>
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
                    setSelectedSasaran(sasaran);
                    setCreateDialogOpen(true);
                  }}>
                  <Plus />
                  Sub-sasaran
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSasaran(sasaran);
                    setUpdateDialogOpen(true);
                  }}>
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSasaran(sasaran);
                    setDeleteDialogOpen(true);
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
              setCreateDialogOpen={setCreateDialogOpen}
              setUpdateDialogOpen={setUpdateDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              setSelectedSasaran={setSelectedSasaran}
              setSelectedSasaranForIndikator={setSelectedSasaranForIndikator}
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
              onClick={() => setSelectedSasaranForIndikator(sasaran)}>
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
                  setSelectedSasaran(sasaran);
                  setCreateDialogOpen(true);
                }}>
                <Plus />
                Sub-sasaran
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSasaran(sasaran);
                  setUpdateDialogOpen(true);
                }}>
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSasaran(sasaran);
                  setDeleteDialogOpen(true);
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
            setCreateDialogOpen={setCreateDialogOpen}
            setUpdateDialogOpen={setUpdateDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            setSelectedSasaran={setSelectedSasaran}
            setSelectedSasaranForIndikator={setSelectedSasaranForIndikator}
          />
        ))}
    </>
  );
};

export default SasaranItem;
