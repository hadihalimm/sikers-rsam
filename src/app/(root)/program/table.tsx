/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDeleteRefProgram,
  useGetProgramDetail,
} from '@/hooks/query/ref/ref-program';
import { RefKegiatan, RefProgram, RefSubKegiatan } from '@/types/database';
import { Ellipsis, Plus } from 'lucide-react';
import { useState } from 'react';
import ProgramDetailForm from './form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { useDeleteRefKegiatan } from '@/hooks/query/ref/ref-kegiatan';
import { useDeleteRefSubKegiatan } from '@/hooks/query/ref/ref-sub-kegiatan';

const ProgramTable = () => {
  const { data = [] } = useGetProgramDetail();
  const [editDialog, setEditDialog] = useState({
    program: false,
    kegiatan: false,
    subKegiatan: false,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    program: false,
    kegiatan: false,
    subKegiatan: false,
  });
  const [editingItem, setEditingItem] = useState<{
    program?: RefProgram;
    kegiatan?: RefKegiatan;
    subKegiatan?: RefSubKegiatan;
    programId?: number;
    kegiatanId?: number;
  }>();

  const handleEdit = (
    type: 'program' | 'kegiatan' | 'subKegiatan',
    item: any,
    parentId?: number,
  ) => {
    if (type === 'kegiatan') {
      setEditingItem({ kegiatan: item, programId: parentId });
    } else if (type === 'subKegiatan') {
      setEditingItem({ subKegiatan: item, kegiatanId: parentId });
    } else {
      setEditingItem({ program: item });
    }
    setEditDialog((prev) => ({ ...prev, [type]: true }));
  };

  const handleDelete = (
    type: 'program' | 'kegiatan' | 'subKegiatan',
    item: any,
  ) => {
    setEditingItem({ [type]: item });
    setDeleteDialog((prev) => ({ ...prev, [type]: true }));
  };

  const deleteProgram = useDeleteRefProgram();
  const deleteKegiatan = useDeleteRefKegiatan();
  const deleteSubKegiatan = useDeleteRefSubKegiatan();

  return (
    <div className="flex flex-col gap-y-4">
      <Button
        className="w-fit mt-6"
        size="sm"
        onClick={() => {
          setEditingItem({});
          setEditDialog((prev) => ({ ...prev, program: true }));
        }}>
        <Plus />
        Tambah Program
      </Button>
      <div className="flex flex-wrap gap-4">
        {data.map((program) => (
          <Card key={program.id} className="w-123">
            <CardHeader>
              <CardTitle className="flex justify-between gap-x-2">
                <p>{program.nama}</p>
                <DropdownAction
                  type="program"
                  item={program}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm flex flex-col gap-y-8">
              {program.refKegiatanList.map((kegiatan) => (
                <div key={kegiatan.id} className="flex flex-col gap-y-1">
                  <div className="flex gap-x-4">
                    <p className="font-semibold">{kegiatan.nama}</p>
                    <DropdownAction
                      type="kegiatan"
                      item={kegiatan}
                      onEdit={(type, item) =>
                        handleEdit(type, item, program.id)
                      }
                      onDelete={(type, item) => handleDelete(type, item)}
                    />
                  </div>
                  <ul>
                    {kegiatan.refSubKegiatanList.map((subkegiatan) => (
                      <li key={subkegiatan.id} className="ml-4 list-disc">
                        <div className="flex gap-x-4">
                          <p>{subkegiatan.nama}</p>
                          <DropdownAction
                            type="subKegiatan"
                            item={subkegiatan}
                            onEdit={(type, item) =>
                              handleEdit(type, item, kegiatan.id)
                            }
                            onDelete={handleDelete}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-fit mt-3 h-5 ml-4"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingItem({ kegiatanId: kegiatan.id });
                      setEditDialog((prev) => ({ ...prev, subKegiatan: true }));
                    }}>
                    <Plus />
                    Tambah Sub-kegiatan
                  </Button>
                </div>
              ))}
              <Button
                className="w-fit mt-4 h-6"
                size="sm"
                onClick={() => {
                  setEditingItem({ programId: program.id });
                  setEditDialog((prev) => ({ ...prev, kegiatan: true }));
                }}>
                <Plus />
                Tambah Kegiatan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <FormDialog
        title={editingItem?.program ? 'Edit Program' : 'Tambah Program'}
        open={editDialog.program}
        onOpenChange={(open) =>
          setEditDialog((prev) => ({ ...prev, program: open }))
        }>
        <ProgramDetailForm
          type="program"
          initialData={editingItem?.program}
          onSuccess={() => {
            setEditDialog((prev) => ({ ...prev, program: false }));
          }}
        />
      </FormDialog>

      <FormDialog
        title={editingItem?.kegiatan ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
        open={editDialog.kegiatan}
        onOpenChange={(open) =>
          setEditDialog((prev) => ({ ...prev, kegiatan: open }))
        }>
        <ProgramDetailForm
          type="kegiatan"
          initialData={editingItem?.kegiatan}
          programId={editingItem?.programId}
          onSuccess={() => {
            setEditDialog((prev) => ({ ...prev, kegiatan: false }));
          }}
        />
      </FormDialog>

      <FormDialog
        title={
          editingItem?.subKegiatan ? 'Edit Sub-kegiatan' : 'Tambah Sub-kegiatan'
        }
        open={editDialog.subKegiatan}
        onOpenChange={(open) =>
          setEditDialog((prev) => ({ ...prev, subKegiatan: open }))
        }>
        <ProgramDetailForm
          type="subKegiatan"
          initialData={editingItem?.subKegiatan}
          kegiatanId={editingItem?.kegiatanId}
          onSuccess={() => {
            setEditDialog((prev) => ({ ...prev, subKegiatan: false }));
          }}
        />
      </FormDialog>

      <DeleteAlertDialog
        open={deleteDialog.program}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, program: open }))
        }
        onSuccess={async () => {
          await deleteProgram.mutateAsync(editingItem!.program!.id);
          setDeleteDialog((prev) => ({ ...prev, program: false }));
        }}
      />
      <DeleteAlertDialog
        open={deleteDialog.kegiatan}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, kegiatan: open }))
        }
        onSuccess={async () => {
          await deleteKegiatan.mutateAsync(editingItem!.kegiatan!.id);
          setDeleteDialog((prev) => ({ ...prev, kegiatan: false }));
        }}
      />
      <DeleteAlertDialog
        open={deleteDialog.subKegiatan}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, subKegiatan: open }))
        }
        onSuccess={async () => {
          await deleteSubKegiatan.mutateAsync(editingItem!.subKegiatan!.id);
          setDeleteDialog((prev) => ({ ...prev, subKegiatan: false }));
        }}
      />
    </div>
  );
};

interface DropdownActionProps {
  type: 'program' | 'kegiatan' | 'subKegiatan';
  item: RefProgram | RefKegiatan | RefSubKegiatan;
  onEdit: (type: DropdownActionProps['type'], item: any) => void;
  onDelete: (type: DropdownActionProps['type'], item: any) => void;
}

const DropdownAction = ({
  type,
  item,
  onEdit,
  onDelete,
}: DropdownActionProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-5">
          <span className="sr-only">Open menu</span>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onEdit(type, item)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(type, item)}>
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProgramTable;
