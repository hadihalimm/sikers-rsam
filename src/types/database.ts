import {
  cascading,
  indikatorSasaran,
  indikatorTujuan,
  sasaran,
  tujuan,
} from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type Cascading = InferSelectModel<typeof cascading>;
export type Tujuan = InferSelectModel<typeof tujuan>;
export type IndikatorTujuan = InferSelectModel<typeof indikatorTujuan>;
export type Sasaran = InferSelectModel<typeof sasaran>;
export type IndikatorSasaran = InferSelectModel<typeof indikatorSasaran>;

export type TujuanWithIndikator = Tujuan & {
  indikatorTujuanList: IndikatorTujuan[];
};

export type SasaranWithIndikator = Sasaran & {
  indikatorSasaranList: IndikatorSasaran[];
};
