import FormDialog from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDeleteSasaran, useGetAllSasaran } from '@/hooks/query/sasaran';
import { Sasaran } from '@/types/database';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateOrUpdateSasaranForm from './sasaran-form';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import IndikatorSasaranTable from './indikator-sasaran-table';
import SasaranItem from './sasaran-item';

interface SasaranTableProps {
  tujuanId: number;
  cascadingId: number;
}

const SasaranTable = ({ tujuanId, cascadingId }: SasaranTableProps) => {
  const { data: sasaranList = [] } = useGetAllSasaran(tujuanId, cascadingId);
  console.log(sasaranList);
  const topLevelSasaran = sasaranList.filter((item) => item.parentId === null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSasaran, setSelectedSasaran] = useState<Sasaran>();
  const [selectedSasaranForIndikator, setSelectedSasaranForIndikator] =
    useState<Sasaran>();
  const deleteSasaran = useDeleteSasaran(tujuanId, cascadingId);

  return (
    <div className="flex flex-col gap-y-4">
      <Button
        className="w-fit"
        onClick={() => {
          setSelectedSasaran(undefined);
          setCreateDialogOpen(true);
        }}>
        <Plus />
        Tambah sasaran
      </Button>

      <div className="flex gap-x-4">
        <div className="border rounded-lg w-2/3 h-fit">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Sasaran</TableHead>
                <TableHead className="w-[30%]">Pengampu</TableHead>
                <TableHead className="w-[10%]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLevelSasaran.map((item) => (
                <SasaranItem
                  key={item.id}
                  sasaran={item}
                  level={0}
                  sasaranList={sasaranList}
                  onCreateSubSasaran={() => {
                    setSelectedSasaran(item);
                    setCreateDialogOpen(true);
                  }}
                  onUpdateSasaran={() => {
                    setSelectedSasaran(item);
                    setUpdateDialogOpen(true);
                  }}
                  onDeleteSasaran={() => {
                    setSelectedSasaran(item);
                    setDeleteDialogOpen(true);
                  }}
                  onSelectSasaranForIndikator={setSelectedSasaranForIndikator}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <IndikatorSasaranTable
          sasaran={selectedSasaranForIndikator}
          tujuanId={tujuanId}
          cascadingId={cascadingId}
        />
      </div>
      <FormDialog
        title="Tambah Sasaran"
        description={selectedSasaran ? `Dibawah: ${selectedSasaran.judul}` : ``}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}>
        <CreateOrUpdateSasaranForm
          tujuanId={tujuanId}
          cascadingId={cascadingId}
          level={selectedSasaran?.level ? selectedSasaran.level + 1 : 1}
          parentId={selectedSasaran?.level ? selectedSasaran.id : undefined}
          onSuccess={() => {
            setSelectedSasaran(undefined);
            setCreateDialogOpen(false);
          }}
        />
      </FormDialog>
      <FormDialog
        title="Update Sasaran"
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}>
        <CreateOrUpdateSasaranForm
          initialData={selectedSasaran}
          tujuanId={tujuanId}
          cascadingId={cascadingId}
          level={selectedSasaran?.level ? selectedSasaran.level + 1 : 1}
          parentId={selectedSasaran?.level ? selectedSasaran.id : undefined}
          onSuccess={() => {
            setSelectedSasaran(undefined);
            setUpdateDialogOpen(false);
          }}
        />
      </FormDialog>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          deleteSasaran.mutateAsync(selectedSasaran!.id);
        }}
      />
    </div>
  );
};

export default SasaranTable;
