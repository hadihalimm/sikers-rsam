import {
  bigint,
  boolean,
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
import { rencanaAksi, rencanaAksiPegawai } from './rencana-aksi';
import { satuan } from './satuan';

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
  status: boolean('status').default(false),
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
    satuanId: integer('satuan_id')
      .notNull()
      .references(() => satuan.id, { onDelete: 'restrict' }),
    modelCapaian: integer('modelCapaian').notNull(),
    indikatorSasaranId: integer('indikator_sasaran_id')
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
    sasaranId: integer('sasaran_id')
      .notNull()
      .references(() => sasaran.id, { onDelete: 'cascade' }),
    subKegiatanId: integer('sub_kegiatan_id').references(
      () => refSubKegiatan.id,
      { onDelete: 'cascade' },
    ),
    anggaran: bigint('anggaran', { mode: 'number' }),
    perjanjianKinerjaPegawaiSasaranId: integer(
      'perjanjian_kinerja_pegawai_sasaran_id',
    )
      .notNull()
      .references(() => perjanjianKinerjaPegawaiSasaran.id, {
        onDelete: 'cascade',
      }),
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

// export const perjanjianKinerjaPegawaiProgramDetail = pgTable(
//   'perjanjian_kinerja_pegawai_program_detail',
//   {
//     id: serial('id').primaryKey(),
//     subKegiatanId: integer('sub_kegiatan_id')
//       .notNull()
//       .references(() => refSubKegiatan.id, { onDelete: 'cascade' }),
//     anggaran: bigint('anggaran', { mode: 'number' }),
//     perjanjianKinerjaPegawaiProgramId: integer(
//       'perjanjian_kinerja_pegawai_program_id',
//     )
//       .notNull()
//       .references(() => perjanjianKinerjaPegawaiProgram.id, {
//         onDelete: 'cascade',
//       }),
//     createdAt: timestamp('created_at', { withTimezone: true })
//       .defaultNow()
//       .notNull(),
//     updatedAt: timestamp('updated_at', { withTimezone: true })
//       .defaultNow()
//       .notNull(),
//   },
// );

export const perjanjianKinerjaRelations = relations(
  perjanjianKinerja,
  ({ one, many }) => ({
    user: one(user, {
      fields: [perjanjianKinerja.userId],
      references: [user.id],
    }),
    perjanjianKinerjaPegawaiList: many(perjanjianKinerjaPegawai),
    rencanaAksi: one(rencanaAksi),
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
    rencanaAksiPegawai: one(rencanaAksiPegawai),
  }),
);

export const perjanjianKinerjaPegawaiSasaranRelations = relations(
  perjanjianKinerjaPegawaiSasaran,
  ({ one }) => ({
    satuan: one(satuan, {
      fields: [perjanjianKinerjaPegawaiSasaran.satuanId],
      references: [satuan.id],
    }),
    perjanjianKinerjaPegawai: one(perjanjianKinerjaPegawai, {
      fields: [perjanjianKinerjaPegawaiSasaran.perjanjianKinerjaPegawaiId],
      references: [perjanjianKinerjaPegawai.id],
    }),
    indikatorSasaran: one(indikatorSasaran, {
      fields: [perjanjianKinerjaPegawaiSasaran.indikatorSasaranId],
      references: [indikatorSasaran.id],
    }),
    perjanjianKinerjaPegawaiProgram: one(perjanjianKinerjaPegawaiProgram),
  }),
);

export const perjanjianKinerjaPegawaiProgramRelations = relations(
  perjanjianKinerjaPegawaiProgram,
  ({ one }) => ({
    sasaran: one(sasaran, {
      fields: [perjanjianKinerjaPegawaiProgram.sasaranId],
      references: [sasaran.id],
    }),
    perjanjianKinerjaPegawaiSasaran: one(perjanjianKinerjaPegawaiSasaran, {
      fields: [
        perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiSasaranId,
      ],
      references: [perjanjianKinerjaPegawaiSasaran.id],
    }),
  }),
);

// export const perjanjianKinerjaPegawaiProgramDetailRelations = relations(
//   perjanjianKinerjaPegawaiProgramDetail,
//   ({ one }) => ({
//     perjanjianKinerjaPegawaiProgram: one(perjanjianKinerjaPegawaiProgram, {
//       fields: [
//         perjanjianKinerjaPegawaiProgramDetail.perjanjianKinerjaPegawaiProgramId,
//       ],
//       references: [perjanjianKinerjaPegawaiProgram.id],
//     }),
//     subKegiatan: one(refSubKegiatan, {
//       fields: [perjanjianKinerjaPegawaiProgramDetail.subKegiatanId],
//       references: [refSubKegiatan.id],
//     }),
//   }),
// );
