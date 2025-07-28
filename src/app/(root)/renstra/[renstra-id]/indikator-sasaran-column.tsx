import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IndikatorSasaran,
  IndikatorSasaranTarget,
  Kegiatan,
  Program,
  ProgramSasaran,
  Sasaran,
  SubKegiatan,
} from '@/types/database';
import { ArrowRight } from 'lucide-react';

type SasaranWithTargets = Sasaran & {
  indikatorSasaranList: (IndikatorSasaran & {
    indikatorSasaranTargetList: IndikatorSasaranTarget[];
  })[];
  programSasaranList: (ProgramSasaran & {
    program: Program & {
      kegiatanList: (Kegiatan & {
        subKegiatanList: SubKegiatan[];
      })[];
    };
  })[];
};

interface IndikatorSasaranColumnProps {
  sasaranList: SasaranWithTargets[];
  onEditTarget: (item: IndikatorSasaranTarget[]) => void;
}

const IndikatorSasaranColumn = ({
  sasaranList,
  onEditTarget,
}: IndikatorSasaranColumnProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      {sasaranList.map((sasaran, index) => (
        <div key={sasaran.id} className="flex flex-col gap-y-1">
          <p className="font-medium text-base text-foreground">
            {sasaran.judul}
          </p>
          {sasaran.indikatorSasaranList.map((indikator) => (
            <div key={indikator.id} className="flex gap-x-2">
              <p className="flex-1/2">Indikator: {indikator.nama}</p>
              <div className="flex-1/2 flex flex-col gap-y-1">
                <div className="flex gap-x-6 items-center">
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
          <p>Plus Program</p>
          {sasaran.programSasaranList.map((ps, index) => (
            <div key={ps.id}>
              <p>Program {index + 1}</p>
              <p>{ps.program.nama}</p>
            </div>
          ))}
          {index !== sasaranList.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};

export default IndikatorSasaranColumn;
