import { relations, sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  check,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import {
  indikatorSasaranTarget,
  indikatorTujuanTarget,
  programSasaran,
  renstra,
} from './renstra';
import { indikatorKinerjaUtama } from './indikator-kinerja-utama';

export const cascading = pgTable('cascading', {
  id: serial('id').primaryKey(),
  judul: text('judul').notNull(),
  tahunMulai: integer('tahun_mulai').notNull(),
  tahunBerakhir: integer('tahun_berakhir').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
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
    level: integer('level').notNull(),
    tujuanId: integer('tujuan_id')
      .notNull()
      .references(() => tujuan.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id').references((): AnyPgColumn => sasaran.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => [check('level_sasaran_check', sql`${table.level} > 0`)],
);

export const indikatorSasaran = pgTable('indikator_sasaran', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  sasaranId: integer('sasaran_id')
    .notNull()
    .references(() => sasaran.id, { onDelete: 'cascade' }),
});

export const cascadingRelations = relations(cascading, ({ many }) => ({
  tujuanList: many(tujuan),
  renstraList: many(renstra),
}));

export const tujuanRelations = relations(tujuan, ({ one, many }) => ({
  cascading: one(cascading, {
    fields: [tujuan.cascadingId],
    references: [cascading.id],
  }),
  indikatorTujuanList: many(indikatorTujuan),
  sasaranList: many(sasaran),
}));

export const indikatorTujuanRelations = relations(
  indikatorTujuan,
  ({ one, many }) => ({
    tujuan: one(tujuan, {
      fields: [indikatorTujuan.tujuanId],
      references: [tujuan.id],
    }),
    indikatorTujuanTargetList: many(indikatorTujuanTarget),
  }),
);

export const sasaranRelations = relations(sasaran, ({ one, many }) => ({
  tujuan: one(tujuan, {
    fields: [sasaran.tujuanId],
    references: [tujuan.id],
  }),
  parent: one(sasaran, {
    fields: [sasaran.parentId],
    references: [sasaran.id],
    relationName: 'parent_children',
  }),
  children: many(sasaran, {
    relationName: 'parent_children',
  }),
  indikatorSasaranList: many(indikatorSasaran),
  programSasaranList: many(programSasaran),
}));

export const indikatorSasaranRelations = relations(
  indikatorSasaran,
  ({ one, many }) => ({
    sasaran: one(sasaran, {
      fields: [indikatorSasaran.sasaranId],
      references: [sasaran.id],
    }),
    indikatorSasaranTargetList: many(indikatorSasaranTarget),
    indikatorKinerjaUtamaList: many(indikatorKinerjaUtama),
  }),
);
