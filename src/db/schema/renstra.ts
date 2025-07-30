import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import {
  cascading,
  indikatorSasaran,
  indikatorTujuan,
  sasaran,
} from './cascading';
import { relations } from 'drizzle-orm';

export const renstra = pgTable('renstra', {
  id: serial('id').primaryKey(),
  judul: text('judul').notNull(),
  cascadingId: integer('cascading_id')
    .notNull()
    .references(() => cascading.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const indikatorTujuanTarget = pgTable('indikator_tujuan_target', {
  id: serial('id').primaryKey(),
  target: text('target'),
  indikatorTujuanId: integer('indikator_tujuan_id')
    .notNull()
    .references(() => indikatorTujuan.id, { onDelete: 'cascade' }),
  renstraId: integer('renstra_id')
    .notNull()
    .references(() => renstra.id, { onDelete: 'restrict' }),
});

export const programSasaran = pgTable('program_sasaran', {
  id: serial('id').primaryKey(),
  // programId: integer('program_id')
  //   .notNull()
  //   .references(() => program.id, { onDelete: 'restrict' }),
  sasaranId: integer('sasaran_id')
    .notNull()
    .references(() => sasaran.id, { onDelete: 'cascade' }),
  renstraId: integer('renstra_id')
    .notNull()
    .references(() => renstra.id, { onDelete: 'restrict' }),
});

export const indikatorSasaranTarget = pgTable('indikator_sasaran_target', {
  id: serial('id').primaryKey(),
  tahun: integer('tahun').notNull(),
  target: text('target'),
  indikatorSasaranId: integer('indikator_sasaran_id')
    .notNull()
    .references(() => indikatorSasaran.id, { onDelete: 'cascade' }),
  renstraId: integer('renstra_id')
    .notNull()
    .references(() => renstra.id, { onDelete: 'restrict' }),
});

export const program = pgTable('program', {
  id: serial('id').primaryKey(),
  // nama: text('nama').notNull(),
  programSasaranId: integer('program_sasaran_id')
    .notNull()
    .references(() => programSasaran.id, { onDelete: 'cascade' }),
  refProgramId: integer('ref_program_id')
    .notNull()
    .references(() => refProgram.id, { onDelete: 'restrict' }),
});

export const kegiatan = pgTable('kegiatan', {
  id: serial('id').primaryKey(),
  // nama: text('nama').notNull(),
  programId: integer('program_id')
    .notNull()
    .references(() => program.id, { onDelete: 'cascade' }),
  refKegiatanId: integer('ref_kegiatan_id')
    .notNull()
    .references(() => refKegiatan.id, { onDelete: 'restrict' }),
});

export const subKegiatan = pgTable('sub_kegiatan', {
  id: serial('id').primaryKey(),
  // nama: text('nama').notNull(),
  kegiatanId: integer('kegiatan_id')
    .notNull()
    .references(() => kegiatan.id, { onDelete: 'cascade' }),
  refSubKegiatanId: integer('ref_sub_kegiatan_id')
    .notNull()
    .references(() => refSubKegiatan.id, { onDelete: 'restrict' }),
});

export const refProgram = pgTable('ref_program', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
});

export const refKegiatan = pgTable('ref_kegiatan', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  refProgramId: integer('ref_program_id')
    .notNull()
    .references(() => refProgram.id, { onDelete: 'cascade' }),
});

export const refSubKegiatan = pgTable('ref_sub_kegiatan', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  refKegiatanId: integer('ref_kegiatan_id')
    .notNull()
    .references(() => refKegiatan.id, { onDelete: 'cascade' }),
});

export const renstraRelations = relations(renstra, ({ one, many }) => ({
  cascading: one(cascading, {
    fields: [renstra.cascadingId],
    references: [cascading.id],
  }),
  indikatorTujuanTargetList: many(indikatorTujuanTarget),
  programSasaranList: many(programSasaran),
  indikatorSasaranTargetList: many(indikatorSasaranTarget),
}));

export const indikatorTujuanTargetRelations = relations(
  indikatorTujuanTarget,
  ({ one }) => ({
    renstra: one(renstra, {
      fields: [indikatorTujuanTarget.renstraId],
      references: [renstra.id],
    }),
    indikatorTujuan: one(indikatorTujuan, {
      fields: [indikatorTujuanTarget.indikatorTujuanId],
      references: [indikatorTujuan.id],
    }),
  }),
);

export const programSasaranRelations = relations(programSasaran, ({ one }) => ({
  program: one(program, {
    fields: [programSasaran.id],
    references: [program.programSasaranId],
  }),
  sasaran: one(sasaran, {
    fields: [programSasaran.sasaranId],
    references: [sasaran.id],
  }),
  renstra: one(renstra, {
    fields: [programSasaran.renstraId],
    references: [renstra.id],
  }),
}));

export const indikatorSasaranTargetRelations = relations(
  indikatorSasaranTarget,
  ({ one }) => ({
    indikatorSasaran: one(indikatorSasaran, {
      fields: [indikatorSasaranTarget.indikatorSasaranId],
      references: [indikatorSasaran.id],
    }),
    renstra: one(renstra, {
      fields: [indikatorSasaranTarget.renstraId],
      references: [renstra.id],
    }),
  }),
);

export const programRelations = relations(program, ({ one }) => ({
  refProgram: one(refProgram, {
    fields: [program.refProgramId],
    references: [refProgram.id],
  }),
  kegiatan: one(kegiatan),
  programSasaran: one(programSasaran, {
    fields: [program.programSasaranId],
    references: [programSasaran.id],
  }),
}));

export const kegiatanRelations = relations(kegiatan, ({ one, many }) => ({
  refKegiatan: one(refKegiatan, {
    fields: [kegiatan.refKegiatanId],
    references: [refKegiatan.id],
  }),
  program: one(program, {
    fields: [kegiatan.programId],
    references: [program.id],
  }),
  subKegiatanList: many(subKegiatan),
}));

export const subKegiatanRelations = relations(subKegiatan, ({ one }) => ({
  refSubKegiatan: one(refSubKegiatan, {
    fields: [subKegiatan.refSubKegiatanId],
    references: [refSubKegiatan.id],
  }),
  kegiatan: one(kegiatan, {
    fields: [subKegiatan.kegiatanId],
    references: [kegiatan.id],
  }),
}));

export const refProgramRelations = relations(refProgram, ({ many }) => ({
  refKegiatanList: many(refKegiatan),
}));

export const refKegiatanRelations = relations(refKegiatan, ({ one, many }) => ({
  refProgram: one(refProgram, {
    fields: [refKegiatan.refProgramId],
    references: [refProgram.id],
  }),
  refSubKegiatanList: many(refSubKegiatan),
}));

export const refSubKegiatanRelations = relations(refSubKegiatan, ({ one }) => ({
  refKegiatan: one(refKegiatan, {
    fields: [refSubKegiatan.refKegiatanId],
    references: [refKegiatan.id],
  }),
}));
