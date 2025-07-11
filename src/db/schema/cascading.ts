import { InferSelectModel, sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  check,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const cascading = pgTable('cascading', {
  id: serial('id').primaryKey(),
  judul: text('judul').notNull(),
  tahunMulai: integer('tahun_mulai').notNull(),
  tahunBerakhir: integer('tahun_berakhir').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tujuan = pgTable('tujuan', {
  id: serial('id').primaryKey(),
  judul: text('judul').notNull(),
  cascadingId: integer('cascading_id')
    .notNull()
    .references(() => cascading.id, { onDelete: 'restrict' }),
});

export const indikatorTujuan = pgTable('indikator_tujuan', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  tujuanId: integer('tujuan_id')
    .notNull()
    .references(() => tujuan.id, { onDelete: 'cascade' }),
});

export const sasaran = pgTable(
  'sasaran',
  {
    id: serial('id').primaryKey(),
    judul: text('judul').notNull(),
    pengampu: text('pengampu').notNull(),
    level: integer('level'),
    cascadingId: integer('cascading_id')
      .notNull()
      .references(() => cascading.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id').references((): AnyPgColumn => sasaran.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => [check('level_sasaran_check', sql`${table.level} > 0`)],
);

export const indikatorSasaran = pgTable('indikator_sasaran', {
  id: serial('id').primaryKey(),
  judul: text('judul').notNull(),
  sasaranId: integer('sasaran_id')
    .notNull()
    .references(() => sasaran.id, { onDelete: 'cascade' }),
});

export type Cascading = InferSelectModel<typeof cascading>;
export type Tujuan = InferSelectModel<typeof tujuan>;
export type IndikatorTujuan = InferSelectModel<typeof indikatorTujuan>;
export type Sasaran = InferSelectModel<typeof sasaran>;
export type IndikatorSasaran = InferSelectModel<typeof indikatorSasaran>;
