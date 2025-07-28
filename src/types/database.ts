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
        kegiatanList: (Kegiatan & {
          subKegiatanList: SubKegiatan[];
        })[];
      };
    })[];
  })[];
};
