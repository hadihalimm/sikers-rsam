import { Button } from '@/components/ui/button';
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
import { ArrowRight, Plus, Trash } from 'lucide-react';

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
  return (
    <div className="flex flex-col gap-y-2">
      {sasaranList.map((sasaran, index) => (
        <div
          key={sasaran.id}
          className="flex flex-col gap-y-1 border px-2 py-2 rounded-lg border-blue-200">
          <p className="font-medium text-base text-foreground">
            {index + 1}. {sasaran.judul}
          </p>
          {sasaran.indikatorSasaranList.map((indikator) => (
            <div key={indikator.id} className="flex gap-x-2">
              <p className="flex-1/2">Indikator: {indikator.nama}</p>
              <div className="flex-1/2 flex flex-col gap-y-1">
                <div className="flex gap-x-5 items-center">
                  <p>Target</p>
                  <Button
                    size="sm"
                    className="w-10 h-5 text-xs"
                    onClick={() =>
                      onEditTarget(indikator.indikatorSasaranTargetList)
                    }>
                    Edit
                  </Button>
                </div>
                {indikator.indikatorSasaranTargetList.map((target) => (
                  <div key={target.id} className="flex gap-x-2 items-center">
                    <p>{target.tahun}</p>
                    <ArrowRight size={15} />
                    <p>{target.target}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button
            className="w-fit h-6 text-xs"
            size="sm"
            onClick={() => onAddProgram(sasaran)}>
            <Plus />
            <p>Program</p>
          </Button>

          {sasaran.programSasaranList.map((ps, index) => (
            <div
              key={ps.id}
              className="flex flex-col gap-y-1 border rounded-lg p-2">
              <div className="flex gap-x-2 justify-between">
                <p className="font-medium">
                  Program {index + 1} : {ps.program.refProgram.nama}
                </p>
                <Button
                  className="w-6 h-6 text-xs"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onDeleteProgram(ps);
                  }}>
                  <Trash />
                </Button>
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
          {/* {index !== sasaranList.length - 1 && <Separator className="mt-4" />} */}
        </div>
      ))}
    </div>
  );
};

export default IndikatorSasaranColumn;
