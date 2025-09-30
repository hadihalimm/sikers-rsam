import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authClient } from '@/lib/auth-client';
import {
  IndikatorSasaran,
  IndikatorSasaranTarget,
  Kegiatan,
  Program,
  ProgramSasaran,
  RefKegiatan,
  RefProgram,
  RefSubKegiatan,
  Sasaran,
  SubKegiatan,
} from '@/types/database';
import { Plus, Trash } from 'lucide-react';

type SasaranWithTargets = Sasaran & {
  indikatorSasaranList: (IndikatorSasaran & {
    indikatorSasaranTargetList: IndikatorSasaranTarget[];
  })[];
  programSasaranList: (ProgramSasaran & {
    program: Program & {
      refProgram: RefProgram;
      kegiatan: Kegiatan & {
        refKegiatan: RefKegiatan;
        subKegiatanList: (SubKegiatan & {
          refSubKegiatan: RefSubKegiatan;
        })[];
      };
    };
  })[];
};

interface IndikatorSasaranColumnProps {
  sasaranList: SasaranWithTargets[];
  onEditTarget: (item: IndikatorSasaranTarget[]) => void;
  onAddProgram: (sasaran: Sasaran) => void;
  onDeleteProgram: (ps: ProgramSasaran) => void;
}

const IndikatorSasaranColumn = ({
  sasaranList,
  onEditTarget,
  onAddProgram,
  onDeleteProgram,
}: IndikatorSasaranColumnProps) => {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.roles?.includes('admin');

  return (
    <div className="flex flex-col gap-y-6">
      {sasaranList.map((sasaran, index) => (
        <div
          key={sasaran.id}
          className="flex flex-col gap-y-2 border px-2 py-2 rounded-lg">
          <p className="font-medium text-base text-foreground">
            {index + 1}. {sasaran.judul}
          </p>
          <div className="flex flex-col gap-y-4">
            {sasaran.indikatorSasaranList.map((indikator) => (
              <div key={indikator.id} className="flex flex-col">
                <p className="text-base">Indikator: {indikator.nama}</p>
                <div className="flex gap-x-2 w-fit">
                  <Table className="w-2/3 max-w-full">
                    <TableHeader>
                      <TableRow>
                        {indikator.indikatorSasaranTargetList.map(
                          (target, idx) => (
                            <TableHead
                              key={`${target.indikatorSasaranId}-${idx}`}
                              className="border">
                              {target.tahun}
                            </TableHead>
                          ),
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        {indikator.indikatorSasaranTargetList.map(
                          (target, idx) => (
                            <TableCell
                              key={`${target.indikatorSasaranId}-${idx}`}
                              className="border">
                              {target.target}
                            </TableCell>
                          ),
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                  {isAdmin && (
                    <Button
                      size="sm"
                      className="w-10 h-5 text-xs"
                      onClick={() =>
                        onEditTarget(indikator.indikatorSasaranTargetList)
                      }>
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-1">
            {isAdmin && (
              <div className="flex justify-end">
                <Button
                  className="w-fit h-6 text-xs"
                  size="sm"
                  onClick={() => onAddProgram(sasaran)}>
                  <Plus />
                  <p>Program</p>
                </Button>
              </div>
            )}

            {sasaran.programSasaranList.map((ps, index) => (
              <div
                key={ps.id}
                className="flex flex-col gap-y-1 border rounded-lg p-2">
                <div className="flex gap-x-2 justify-between">
                  <p className="font-medium">
                    Program {index + 1} : {ps.program.refProgram.nama}
                  </p>
                  {isAdmin && (
                    <Button
                      className="w-6 h-6 text-xs"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onDeleteProgram(ps);
                      }}>
                      <Trash />
                    </Button>
                  )}
                </div>
                <div className="ml-2">
                  <p>Kegiatan: {ps.program.kegiatan.refKegiatan.nama}</p>
                  <ul className="list-disc ml-4">
                    {ps.program.kegiatan.subKegiatanList.map((sub) => (
                      <li key={sub.id}>{sub.refSubKegiatan.nama}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          {/* {index !== sasaranList.length - 1 && <Separator className="mt-4" />} */}
        </div>
      ))}
    </div>
  );
};

export default IndikatorSasaranColumn;
