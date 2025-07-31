import * as schema from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof schema.user>;
export type Session = InferSelectModel<typeof schema.session>;
export type Account = InferSelectModel<typeof schema.account>;
export type Verification = InferSelectModel<typeof schema.verification>;

export type Cascading = InferSelectModel<typeof schema.cascading>;
export type Tujuan = InferSelectModel<typeof schema.tujuan>;
export type IndikatorTujuan = InferSelectModel<typeof schema.indikatorTujuan>;
export type Sasaran = InferSelectModel<typeof schema.sasaran>;
export type IndikatorSasaran = InferSelectModel<typeof schema.indikatorSasaran>;

export type Renstra = InferSelectModel<typeof schema.renstra>;
export type IndikatorTujuanTarget = InferSelectModel<
  typeof schema.indikatorTujuanTarget
>;
export type ProgramSasaran = InferSelectModel<typeof schema.programSasaran>;
export type IndikatorSasaranTarget = InferSelectModel<
  typeof schema.indikatorSasaranTarget
>;
export type Program = InferSelectModel<typeof schema.program>;
export type Kegiatan = InferSelectModel<typeof schema.kegiatan>;
export type SubKegiatan = InferSelectModel<typeof schema.subKegiatan>;

export type RefProgram = InferSelectModel<typeof schema.refProgram>;
export type RefKegiatan = InferSelectModel<typeof schema.refKegiatan>;
export type RefSubKegiatan = InferSelectModel<typeof schema.refSubKegiatan>;

export type IndikatorKinerjaUtama = InferSelectModel<
  typeof schema.indikatorKinerjaUtama
>;
export type IndikatorKinerjaUtamaDetail = InferSelectModel<
  typeof schema.indikatorKinerjaUtamaDetail
>;

export type TujuanWithIndikator = Tujuan & {
  indikatorTujuanList: IndikatorTujuan[];
};

export type SasaranWithIndikator = Sasaran & {
  indikatorSasaranList: IndikatorSasaran[];
};

export type RenstraWithCascading = Renstra & {
  cascading: Cascading;
};

export type RenstraDetail = Tujuan & {
  indikatorTujuanList: (IndikatorTujuan & {
    indikatorTujuanTargetList: IndikatorTujuanTarget[];
  })[];
  sasaranList: (Sasaran & {
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
  })[];
};

export type IndikatorKinerjaUtamaWithCascading = IndikatorKinerjaUtama & {
  cascading: Cascading;
};

export type IndikatorKinerjaUtamaDetailWithSasaran = {
  detail: IndikatorKinerjaUtamaDetail;
  indikatorSasaran: IndikatorSasaran;
  sasaran: Sasaran;
};
