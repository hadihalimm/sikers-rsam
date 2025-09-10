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

export type RencanaKinerjaTahunan = InferSelectModel<
  typeof schema.rencanaKinerjaTahunan
>;
export type RencanaKinerjaTahunanDetail = InferSelectModel<
  typeof schema.rencanaKinerjaTahunanDetail
>;

export type Pegawai = InferSelectModel<typeof schema.pegawai>;
export type PerjanjianKinerja = InferSelectModel<
  typeof schema.perjanjianKinerja
>;
export type PerjanjianKinerjaPegawai = InferSelectModel<
  typeof schema.perjanjianKinerjaPegawai
> & {
  pegawai: Pegawai;
};
export type PerjanjianKinerjaPegawaiSasaran = InferSelectModel<
  typeof schema.perjanjianKinerjaPegawaiSasaran
>;
export type PerjanjianKinerjaPegawaiProgram = InferSelectModel<
  typeof schema.perjanjianKinerjaPegawaiProgram
>;

export type RencanaAksi = InferSelectModel<typeof schema.rencanaAksi>;
export type RencanaAksiPegawai = InferSelectModel<
  typeof schema.rencanaAksiPegawai
> & {
  pegawai: Pegawai;
};
export type RencanaAksiTarget = InferSelectModel<
  typeof schema.rencanaAksiTarget
> & {
  perjanjianKinerjaPegawaiSasaran: PerjanjianKinerjaPegawaiSasaran & {
    satuan: Satuan;
  };
};
export type RencanaAksiPencapaianLangkah = InferSelectModel<
  typeof schema.rencanaAksiPencapaianLangkah
>;
export type RencanaAksiPencapaianTarget = InferSelectModel<
  typeof schema.rencanaAksiPencapaianTarget
>;
export type RencanaAksiSubKegiatanTarget = InferSelectModel<
  typeof schema.rencanaAksiSubKegiatanTarget
>;
export type Satuan = InferSelectModel<typeof schema.satuan>;

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

export type RencanaKinerjaTahunanDetailWithSasaran = {
  detail: RencanaKinerjaTahunanDetail;
  indikatorSasaran: IndikatorSasaran;
  sasaran: Sasaran;
};

export type PerjanjianKinerjaPegawaiSasaranDetail = {
  detail: PerjanjianKinerjaPegawaiSasaran;
  satuan: Satuan;
  indikatorSasaran: IndikatorSasaran;
  sasaran: Sasaran;
};

export type PerjanjianKinerjaPegawaiProgramDetail = {
  pkPegawaiProgram: PerjanjianKinerjaPegawaiProgram;
  sasaran: Sasaran;
  program: RefProgram;
  kegiatan: RefKegiatan;
  subKegiatan: RefSubKegiatan;
};

export type RencanaAksiPegawaiDetail = {
  rencanaAksiPegawai: RencanaAksiPegawai;
  perjanjianKinerjaPegawai: PerjanjianKinerjaPegawai;
  perjanjianKinerjaPegawaiSasaran: PerjanjianKinerjaPegawaiSasaran;
  perjanjianKinerjaPegawaiProgram: PerjanjianKinerjaPegawaiProgram;
  indikatorSasaran: IndikatorSasaran;
  sasaran: Sasaran;
};

export type RencanaAksiPencapaianDetail = RencanaAksiPencapaianLangkah & {
  rencanaAksiPencapaianTargetList: (RencanaAksiPencapaianTarget & {
    satuan: Satuan;
  })[];
};

export type RencanaAksiSubkegiatanTargetDetail = {
  rencanaAksiSubKegiatanTarget: RencanaAksiSubKegiatanTarget;
  perjanjianKinerjaPegawaiProgram: PerjanjianKinerjaPegawaiProgram;
  perjanjianKinerjaPegawaiSasaran: PerjanjianKinerjaPegawaiSasaran;
  satuan: Satuan;
  refProgram: RefProgram;
  refKegiatan: RefKegiatan;
  refSubKegiatan: RefSubKegiatan;
};
