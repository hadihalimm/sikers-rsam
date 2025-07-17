import {
  account,
  cascading,
  indikatorSasaran,
  indikatorTujuan,
  sasaran,
  session,
  tujuan,
  user,
  verification,
} from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;

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
