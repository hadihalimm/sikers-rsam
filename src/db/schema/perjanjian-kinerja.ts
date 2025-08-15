import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './user';
import { pegawai } from './pegawai';
import { indikatorSasaran, sasaran } from './cascading';
import { refSubKegiatan } from './renstra';
import { relations } from 'drizzle-orm';

export const perjanjianKinerja = pgTable('perjanjian_kinerja', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  tahun: integer('tahun').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
});

export const perjanjianKinerjaPegawai = pgTable('perjanjian_kinerja_pegawai', {
  id: serial('id').primaryKey(),
  tahun: integer('tahun').notNull(),
  pegawaiId: integer('pegawai_id')
    .notNull()
    .references(() => pegawai.id, { onDelete: 'restrict' }),
  perjanjianKinerjaId: integer('perjanjian_kinerja_id')
    .notNull()
    .references(() => perjanjianKinerja.id, { onDelete: 'restrict' }),
});

export const perjanjianKinerjaPegawaiSasaran = pgTable(
  'perjanjian_kinerja_pegawai_sasaran',
  {
    id: serial('id').primaryKey(),
    target: text('target').notNull(),
    modelCapaian: integer('modelCapaian').notNull(),
    indikatorSasaranId: integer('sasaran_id')
      .notNull()
      .references(() => indikatorSasaran.id, { onDelete: 'cascade' }),
    perjanjianKinerjaPegawaiId: integer('perjanjian_kinerja_pegawai_id')
      .notNull()
      .references(() => perjanjianKinerjaPegawai.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const perjanjianKinerjaPegawaiProgram = pgTable(
  'perjanjian_kinerja_pegawai_program',
  {
    id: serial('id').primaryKey(),
    subKegiatanId: integer('sub_kegiatan_id')
      .notNull()
      .references(() => refSubKegiatan.id, { onDelete: 'cascade' }),
    anggaran: bigint('anggaran', { mode: 'number' }),
    sasaranId: integer('sasaran_id')
      .notNull()
      .references(() => sasaran.id, { onDelete: 'cascade' }),
    perjanjianKinerjaPegawaiId: integer('perjanjian_kinerja_pegawai_id')
      .notNull()
      .references(() => perjanjianKinerjaPegawai.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const perjanjianKinerjaRelations = relations(
  perjanjianKinerja,
  ({ one, many }) => ({
    user: one(user, {
      fields: [perjanjianKinerja.userId],
      references: [user.id],
    }),
    perjanjianKinerjaPegawaiList: many(perjanjianKinerjaPegawai),
  }),
);

export const perjanjianKinerjaPegawaiRelations = relations(
  perjanjianKinerjaPegawai,
  ({ one, many }) => ({
    pegawai: one(pegawai, {
      fields: [perjanjianKinerjaPegawai.pegawaiId],
      references: [pegawai.id],
    }),
    perjanjianKinerja: one(perjanjianKinerja, {
      fields: [perjanjianKinerjaPegawai.perjanjianKinerjaId],
      references: [perjanjianKinerja.id],
    }),
    perjanjianKinerjaPegawaiSasaranList: many(perjanjianKinerjaPegawaiSasaran),
    perjanjianKinerjaPegawaiProgramList: many(perjanjianKinerjaPegawaiProgram),
  }),
);

export const perjanjianKinerjaPegawaiSasaranRelations = relations(
  perjanjianKinerjaPegawaiSasaran,
  ({ one }) => ({
    perjanjianKinerjaPegawai: one(perjanjianKinerjaPegawai, {
      fields: [perjanjianKinerjaPegawaiSasaran.perjanjianKinerjaPegawaiId],
      references: [perjanjianKinerjaPegawai.id],
    }),
    indikatorSasaran: one(indikatorSasaran, {
      fields: [perjanjianKinerjaPegawaiSasaran.indikatorSasaranId],
      references: [indikatorSasaran.id],
    }),
  }),
);

export const perjanjianKinerjaPegawaiProgramRelations = relations(
  perjanjianKinerjaPegawaiProgram,
  ({ one }) => ({
    subKegiatan: one(refSubKegiatan, {
      fields: [perjanjianKinerjaPegawaiProgram.subKegiatanId],
      references: [refSubKegiatan.id],
    }),
    sasaran: one(sasaran, {
      fields: [perjanjianKinerjaPegawaiProgram.sasaranId],
      references: [sasaran.id],
    }),
    perjanjianKinerjaPegawai: one(perjanjianKinerjaPegawai, {
      fields: [perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiId],
      references: [perjanjianKinerjaPegawai.id],
    }),
  }),
);
