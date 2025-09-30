import {
  bigint,
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import {
  rencanaAksi,
  rencanaAksiPegawai,
  rencanaAksiPencapaianTarget,
  rencanaAksiSubKegiatanTarget,
  rencanaAksiTarget,
} from './rencana-aksi';
import { pegawai } from './pegawai';
import { relations } from 'drizzle-orm';
import { user } from './user';

export const realisasiRencanaAksi = pgTable('realisasi_rencana_aksi', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  tahun: integer('tahun').notNull(),
  rencanaAksiId: integer('rencana_aksi_id')
    .notNull()
    .references(() => rencanaAksi.id, { onDelete: 'cascade' })
    .unique(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
});

export const realisasiRencanaAksiPegawai = pgTable(
  'realisasi_rencana_aksi_pegawai',
  {
    id: serial('id').primaryKey(),
    tahun: integer('tahun').notNull(),
    status: boolean('status').default(false),
    pegawaiId: integer('pegawai_id')
      .notNull()
      .references(() => pegawai.id, { onDelete: 'restrict' }),
    realisasiRencanaAksiId: integer('realisasi_rencana_aksi_id')
      .notNull()
      .references(() => realisasiRencanaAksi.id, { onDelete: 'restrict' }),
    rencanaAksiPegawaiId: integer('rencana_aksi_pegawai_id')
      .notNull()
      .references(() => rencanaAksiPegawai.id, { onDelete: 'cascade' })
      .unique(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const realisasiRencanaAksiTarget = pgTable(
  'realisasi_rencana_aksi_target',
  {
    id: serial('id').primaryKey(),
    bulan: integer('bulan').notNull(),
    realisasi: numeric('realisasi', { mode: 'number' }),
    capaian: numeric('capaian', { mode: 'number' }),
    tindakLanjut: text('tindak_lanjut'),
    hambatan: text('hambatan'),
    rencanaAksiTargetId: integer('rencana_aksi_target_id')
      .notNull()
      .references(() => rencanaAksiTarget.id, { onDelete: 'cascade' }),
    realisasiRencanaAksiPegawaiId: integer('realisasi_rencana_aksi_id')
      .notNull()
      .references(() => realisasiRencanaAksiPegawai.id, {
        onDelete: 'cascade',
      }),
  },
);

export const realisasiRencanaAksiPencapaianTarget = pgTable(
  'realisasi_rencana_aksi_pencapaian_target',
  {
    id: serial('id').primaryKey(),
    realisasi: numeric('realisasi', { mode: 'number' }),
    capaian: numeric('capaian', { mode: 'number' }),
    rencanaAksiPencapaianTargetId: integer('rencana_aksi_pencapaian_target_id')
      .notNull()
      .references(() => rencanaAksiPencapaianTarget.id, {
        onDelete: 'cascade',
      }),
    realisasiRencanaAksiPegawaiId: integer('realisasi_rencana_aksi_pegawai_id')
      .notNull()
      .references(() => realisasiRencanaAksiPegawai.id, {
        onDelete: 'cascade',
      }),
  },
);

export const realisasiRencanaAksiSubkegiatanTarget = pgTable(
  'realisasi_rencana_aksi_subkegiatan_target',
  {
    id: serial('id').primaryKey(),
    realisasi: numeric('realisasi', { mode: 'number' }),
    realisasiAnggaran: bigint('anggaran', { mode: 'number' }),
    rencanaAksiSubKegiatanTargetId: integer(
      'rencana_aksi_subkegiatan_target_id',
    )
      .notNull()
      .references(() => rencanaAksiSubKegiatanTarget.id, {
        onDelete: 'cascade',
      }),
    realisasiRencanaAksiPegawaiId: integer('realisasi_rencana_aksi_pegawai_id')
      .notNull()
      .references(() => realisasiRencanaAksiPegawai.id, {
        onDelete: 'cascade',
      }),
  },
);

export const realisasiRencanaAksiRelations = relations(
  realisasiRencanaAksi,
  ({ one, many }) => ({
    user: one(user, {
      fields: [realisasiRencanaAksi.userId],
      references: [user.id],
    }),
    rencanaAksi: one(rencanaAksi, {
      fields: [realisasiRencanaAksi.rencanaAksiId],
      references: [rencanaAksi.id],
    }),
    realisasiRencanaAksiPegawaiList: many(realisasiRencanaAksiPegawai),
  }),
);

export const realisasiRencanaAksiPegawaiRelations = relations(
  realisasiRencanaAksiPegawai,
  ({ one, many }) => ({
    pegawai: one(pegawai, {
      fields: [realisasiRencanaAksiPegawai.pegawaiId],
      references: [pegawai.id],
    }),
    realisasiRencanaAksi: one(realisasiRencanaAksi, {
      fields: [realisasiRencanaAksiPegawai.realisasiRencanaAksiId],
      references: [realisasiRencanaAksi.id],
    }),
    rencanaAksiPegawai: one(rencanaAksiPegawai, {
      fields: [realisasiRencanaAksiPegawai.rencanaAksiPegawaiId],
      references: [rencanaAksiPegawai.id],
    }),
    realisasiRencanaAksiTargetList: many(realisasiRencanaAksiTarget),
    realisasiRencanaAksiLangkah: many(realisasiRencanaAksiPencapaianTarget),
    realisasiRencanaAksiSubkegiatanTarget: many(
      realisasiRencanaAksiSubkegiatanTarget,
    ),
  }),
);

export const realisasiRencanaAksiTargetRelations = relations(
  realisasiRencanaAksiTarget,
  ({ one }) => ({
    realisasiRencanaAksiPegawai: one(realisasiRencanaAksiPegawai, {
      fields: [realisasiRencanaAksiTarget.realisasiRencanaAksiPegawaiId],
      references: [realisasiRencanaAksiPegawai.id],
    }),
    rencanaAksiTarget: one(rencanaAksiTarget, {
      fields: [realisasiRencanaAksiTarget.rencanaAksiTargetId],
      references: [rencanaAksiTarget.id],
    }),
  }),
);

export const realisasiRencanaAksiPencapaianTargetRelations = relations(
  realisasiRencanaAksiPencapaianTarget,
  ({ one }) => ({
    realisasiRencanaAksiPegawai: one(realisasiRencanaAksiPegawai, {
      fields: [
        realisasiRencanaAksiPencapaianTarget.realisasiRencanaAksiPegawaiId,
      ],
      references: [realisasiRencanaAksiPegawai.id],
    }),
    rencanaAksiPencapaianTarget: one(rencanaAksiPencapaianTarget, {
      fields: [
        realisasiRencanaAksiPencapaianTarget.rencanaAksiPencapaianTargetId,
      ],
      references: [rencanaAksiPencapaianTarget.id],
    }),
  }),
);

export const realisasiRencanaAksiSubkegiatanTargetRelations = relations(
  realisasiRencanaAksiSubkegiatanTarget,
  ({ one }) => ({
    realisasiRencanaAksiPegawai: one(realisasiRencanaAksiPegawai, {
      fields: [
        realisasiRencanaAksiSubkegiatanTarget.realisasiRencanaAksiPegawaiId,
      ],
      references: [realisasiRencanaAksiPegawai.id],
    }),
    rencanaAksiSubKegiatanTarget: one(rencanaAksiSubKegiatanTarget, {
      fields: [
        realisasiRencanaAksiSubkegiatanTarget.rencanaAksiSubKegiatanTargetId,
      ],
      references: [rencanaAksiSubKegiatanTarget.id],
    }),
  }),
);
